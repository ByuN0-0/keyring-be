import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const folderRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

folderRoutes.use("*", repositoryMiddleware);
folderRoutes.use("*", useCaseMiddleware);
folderRoutes.use("*", authMiddleware);

folderRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const parentId = c.req.query("parentId");

  const { getFoldersUseCase } = c.get("useCases");
  const folders = await getFoldersUseCase.execute(userId, parentId);
  return c.json({ folders });
});

folderRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  const folderData = await c.req.json();

  const { createFolderUseCase } = c.get("useCases");
  await createFolderUseCase.execute({ ...folderData, user_id: userId });
  return c.json({ success: true });
});

folderRoutes.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const folderData = await c.req.json();

  const { updateFolderUseCase } = c.get("useCases");
  await updateFolderUseCase.execute({ ...folderData, id, user_id: userId });
  return c.json({ success: true });
});

folderRoutes.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { deleteFolderUseCase } = c.get("useCases");
  await deleteFolderUseCase.execute(id, userId);
  return c.json({ success: true });
});

export default folderRoutes;
