import { VaultRepository } from "../../domain/repositories/VaultRepository";
import { v4 as uuidv4 } from "uuid";

export class CreateScopeUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string, scope: string, scope_id: string | null) {
    const existing = await this.vaultRepository.getScopesByUserId(userId);

    // 해당 카테고리(scope)의 기존 항목들만 순서를 뒤로 밀기
    const sameCategoryScopes = existing.filter((s) => s.scope === scope);
    if (sameCategoryScopes.length > 0) {
      const updatedOrders = sameCategoryScopes.map((s) => ({
        id: s.id,
        sort_order: s.sort_order + 1,
      }));
      await this.vaultRepository.updateScopeOrder(userId, updatedOrders);
    }

    const id = uuidv4();
    await this.vaultRepository.createScope({
      id,
      user_id: userId,
      scope,
      scope_id,
      sort_order: 0, // 항상 맨 위(0번)로 생성
    });
    return id;
  }
}
