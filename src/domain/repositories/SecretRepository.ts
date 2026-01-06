import { Secret } from "../entities/Secret";

export interface SecretRepository {
  getSecretsByUserId(
    userId: string,
    folderId?: string | null
  ): Promise<Secret[]>;
  getSecretById(id: string, userId: string): Promise<Secret | null>;
  createSecret(secret: Secret): Promise<void>;
  updateSecret(secret: Secret): Promise<void>;
  deleteSecret(id: string, userId: string): Promise<void>;
}
