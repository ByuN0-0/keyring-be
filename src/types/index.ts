import { Session } from "../domain/entities/Session";
import { SessionRepository } from "../domain/repositories/SessionRepository";
import { UserRepository } from "../domain/repositories/UserRepository";
import { VaultRepository } from "../domain/repositories/VaultRepository";
import { LoginUseCase } from "../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../use-cases/auth/GetCurrentUserUseCase";
import { GetScopesUseCase } from "../use-cases/vault/GetScopesUseCase";
import { CreateScopeUseCase } from "../use-cases/vault/CreateScopeUseCase";
import { UpdateScopeOrderUseCase } from "../use-cases/vault/UpdateScopeOrderUseCase";
import { DeleteScopeUseCase } from "../use-cases/vault/DeleteScopeUseCase";
import { GetFragmentsUseCase } from "../use-cases/vault/GetFragmentsUseCase";
import { UpsertFragmentUseCase } from "../use-cases/vault/UpsertFragmentUseCase";

export type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
};

export type Variables = {
  userId: string;
  session?: Session;
  repos: {
    userRepository: UserRepository;
    vaultRepository: VaultRepository;
    sessionRepository: SessionRepository;
  };
  useCases: {
    loginUseCase: LoginUseCase;
    logoutUseCase: LogoutUseCase;
    getCurrentUserUseCase: GetCurrentUserUseCase;
    getScopesUseCase: GetScopesUseCase;
    createScopeUseCase: CreateScopeUseCase;
    updateScopeOrderUseCase: UpdateScopeOrderUseCase;
    deleteScopeUseCase: DeleteScopeUseCase;
    getFragmentsUseCase: GetFragmentsUseCase;
    upsertFragmentUseCase: UpsertFragmentUseCase;
  };
};
