import { LoginUseCase } from "../../../use-cases/auth/LoginUseCase";

import { GetFoldersUseCase } from "../../../use-cases/folder/GetFoldersUseCase";
import { CreateFolderUseCase } from "../../../use-cases/folder/CreateFolderUseCase";
import { UpdateFolderUseCase } from "../../../use-cases/folder/UpdateFolderUseCase";
import { DeleteFolderUseCase } from "../../../use-cases/folder/DeleteFolderUseCase";

import { GetSecretsUseCase } from "../../../use-cases/secret/GetSecretsUseCase";
import { CreateSecretUseCase } from "../../../use-cases/secret/CreateSecretUseCase";
import { UpdateSecretUseCase } from "../../../use-cases/secret/UpdateSecretUseCase";
import { DeleteSecretUseCase } from "../../../use-cases/secret/DeleteSecretUseCase";
import { BatchUpdateSecretsUseCase } from "../../../use-cases/secret/BatchUpdateSecretsUseCase";

import { UserRepository } from "../../../domain/repositories/UserRepository";
import { FolderRepository } from "../../../domain/repositories/FolderRepository";
import { SecretRepository } from "../../../domain/repositories/SecretRepository";

type UseCaseRepositories = {
  userRepository: UserRepository;
  folderRepository: FolderRepository;
  secretRepository: SecretRepository;
};

export const createUseCases = (repos: UseCaseRepositories) => ({
  loginUseCase: new LoginUseCase(repos.userRepository),
  getFoldersUseCase: new GetFoldersUseCase(repos.folderRepository),
  createFolderUseCase: new CreateFolderUseCase(repos.folderRepository),
  updateFolderUseCase: new UpdateFolderUseCase(repos.folderRepository),
  deleteFolderUseCase: new DeleteFolderUseCase(repos.folderRepository),
  getSecretsUseCase: new GetSecretsUseCase(repos.secretRepository),
  createSecretUseCase: new CreateSecretUseCase(repos.secretRepository),
  updateSecretUseCase: new UpdateSecretUseCase(repos.secretRepository),
  deleteSecretUseCase: new DeleteSecretUseCase(repos.secretRepository),
  batchUpdateSecretsUseCase: new BatchUpdateSecretsUseCase(
    repos.secretRepository
  ),
});
