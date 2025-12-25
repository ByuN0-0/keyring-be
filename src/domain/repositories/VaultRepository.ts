import { VaultScope } from "../entities/VaultScope";
import { VaultFragment } from "../entities/VaultFragment";

export interface VaultRepository {
  getScopesByUserId(userId: string): Promise<VaultScope[]>;
  createScope(scope: VaultScope): Promise<void>;
  getFragmentsByUserId(userId: string): Promise<VaultFragment[]>;
  getDistinctScopesByUserId(userId: string): Promise<{ scope: string; scope_id: string | null }[]>;
  upsertFragment(fragment: Omit<VaultFragment, "updated_at">): Promise<void>;
}
