import { SecretRepository } from "../../domain/repositories/SecretRepository";

export class DeleteSecretUseCase {
  constructor(private secretRepository: SecretRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.secretRepository.deleteSecret(id, userId);
  }
}
