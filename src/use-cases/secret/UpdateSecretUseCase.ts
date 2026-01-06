import { SecretRepository } from "../../domain/repositories/SecretRepository";
import { Secret } from "../../domain/entities/Secret";

export class UpdateSecretUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(secret: Secret): Promise<void> {
    await this.secretRepository.updateSecret(secret);
  }
}
