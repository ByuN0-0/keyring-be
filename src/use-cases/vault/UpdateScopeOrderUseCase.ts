import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class UpdateScopeOrderUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(
    userId: string,
    scopeOrders: { id: string; sort_order: number }[]
  ) {
    await this.vaultRepository.updateScopeOrder(userId, scopeOrders);
  }
}
