import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings, Variables } from "../../types";
import authRoutes from "./routes/auth";
import folderRoutes from "./routes/folder";
import secretRoutes from "./routes/secret";

export const createApp = () => {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

  app.use("*", async (c, next) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS.split(",").map((o) =>
      o.trim()
    );

    return cors({
      origin: allowedOrigins,
      credentials: true,
    })(c, next);
  });

  app.route("/auth", authRoutes);
  app.route("/folders", folderRoutes);
  app.route("/secrets", secretRoutes);

  return app;
};
