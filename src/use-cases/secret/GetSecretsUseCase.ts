import { SecretRepository } from "../../domain/repositories/SecretRepository";
import { Secret } from "../../domain/entities/Secret";

export class GetSecretsUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(userId: string, folderId?: string | null): Promise<Secret[]> {
    return this.secretRepository.getSecretsByUserId(userId, folderId);
  }
}
