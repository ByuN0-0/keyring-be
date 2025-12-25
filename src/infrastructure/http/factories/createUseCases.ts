import { LoginUseCase } from "../../../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../../use-cases/auth/GetCurrentUserUseCase";
import { GetScopesUseCase } from "../../../use-cases/vault/GetScopesUseCase";
import { CreateScopeUseCase } from "../../../use-cases/vault/CreateScopeUseCase";
import { UpdateScopeOrderUseCase } from "../../../use-cases/vault/UpdateScopeOrderUseCase";
import { DeleteScopeUseCase } from "../../../use-cases/vault/DeleteScopeUseCase";
import { GetFragmentsUseCase } from "../../../use-cases/vault/GetFragmentsUseCase";
import { UpsertFragmentUseCase } from "../../../use-cases/vault/UpsertFragmentUseCase";
import { SessionRepository } from "../../../domain/repositories/SessionRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { VaultRepository } from "../../../domain/repositories/VaultRepository";

type UseCaseRepositories = {
  userRepository: UserRepository;
  vaultRepository: VaultRepository;
  sessionRepository: SessionRepository;
};

export const createUseCases = (repos: UseCaseRepositories) => ({
  loginUseCase: new LoginUseCase(repos.userRepository, repos.sessionRepository),
  logoutUseCase: new LogoutUseCase(repos.sessionRepository),
  getCurrentUserUseCase: new GetCurrentUserUseCase(
    repos.userRepository,
    repos.vaultRepository
  ),
  getScopesUseCase: new GetScopesUseCase(repos.vaultRepository),
  createScopeUseCase: new CreateScopeUseCase(repos.vaultRepository),
  updateScopeOrderUseCase: new UpdateScopeOrderUseCase(repos.vaultRepository),
  deleteScopeUseCase: new DeleteScopeUseCase(repos.vaultRepository),
  getFragmentsUseCase: new GetFragmentsUseCase(repos.vaultRepository),
  upsertFragmentUseCase: new UpsertFragmentUseCase(repos.vaultRepository),
});
