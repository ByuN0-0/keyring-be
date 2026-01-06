import { Context, Next } from "hono";
import { Bindings, Variables } from "../../../types";
import { createDb } from "../../db/client";
import { UserRepositoryImpl } from "../../repositories/UserRepositoryImpl";
import { FolderRepositoryImpl } from "../../repositories/FolderRepositoryImpl";
import { SecretRepositoryImpl } from "../../repositories/SecretRepositoryImpl";
import { DOSessionRepository } from "../../repositories/DOSessionRepository";

export const repositoryMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const db = createDb(c.env.DB);

  c.set("repos", {
    userRepository: new UserRepositoryImpl(db),
    folderRepository: new FolderRepositoryImpl(db),
    secretRepository: new SecretRepositoryImpl(db),
    sessionRepository: new DOSessionRepository(c.env.SESSIONS),
  });

  await next();
};
