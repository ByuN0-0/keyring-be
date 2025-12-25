import { and, eq, like, sql } from "drizzle-orm";
import { VaultRepository } from "../../domain/repositories/VaultRepository";
import { VaultScope } from "../../domain/entities/VaultScope";
import { VaultFragment } from "../../domain/entities/VaultFragment";
import { Db } from "../db/client";
import { vault_fragments, vault_scopes } from "../db/schema";

export class VaultRepositoryImpl implements VaultRepository {
  constructor(private db: Db) {}

  async getScopesByUserId(userId: string): Promise<VaultScope[]> {
    return await this.db
      .select()
      .from(vault_scopes)
      .where(eq(vault_scopes.user_id, userId))
      .orderBy(vault_scopes.sort_order);
  }

  async createScope(scope: VaultScope): Promise<void> {
    await this.db.insert(vault_scopes).values({
      id: scope.id,
      user_id: scope.user_id,
      scope: scope.scope,
      scope_id: scope.scope_id,
      sort_order: scope.sort_order,
    });
  }

  async updateScopeOrder(
    userId: string,
    scopeOrders: { id: string; sort_order: number }[]
  ): Promise<void> {
    for (const scopeOrder of scopeOrders) {
      await this.db
        .update(vault_scopes)
        .set({ sort_order: scopeOrder.sort_order })
        .where(
          and(
            eq(vault_scopes.id, scopeOrder.id),
            eq(vault_scopes.user_id, userId)
          )
        );
    }
  }

  async deleteScope(id: string, userId: string): Promise<void> {
    await this.db
      .delete(vault_scopes)
      .where(and(eq(vault_scopes.id, id), eq(vault_scopes.user_id, userId)));

    await this.db
      .delete(vault_fragments)
      .where(
        and(
          eq(vault_fragments.user_id, userId),
          like(vault_fragments.scope_pk, `${id}:%`)
        )
      );
  }

  async getFragmentsByUserId(userId: string): Promise<VaultFragment[]> {
    const rows = await this.db
      .select({
        scope_pk: vault_fragments.scope_pk,
        user_id: vault_fragments.user_id,
        encrypted_blob: vault_fragments.encrypted_blob,
        salt: vault_fragments.salt,
        updated_at: vault_fragments.updated_at,
        scope: vault_scopes.scope,
        scope_id: vault_scopes.scope_id,
      })
      .from(vault_fragments)
      .leftJoin(
        vault_scopes,
        like(vault_fragments.scope_pk, sql`${vault_scopes.id} || ':%'`)
      )
      .where(eq(vault_fragments.user_id, userId));
    return rows.map((row) => ({
      ...row,
      scope: row.scope ?? undefined,
      scope_id: row.scope_id ?? undefined,
    }));
  }

  async getDistinctScopesByUserId(userId: string): Promise<VaultScope[]> {
    return await this.db
      .select()
      .from(vault_scopes)
      .where(eq(vault_scopes.user_id, userId))
      .orderBy(vault_scopes.sort_order);
  }

  async upsertFragment(
    fragment: Omit<VaultFragment, "updated_at">
  ): Promise<void> {
    await this.db
      .insert(vault_fragments)
      .values({
        scope_pk: fragment.scope_pk,
        user_id: fragment.user_id,
        encrypted_blob: fragment.encrypted_blob,
        salt: fragment.salt,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .onConflictDoUpdate({
        target: vault_fragments.scope_pk,
        set: {
          encrypted_blob: fragment.encrypted_blob,
          salt: fragment.salt,
          updated_at: sql`CURRENT_TIMESTAMP`,
        },
      });
  }
}
