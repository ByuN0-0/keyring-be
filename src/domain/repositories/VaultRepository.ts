import { VaultScope } from "../entities/VaultScope";
import { VaultFragment } from "../entities/VaultFragment";

export interface VaultRepository {
  getScopesByUserId(userId: string): Promise<VaultScope[]>;
  createScope(scope: VaultScope): Promise<void>;
  updateScopeOrder(
    userId: string,
    scopeOrders: { id: string; sort_order: number }[]
  ): Promise<void>;
  deleteScope(id: string, userId: string): Promise<void>;
  getFragmentsByUserId(userId: string): Promise<VaultFragment[]>;
  getDistinctScopesByUserId(userId: string): Promise<VaultScope[]>;
  upsertFragment(fragment: Omit<VaultFragment, "updated_at">): Promise<void>;
}
