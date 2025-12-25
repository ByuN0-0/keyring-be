import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { VaultRepositoryImpl } from "../../repositories/VaultRepositoryImpl";
import { createDb } from "../../db/client";
import { GetScopesUseCase } from "../../../use-cases/vault/GetScopesUseCase";
import { CreateScopeUseCase } from "../../../use-cases/vault/CreateScopeUseCase";
import { GetFragmentsUseCase } from "../../../use-cases/vault/GetFragmentsUseCase";
import { UpsertFragmentUseCase } from "../../../use-cases/vault/UpsertFragmentUseCase";
import { authMiddleware } from "../middleware/authMiddleware";

import { UpdateScopeOrderUseCase } from "../../../use-cases/vault/UpdateScopeOrderUseCase";
import { DeleteScopeUseCase } from "../../../use-cases/vault/DeleteScopeUseCase";

const vault = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vault.use("*", authMiddleware);

vault.delete("/scopes/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const deleteScopeUseCase = new DeleteScopeUseCase(vaultRepository);
  
  await deleteScopeUseCase.execute(userId, id);
  return c.json({ success: true });
});

vault.post("/scopes/reorder", async (c) => {
  const userId = c.get("userId");
  const { scopeOrders } = await c.req.json();

  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const updateScopeOrderUseCase = new UpdateScopeOrderUseCase(vaultRepository);

  await updateScopeOrderUseCase.execute(userId, scopeOrders);
  return c.json({ success: true });
});

vault.get("/scopes", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const getScopesUseCase = new GetScopesUseCase(vaultRepository);

  const scopes = await getScopesUseCase.execute(userId);
  return c.json({ scopes });
});

vault.post("/scopes", async (c) => {
  const userId = c.get("userId");
  const { scope, scope_id } = await c.req.json();

  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const createScopeUseCase = new CreateScopeUseCase(vaultRepository);

  const id = await createScopeUseCase.execute(userId, scope, scope_id);
  return c.json({ id });
});

vault.get("/", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const getFragmentsUseCase = new GetFragmentsUseCase(vaultRepository);

  const fragments = await getFragmentsUseCase.execute(userId);
  return c.json({ fragments });
});

vault.post("/", async (c) => {
  const userId = c.get("userId");
  const { scope_uuid, key_name, encrypted_blob, salt } = await c.req.json();

  const db = createDb(c.env.DB);
  const vaultRepository = new VaultRepositoryImpl(db);
  const upsertFragmentUseCase = new UpsertFragmentUseCase(vaultRepository);

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
