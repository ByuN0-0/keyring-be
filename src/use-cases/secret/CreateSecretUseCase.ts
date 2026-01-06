import { SecretRepository } from "../../domain/repositories/SecretRepository";
import { Secret } from "../../domain/entities/Secret";

export class CreateSecretUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(secret: Secret): Promise<void> {
    const secretWithId = {
      ...secret,
      id: secret.id || crypto.randomUUID(),
    };
    await this.secretRepository.createSecret(secretWithId);
  }
}
