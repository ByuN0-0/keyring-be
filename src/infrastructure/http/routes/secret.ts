import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { toSecretDto } from "../dtos";
import {
  assertObject,
  HttpError,
  parseSecretPayload,
  toHttpError,
} from "../validation";

const secretRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

secretRoutes.use("*", repositoryMiddleware);
secretRoutes.use("*", useCaseMiddleware);
secretRoutes.use("*", authMiddleware);

secretRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const folderId = c.req.query("folderId");

  const { getSecretsUseCase } = c.get("useCases");
  const secrets = await getSecretsUseCase.execute(userId, folderId);
  return c.json({ secrets: secrets.map(toSecretDto) });
});

secretRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  try {
    const secretData = parseSecretPayload(await c.req.json(), userId);
    const { createSecretUseCase } = c.get("useCases");
    await createSecretUseCase.execute(secretData);
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

secretRoutes.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  try {
    const secretData = parseSecretPayload(await c.req.json(), userId);
    const { updateSecretUseCase } = c.get("useCases");
    await updateSecretUseCase.execute({ ...secretData, id, user_id: userId });
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

secretRoutes.post("/batch", async (c) => {
  const userId = c.get("userId");
  try {
    const body = assertObject(await c.req.json());
    const create = Array.isArray(body.create) ? body.create : [];
    const update = Array.isArray(body.update) ? body.update : [];
    const deleteIds = Array.isArray(body.delete) ? body.delete : [];

    if (!Array.isArray(body.create) && body.create !== undefined) {
      throw new HttpError(400, "create is invalid");
    }
    if (!Array.isArray(body.update) && body.update !== undefined) {
      throw new HttpError(400, "update is invalid");
    }
    if (!Array.isArray(body.delete) && body.delete !== undefined) {
      throw new HttpError(400, "delete is invalid");
    }

    const { batchUpdateSecretsUseCase } = c.get("useCases");
    await batchUpdateSecretsUseCase.execute(
      {
        create: create.map((item) => parseSecretPayload(item, userId)),
        update: update.map((item) => parseSecretPayload(item, userId, true)),
        delete: deleteIds.map((id) => {
          if (typeof id !== "string" || id.trim() === "") {
            throw new HttpError(400, "delete contains invalid id");
          }
          return id;
        }),
      },
      userId
    );
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

secretRoutes.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  try {
    const { deleteSecretUseCase } = c.get("useCases");
    await deleteSecretUseCase.execute(id, userId);
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

export default secretRoutes;
