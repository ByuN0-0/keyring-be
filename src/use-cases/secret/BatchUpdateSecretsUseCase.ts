import { Secret } from "../../domain/entities/Secret";
import { SecretRepository } from "../../domain/repositories/SecretRepository";

export type SecretBatchInput = {
  create: Secret[];
  update: Secret[];
  delete: string[];
};

export class BatchUpdateSecretsUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(input: SecretBatchInput, userId: string): Promise<void> {
    for (const secret of input.update) {
      const existing = await this.secretRepository.getSecretById(
        secret.id,
        userId
      );
      if (!existing) throw new Error("Secret not found");
    }

    for (const id of input.delete) {
      const existing = await this.secretRepository.getSecretById(id, userId);
      if (!existing) throw new Error("Secret not found");
    }

    for (const secret of input.create) {
      await this.secretRepository.createSecret({
        ...secret,
        id: secret.id || crypto.randomUUID(),
        user_id: userId,
      });
    }

    for (const secret of input.update) {
      const updated = await this.secretRepository.updateSecret({
        ...secret,
        user_id: userId,
      });
      if (!updated) throw new Error("Secret not found");
    }

    for (const id of input.delete) {
      const deleted = await this.secretRepository.deleteSecret(id, userId);
      if (!deleted) throw new Error("Secret not found");
    }
  }
}
