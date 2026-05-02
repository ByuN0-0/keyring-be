import { SecretRepository } from "../../domain/repositories/SecretRepository";
import { Secret } from "../../domain/entities/Secret";

export class UpdateSecretUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(secret: Secret): Promise<void> {
    const updated = await this.secretRepository.updateSecret(secret);
    if (!updated) throw new Error("Secret not found");
  }
}
