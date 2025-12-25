import { Context, Next } from "hono";
import { Bindings, Variables } from "../../../types";
import { LoginUseCase } from "../../../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../../use-cases/auth/GetCurrentUserUseCase";
import { GetScopesUseCase } from "../../../use-cases/vault/GetScopesUseCase";
import { CreateScopeUseCase } from "../../../use-cases/vault/CreateScopeUseCase";
import { UpdateScopeOrderUseCase } from "../../../use-cases/vault/UpdateScopeOrderUseCase";
import { DeleteScopeUseCase } from "../../../use-cases/vault/DeleteScopeUseCase";
import { GetFragmentsUseCase } from "../../../use-cases/vault/GetFragmentsUseCase";
import { UpsertFragmentUseCase } from "../../../use-cases/vault/UpsertFragmentUseCase";

export const useCaseMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const { userRepository, vaultRepository, sessionRepository } = c.get("repos");

  c.set("useCases", {
    loginUseCase: new LoginUseCase(userRepository, sessionRepository),
    logoutUseCase: new LogoutUseCase(sessionRepository),
    getCurrentUserUseCase: new GetCurrentUserUseCase(userRepository, vaultRepository),
    getScopesUseCase: new GetScopesUseCase(vaultRepository),
    createScopeUseCase: new CreateScopeUseCase(vaultRepository),
    updateScopeOrderUseCase: new UpdateScopeOrderUseCase(vaultRepository),
    deleteScopeUseCase: new DeleteScopeUseCase(vaultRepository),
    getFragmentsUseCase: new GetFragmentsUseCase(vaultRepository),
    upsertFragmentUseCase: new UpsertFragmentUseCase(vaultRepository),
  });

  await next();
};
