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

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const ua = c.req.header("User-Agent") || "";
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  const { loginUseCase } = c.get("useCases");

  try {
    const { user } = await loginUseCase.execute(email, password);

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
    return c.json({ error: (e as Error).message }, 401);
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
