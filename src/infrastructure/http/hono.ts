import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings, Variables } from "../../types";
import authRoutes from "./routes/auth";
import vaultRoutes from "./routes/vault";

export const createApp = () => {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

  app.use(
    "*",
    cors({
      origin: ["https://keyring.biyeon.store"],
      credentials: true,
    })
  );

  app.route("/auth", authRoutes);
  app.route("/vault", vaultRoutes);

  return app;
};
