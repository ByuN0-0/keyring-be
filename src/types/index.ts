import { JwtPayload } from "../infrastructure/crypto/jwt";
import { UserRepository } from "../domain/repositories/UserRepository";
import { FolderRepository } from "../domain/repositories/FolderRepository";
import { SecretRepository } from "../domain/repositories/SecretRepository";
import { LoginUseCase } from "../use-cases/auth/LoginUseCase";
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
  JWT_SECRET: string;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
};

export type Variables = {
  userId: string;
  jwtPayload?: JwtPayload;
  repos: {
    userRepository: UserRepository;
    folderRepository: FolderRepository;
    secretRepository: SecretRepository;
  };
  useCases: {
    loginUseCase: LoginUseCase;
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
