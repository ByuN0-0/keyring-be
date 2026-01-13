import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { toUserDto } from "../dtos";

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

auth.use("*", repositoryMiddleware);
auth.use("*", useCaseMiddleware);

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  const { loginUseCase } = c.get("useCases");

  try {
    const { sessionId, user, expiresAt } = await loginUseCase.execute(
      email,
      password,
      ua,
      ip
    );

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
  const { logoutUseCase } = c.get("useCases");

  await logoutUseCase.execute(sessionId);
  deleteCookie(c, "session_id");

  return c.json({ success: true });
});

auth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const session = c.get("session");

  const { getCurrentUserUseCase } = c.get("useCases");

  const { user, expiresAt } = await getCurrentUserUseCase.execute(
    userId,
    session!.expiresAt
  );

  return c.json({
    user: toUserDto(user),
    expiresAt,
  });
});

export default auth;
