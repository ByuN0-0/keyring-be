import { Context, Next } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";
import { Bindings, Variables } from "../../../types";
import { verifyJwt } from "../../crypto/jwt";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const token = getCookie(c, "session_id");
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) {
    deleteCookie(c, "session_id");
    return c.json({ error: "Session expired" }, 401);
  }

  const ua = c.req.header("User-Agent");
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  if (payload.ua !== ua || payload.ip !== ip) {
    deleteCookie(c, "session_id");
    return c.json({ error: "Session hijacked" }, 401);
  }

  c.set("userId", payload.sub);
  c.set("jwtPayload", payload);
  await next();
};
