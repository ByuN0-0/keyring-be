import { Session } from "../domain/entities/Session";
import { SessionRepository } from "../domain/repositories/SessionRepository";
import { UserRepository } from "../domain/repositories/UserRepository";
import { FolderRepository } from "../domain/repositories/FolderRepository";
import { SecretRepository } from "../domain/repositories/SecretRepository";
import { LoginUseCase } from "../use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../use-cases/auth/GetCurrentUserUseCase";
import { GetFoldersUseCase } from "../use-cases/folder/GetFoldersUseCase";
import { CreateFolderUseCase } from "../use-cases/folder/CreateFolderUseCase";
import { UpdateFolderUseCase } from "../use-cases/folder/UpdateFolderUseCase";
import { DeleteFolderUseCase } from "../use-cases/folder/DeleteFolderUseCase";
import { GetSecretsUseCase } from "../use-cases/secret/GetSecretsUseCase";
import { CreateSecretUseCase } from "../use-cases/secret/CreateSecretUseCase";
import { UpdateSecretUseCase } from "../use-cases/secret/UpdateSecretUseCase";
import { DeleteSecretUseCase } from "../use-cases/secret/DeleteSecretUseCase";

export type Bindings = {
  DB: D1Database;
  SESSIONS: DurableObjectNamespace;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
};

export type Variables = {
  userId: string;
  session?: Session;
  repos: {
    userRepository: UserRepository;
    folderRepository: FolderRepository;
    secretRepository: SecretRepository;
    sessionRepository: SessionRepository;
  };
  useCases: {
    loginUseCase: LoginUseCase;
    logoutUseCase: LogoutUseCase;
    getCurrentUserUseCase: GetCurrentUserUseCase;
    getFoldersUseCase: GetFoldersUseCase;
    createFolderUseCase: CreateFolderUseCase;
    updateFolderUseCase: UpdateFolderUseCase;
    deleteFolderUseCase: DeleteFolderUseCase;
    getSecretsUseCase: GetSecretsUseCase;
    createSecretUseCase: CreateSecretUseCase;
    updateSecretUseCase: UpdateSecretUseCase;
    deleteSecretUseCase: DeleteSecretUseCase;
  };
};
