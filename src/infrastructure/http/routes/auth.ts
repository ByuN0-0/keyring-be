import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { signJwt } from "../../crypto/jwt";

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

auth.use("*", repositoryMiddleware);
auth.use("*", useCaseMiddleware);

const SESSION_TTL = 900; // 15 minutes
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";

async function getLoginAttempt(
  db: D1Database,
  email: string,
  ip: string
): Promise<{
  failed_count: number;
  locked_until: number | null;
  updated_at: number;
} | null> {
  return db
    .prepare(
      "SELECT failed_count, locked_until, updated_at FROM login_attempts WHERE email = ? AND ip = ?"
    )
    .bind(email, ip)
    .first<{
      failed_count: number;
      locked_until: number | null;
      updated_at: number;
    }>();
}

async function clearLoginAttempts(
  db: D1Database,
  email: string,
  ip: string
): Promise<void> {
  await db
    .prepare("DELETE FROM login_attempts WHERE email = ? AND ip = ?")
    .bind(email, ip)
    .run();
}

async function recordLoginFailure(
  db: D1Database,
  email: string,
  ip: string
): Promise<void> {
  const now = Date.now();
  const existing = await getLoginAttempt(db, email, ip);
  const isWithinWindow = existing && now - existing.updated_at < LOGIN_WINDOW_MS;
  const failedCount = isWithinWindow ? existing.failed_count + 1 : 1;
  const lockedUntil =
    failedCount >= LOGIN_MAX_FAILURES ? now + LOGIN_LOCK_MS : null;

  await db
    .prepare(
      `INSERT INTO login_attempts
        (id, email, ip, failed_count, locked_until, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(email, ip) DO UPDATE SET
        failed_count = excluded.failed_count,
        locked_until = excluded.locked_until,
        updated_at = excluded.updated_at`
    )
    .bind(crypto.randomUUID(), email, ip, failedCount, lockedUntil, now, now)
    .run();
}

auth.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return c.json({ error: INVALID_CREDENTIALS_MESSAGE }, 401);
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;
  const ua = c.req.header("User-Agent") || "";
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  const { loginUseCase } = c.get("useCases");

  try {
    const attempt = await getLoginAttempt(c.env.DB, email, ip);
    if (attempt?.locked_until && attempt.locked_until > Date.now()) {
      return c.json({ error: INVALID_CREDENTIALS_MESSAGE }, 401);
    }

    const { user } = await loginUseCase.execute(email, password);
    await clearLoginAttempts(c.env.DB, email, ip);

    const expiresAt = Date.now() + SESSION_TTL * 1000;
    const token = await signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        ua,
        ip,
        exp: Math.floor(expiresAt / 1000),
      },
      c.env.JWT_SECRET
    );

    const isProd = c.env.NODE_ENV === "production";

    setCookie(c, "session_id", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "Strict" : "Lax",
      maxAge: SESSION_TTL,
      path: "/",
    });

    return c.json({ user, expiresAt });
  } catch (e) {
    await recordLoginFailure(c.env.DB, email, ip);
    return c.json({ error: INVALID_CREDENTIALS_MESSAGE }, 401);
  }
});

auth.post("/logout", async (c) => {
  deleteCookie(c, "session_id");
  return c.json({ success: true });
});

auth.get("/me", authMiddleware, async (c) => {
  const payload = c.get("jwtPayload")!;

  return c.json({
    user: { id: payload.sub, name: payload.name, email: payload.email },
    expiresAt: payload.exp * 1000,
  });
});

export default auth;
