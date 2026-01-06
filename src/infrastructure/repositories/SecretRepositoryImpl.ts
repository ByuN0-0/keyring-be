import { and, eq, isNull, sql } from "drizzle-orm";
import { SecretRepository } from "../../domain/repositories/SecretRepository";
import { Secret } from "../../domain/entities/Secret";
import { Db } from "../db/client";
import { secrets } from "../db/schema";

export class SecretRepositoryImpl implements SecretRepository {
  constructor(private db: Db) {}

  async getSecretsByUserId(
    userId: string,
    folderId?: string | null
  ): Promise<Secret[]> {
    const query = this.db
      .select()
      .from(secrets)
      .where(
        and(
          eq(secrets.user_id, userId),
          folderId === undefined
            ? undefined
            : folderId === null
            ? isNull(secrets.folder_id)
            : eq(secrets.folder_id, folderId)
        )
      );

    const rows = await query;
    return rows.map((row) => ({
      ...row,
      folder_id: row.folder_id ?? null,
    }));
  }

  async getSecretById(id: string, userId: string): Promise<Secret | null> {
    const rows = await this.db
      .select()
      .from(secrets)
      .where(and(eq(secrets.id, id), eq(secrets.user_id, userId)))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      folder_id: row.folder_id ?? null,
    };
  }

  async createSecret(secret: Secret): Promise<void> {
    await this.db.insert(secrets).values({
      id: secret.id,
      user_id: secret.user_id,
      folder_id: secret.folder_id,
      name: secret.name,
      encrypted_blob: secret.encrypted_blob,
      salt: secret.salt,
      created_at: sql`CURRENT_TIMESTAMP`,
      updated_at: sql`CURRENT_TIMESTAMP`,
    });
  }

  async updateSecret(secret: Secret): Promise<void> {
    await this.db
      .update(secrets)
      .set({
        name: secret.name,
        folder_id: secret.folder_id,
        encrypted_blob: secret.encrypted_blob,
        salt: secret.salt,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .where(
        and(eq(secrets.id, secret.id), eq(secrets.user_id, secret.user_id))
      );
  }

  async deleteSecret(id: string, userId: string): Promise<void> {
    await this.db
      .delete(secrets)
      .where(and(eq(secrets.id, id), eq(secrets.user_id, userId)));
  }
}
