import { Context, Next } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";
import { Bindings, Variables } from "../../../types";
import { DOSessionRepository } from "../../repositories/DOSessionRepository";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const sessionId = getCookie(c, "session_id");
  if (!sessionId) return c.json({ error: "Unauthorized" }, 401);

  const sessionRepository = new DOSessionRepository(c.env.SESSIONS);
  const session = await sessionRepository.get(sessionId);

  if (!session) return c.json({ error: "Session expired" }, 401);

  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  if (session.ua !== ua || session.ip !== ip) {
    await sessionRepository.delete(sessionId);
    deleteCookie(c, "session_id");
    return c.json({ error: "Session hijacked" }, 401);
  }

  c.set("userId", session.userId);
  // We might want to pass session info down too if needed
  c.set("session", session); 
  await next();
};
