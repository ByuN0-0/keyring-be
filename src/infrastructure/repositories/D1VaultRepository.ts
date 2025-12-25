import { VaultRepository } from "../../domain/repositories/VaultRepository";
import { VaultScope } from "../../domain/entities/VaultScope";
import { VaultFragment } from "../../domain/entities/VaultFragment";

export class D1VaultRepository implements VaultRepository {
  constructor(private db: D1Database) {}

  async getScopesByUserId(userId: string): Promise<VaultScope[]> {
    const { results } = await this.db.prepare(
      "SELECT id, scope, scope_id FROM vault_scopes WHERE user_id = ?"
    )
      .bind(userId)
      .all<VaultScope>();
    return results;
  }

  async createScope(scope: VaultScope): Promise<void> {
    await this.db.prepare(
      "INSERT INTO vault_scopes (id, user_id, scope, scope_id) VALUES (?, ?, ?, ?)"
    )
      .bind(scope.id, scope.user_id, scope.scope, scope.scope_id)
      .run();
  }

  async getFragmentsByUserId(userId: string): Promise<VaultFragment[]> {
    const { results } = await this.db.prepare(
      "SELECT f.*, s.scope, s.scope_id FROM vault_fragments f LEFT JOIN vault_scopes s ON f.scope_pk LIKE s.id || ':%' WHERE f.user_id = ?"
    )
      .bind(userId)
      .all<VaultFragment>();
    return results;
  }

  async getDistinctScopesByUserId(userId: string): Promise<{ scope: string; scope_id: string | null }[]> {
    const { results } = await this.db.prepare(
      "SELECT DISTINCT scope, scope_id FROM vault_scopes WHERE user_id = ? AND scope_id IS NOT NULL"
    )
      .bind(userId)
      .all<{ scope: string; scope_id: string | null }>();
    return results;
  }

  async upsertFragment(fragment: Omit<VaultFragment, "updated_at">): Promise<void> {
    await this.db.prepare(
      `INSERT INTO vault_fragments (scope_pk, user_id, encrypted_blob, salt, updated_at) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(scope_pk) DO UPDATE SET 
       encrypted_blob = excluded.encrypted_blob, 
       salt = excluded.salt, 
       updated_at = CURRENT_TIMESTAMP`
    )
      .bind(fragment.scope_pk, fragment.user_id, fragment.encrypted_blob, fragment.salt)
      .run();
  }
}
