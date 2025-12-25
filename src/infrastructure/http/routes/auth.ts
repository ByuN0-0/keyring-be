import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { Bindings, Variables } from "../../../types";
import { D1UserRepository } from "../../repositories/D1UserRepository";
import { KVSessionRepository } from "../../repositories/KVSessionRepository";
import { D1VaultRepository } from "../../repositories/D1VaultRepository";
import { createDb } from "../../db/client";
import { LoginUseCase } from "../../../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../../use-cases/auth/GetCurrentUserUseCase";
import { authMiddleware } from "../middleware/authMiddleware";

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  const db = createDb(c.env.DB);
  const userRepository = new D1UserRepository(db);
  const sessionRepository = new KVSessionRepository(c.env.SESSIONS);
  const loginUseCase = new LoginUseCase(userRepository, sessionRepository);

  try {
    const { sessionId, user, expiresAt } = await loginUseCase.execute(email, password, ua, ip);

    const isProd = c.env.NODE_ENV === "production";

    setCookie(c, "session_id", sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "Strict" : "Lax",
      maxAge: 900,
      path: "/",
    });

    return c.json({ user, expiresAt });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 401);
  }
});

auth.post("/logout", async (c) => {
  const sessionId = getCookie(c, "session_id");
  const sessionRepository = new KVSessionRepository(c.env.SESSIONS);
  const logoutUseCase = new LogoutUseCase(sessionRepository);

  await logoutUseCase.execute(sessionId);
  deleteCookie(c, "session_id");

  return c.json({ success: true });
});

auth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const session = c.get("session");

  const db = createDb(c.env.DB);
  const userRepository = new D1UserRepository(db);
  const vaultRepository = new D1VaultRepository(db);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository, vaultRepository);

  const result = await getCurrentUserUseCase.execute(userId, session!.expiresAt);

  return c.json(result);
});

export default auth;
