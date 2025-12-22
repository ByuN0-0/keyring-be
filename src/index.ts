import { Hono } from "hono";
import { cors } from "hono/cors";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { v4 as uuidv4 } from "uuid";

type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
};

type Variables = {
  userId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: ["https://keyring.biyeon.store"],
    credentials: true,
  })
);

// Helper to hash password using Web Crypto API (SHA-256)
async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

import { Context, Next } from "hono";

// Middleware to check session
const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const sessionId = getCookie(c, "session_id");
  if (!sessionId) return c.json({ error: "Unauthorized" }, 401);

  const sessionData = await c.env.SESSIONS.get(sessionId);
  if (!sessionData) return c.json({ error: "Session expired" }, 401);

  const session = JSON.parse(sessionData);
  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  if (session.ua !== ua || session.ip !== ip) {
    await c.env.SESSIONS.delete(sessionId);
    deleteCookie(c, "session_id");
    return c.json({ error: "Session hijacked" }, 401);
  }

  c.set("userId", session.userId);
  await next();
};

app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const passwordHash = await hashPassword(password);

  const user = await c.env.DB.prepare(
    "SELECT * FROM users WHERE email = ? AND password_hash = ?"
  )
    .bind(email, passwordHash)
    .first<{ id: string; name: string; email: string }>();

  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const sessionId = uuidv4();
  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  const expiresAt = Date.now() + 900 * 1000; // 15 minutes from now
  const session = {
    userId: user.id,
    ua,
    ip,
    createdAt: Date.now(),
    expiresAt,
  };

  await c.env.SESSIONS.put(sessionId, JSON.stringify(session), {
    expirationTtl: 900,
  });

  setCookie(c, "session_id", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 900,
    path: "/",
  });

  return c.json({
    user: { id: user.id, name: user.name, email: user.email },
    expiresAt,
  });
});

app.post("/auth/logout", async (c) => {
  const sessionId = getCookie(c, "session_id");
  if (sessionId) {
    await c.env.SESSIONS.delete(sessionId);
    deleteCookie(c, "session_id");
  }
  return c.json({ success: true });
});

app.get("/auth/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const sessionId = getCookie(c, "session_id");
  const sessionData = await c.env.SESSIONS.get(sessionId!);
  const session = JSON.parse(sessionData!);

  const user = await c.env.DB.prepare(
    "SELECT id, name, email FROM users WHERE id = ?"
  )
    .bind(userId)
    .first();
  return c.json({ user, expiresAt: session.expiresAt });
});

// Vault Routes
app.get("/vault", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const fragments = await c.env.DB.prepare(
    "SELECT f.*, s.scope, s.scope_id FROM vault_fragments f LEFT JOIN vault_scopes s ON f.scope_pk = s.id WHERE f.user_id = ?"
  )
    .bind(userId)
    .all();
  return c.json({ fragments: fragments.results });
});

app.post("/vault", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { scope_pk, scope, scope_id, encrypted_blob, salt } =
    await c.req.json();

  // Ensure scope exists if provided
  if (scope) {
    await c.env.DB.prepare(
      "INSERT INTO vault_scopes (id, user_id, scope, scope_id) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET scope = excluded.scope, scope_id = excluded.scope_id"
    )
      .bind(scope_pk, userId, scope || "global", scope_id || null)
      .run();
  }

  await c.env.DB.prepare(
    `INSERT INTO vault_fragments (scope_pk, user_id, encrypted_blob, salt, updated_at) 
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(scope_pk) DO UPDATE SET 
     encrypted_blob = excluded.encrypted_blob, 
     salt = excluded.salt, 
     updated_at = CURRENT_TIMESTAMP`
  )
    .bind(scope_pk, userId, encrypted_blob, salt)
    .run();

  return c.json({ success: true });
});

export default app;
