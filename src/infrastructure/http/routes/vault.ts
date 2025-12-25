import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { repositoryMiddleware } from "../middleware/repositoryMiddleware";
import { useCaseMiddleware } from "../middleware/useCaseMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const vault = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vault.use("*", repositoryMiddleware);
vault.use("*", useCaseMiddleware);
vault.use("*", authMiddleware);

vault.delete("/scopes/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const { deleteScopeUseCase } = c.get("useCases");
  
  await deleteScopeUseCase.execute(userId, id);
  return c.json({ success: true });
});

vault.post("/scopes/reorder", async (c) => {
  const userId = c.get("userId");
  const { scopeOrders } = await c.req.json();

  const { updateScopeOrderUseCase } = c.get("useCases");

  await updateScopeOrderUseCase.execute(userId, scopeOrders);
  return c.json({ success: true });
});

vault.get("/scopes", async (c) => {
  const userId = c.get("userId");
  const { getScopesUseCase } = c.get("useCases");

  const scopes = await getScopesUseCase.execute(userId);
  return c.json({ scopes });
});

vault.post("/scopes", async (c) => {
  const userId = c.get("userId");
  const { scope, scope_id } = await c.req.json();

  const { createScopeUseCase } = c.get("useCases");

  const id = await createScopeUseCase.execute(userId, scope, scope_id);
  return c.json({ id });
});

vault.get("/", async (c) => {
  const userId = c.get("userId");
  const { getFragmentsUseCase } = c.get("useCases");

  const fragments = await getFragmentsUseCase.execute(userId);
  return c.json({ fragments });
});

vault.post("/", async (c) => {
  const userId = c.get("userId");
  const { scope_uuid, key_name, encrypted_blob, salt } = await c.req.json();

  const { upsertFragmentUseCase } = c.get("useCases");

  await upsertFragmentUseCase.execute(
    userId,
    scope_uuid,
    key_name,
    encrypted_blob,
    salt
  );
  return c.json({ success: true });
});

export default vault;
