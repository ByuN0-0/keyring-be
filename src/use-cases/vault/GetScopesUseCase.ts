import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class GetScopesUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string) {
    return await this.vaultRepository.getScopesByUserId(userId);
  }
}
