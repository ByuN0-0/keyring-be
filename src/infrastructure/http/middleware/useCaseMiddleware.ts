import { Context, Next } from "hono";
import { Bindings, Variables } from "../../../types";
import { createUseCases } from "../factories/createUseCases";

export const useCaseMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const { userRepository, vaultRepository, sessionRepository } = c.get("repos");

  c.set(
    "useCases",
    createUseCases({ userRepository, vaultRepository, sessionRepository })
  );

  await next();
};
