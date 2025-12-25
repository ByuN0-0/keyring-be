import { Hono } from "hono";
import { Bindings, Variables } from "../../../types";
import { D1VaultRepository } from "../../repositories/D1VaultRepository";
import { GetScopesUseCase } from "../../../use-cases/vault/GetScopesUseCase";
import { CreateScopeUseCase } from "../../../use-cases/vault/CreateScopeUseCase";
import { GetFragmentsUseCase } from "../../../use-cases/vault/GetFragmentsUseCase";
import { UpsertFragmentUseCase } from "../../../use-cases/vault/UpsertFragmentUseCase";
import { authMiddleware } from "../middleware/authMiddleware";

const vault = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vault.use("*", authMiddleware);

vault.get("/scopes", async (c) => {
  const userId = c.get("userId");
  const vaultRepository = new D1VaultRepository(c.env.DB);
  const getScopesUseCase = new GetScopesUseCase(vaultRepository);
  
  const scopes = await getScopesUseCase.execute(userId);
  return c.json({ scopes });
});

vault.post("/scopes", async (c) => {
  const userId = c.get("userId");
  const { scope, scope_id } = await c.req.json();
  
  const vaultRepository = new D1VaultRepository(c.env.DB);
  const createScopeUseCase = new CreateScopeUseCase(vaultRepository);
  
  const id = await createScopeUseCase.execute(userId, scope, scope_id);
  return c.json({ id });
});

vault.get("/", async (c) => {
  const userId = c.get("userId");
  const vaultRepository = new D1VaultRepository(c.env.DB);
  const getFragmentsUseCase = new GetFragmentsUseCase(vaultRepository);
  
  const fragments = await getFragmentsUseCase.execute(userId);
  return c.json({ fragments });
});

vault.post("/", async (c) => {
  const userId = c.get("userId");
  const { scope_uuid, key_name, encrypted_blob, salt } = await c.req.json();
  
  const vaultRepository = new D1VaultRepository(c.env.DB);
  const upsertFragmentUseCase = new UpsertFragmentUseCase(vaultRepository);
  
  await upsertFragmentUseCase.execute(userId, scope_uuid, key_name, encrypted_blob, salt);
  return c.json({ success: true });
});

export default vault;
