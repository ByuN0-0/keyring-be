import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { toFolderDto } from "../dtos";
import {
  assertObject,
  optionalNullableString,
  optionalNumber,
  optionalString,
  requiredString,
  toHttpError,
} from "../validation";

const folderRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

folderRoutes.use("*", repositoryMiddleware);
folderRoutes.use("*", useCaseMiddleware);
folderRoutes.use("*", authMiddleware);

folderRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const parentId = c.req.query("parentId");

  const { getFoldersUseCase } = c.get("useCases");
  const folders = await getFoldersUseCase.execute(userId, parentId);
  return c.json({ folders: folders.map(toFolderDto) });
});

folderRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  try {
    const body = assertObject(await c.req.json());
    const { createFolderUseCase } = c.get("useCases");
    await createFolderUseCase.execute({
      id: optionalString(body.id, "id") || crypto.randomUUID(),
      user_id: userId,
      parent_id: optionalNullableString(body.parent_id, "parent_id") ?? null,
      name: requiredString(body.name, "name"),
      sort_order: optionalNumber(body.sort_order, "sort_order") ?? 0,
    });
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

folderRoutes.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  try {
    const body = assertObject(await c.req.json());
    const { updateFolderUseCase } = c.get("useCases");
    await updateFolderUseCase.execute({
      id,
      user_id: userId,
      name: optionalString(body.name, "name"),
      parent_id: optionalNullableString(body.parent_id, "parent_id"),
      sort_order: optionalNumber(body.sort_order, "sort_order"),
    });
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

folderRoutes.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  try {
    const { deleteFolderUseCase } = c.get("useCases");
    await deleteFolderUseCase.execute(id, userId);
    return c.json({ success: true });
  } catch (error) {
    const httpError = toHttpError(error);
    return c.json({ error: httpError.message }, httpError.status);
  }
});

export default folderRoutes;
