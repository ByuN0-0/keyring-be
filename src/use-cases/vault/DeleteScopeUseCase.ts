import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class DeleteScopeUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string, scopeId: string): Promise<void> {
    await this.vaultRepository.deleteScope(scopeId, userId);
  }
}
