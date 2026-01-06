import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const secretRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

secretRoutes.use("*", repositoryMiddleware);
secretRoutes.use("*", useCaseMiddleware);
secretRoutes.use("*", authMiddleware);

secretRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const folderId = c.req.query("folderId");

  const { getSecretsUseCase } = c.get("useCases");
  const secrets = await getSecretsUseCase.execute(userId, folderId);
  return c.json({ secrets });
});

secretRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  const secretData = await c.req.json();

  const { createSecretUseCase } = c.get("useCases");
  await createSecretUseCase.execute({ ...secretData, user_id: userId });
  return c.json({ success: true });
});

secretRoutes.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const secretData = await c.req.json();

  const { updateSecretUseCase } = c.get("useCases");
  await updateSecretUseCase.execute({ ...secretData, id, user_id: userId });
  return c.json({ success: true });
});

secretRoutes.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { deleteSecretUseCase } = c.get("useCases");
  await deleteSecretUseCase.execute(id, userId);
  return c.json({ success: true });
});

export default secretRoutes;
