import { LoginUseCase } from "../../../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../../use-cases/auth/GetCurrentUserUseCase";

import { GetFoldersUseCase } from "../../../use-cases/folder/GetFoldersUseCase";
import { CreateFolderUseCase } from "../../../use-cases/folder/CreateFolderUseCase";
import { UpdateFolderUseCase } from "../../../use-cases/folder/UpdateFolderUseCase";
import { DeleteFolderUseCase } from "../../../use-cases/folder/DeleteFolderUseCase";

import { GetSecretsUseCase } from "../../../use-cases/secret/GetSecretsUseCase";
import { CreateSecretUseCase } from "../../../use-cases/secret/CreateSecretUseCase";
import { UpdateSecretUseCase } from "../../../use-cases/secret/UpdateSecretUseCase";
import { DeleteSecretUseCase } from "../../../use-cases/secret/DeleteSecretUseCase";

import { SessionRepository } from "../../../domain/repositories/SessionRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { FolderRepository } from "../../../domain/repositories/FolderRepository";
import { SecretRepository } from "../../../domain/repositories/SecretRepository";

type UseCaseRepositories = {
  userRepository: UserRepository;
  folderRepository: FolderRepository;
  secretRepository: SecretRepository;
  sessionRepository: SessionRepository;
};

export const createUseCases = (repos: UseCaseRepositories) => ({
  loginUseCase: new LoginUseCase(repos.userRepository, repos.sessionRepository),
  logoutUseCase: new LogoutUseCase(repos.sessionRepository),
  getCurrentUserUseCase: new GetCurrentUserUseCase(
    repos.userRepository,
    repos.folderRepository,
    repos.secretRepository
  ),
  // Folders
  getFoldersUseCase: new GetFoldersUseCase(repos.folderRepository),
  createFolderUseCase: new CreateFolderUseCase(repos.folderRepository),
  updateFolderUseCase: new UpdateFolderUseCase(repos.folderRepository),
  deleteFolderUseCase: new DeleteFolderUseCase(repos.folderRepository),

  // Secrets
  getSecretsUseCase: new GetSecretsUseCase(repos.secretRepository),
  createSecretUseCase: new CreateSecretUseCase(repos.secretRepository),
  updateSecretUseCase: new UpdateSecretUseCase(repos.secretRepository),
  deleteSecretUseCase: new DeleteSecretUseCase(repos.secretRepository),
});
