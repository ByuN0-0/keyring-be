import { and, eq, isNull, sql, asc } from "drizzle-orm";
import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { Folder } from "../../domain/entities/Folder";
import { Db } from "../db/client";
import { folders } from "../db/schema";

export class FolderRepositoryImpl implements FolderRepository {
  constructor(private db: Db) {}

  async getFoldersByUserId(
    userId: string,
    parentId?: string | null
  ): Promise<Folder[]> {
    const query = this.db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.user_id, userId),
          parentId === undefined
            ? undefined
            : parentId === null
            ? isNull(folders.parent_id)
            : eq(folders.parent_id, parentId)
        )
      )
      .orderBy(asc(folders.sort_order));

    const rows = await query;
    return rows.map((row) => ({
      ...row,
      parent_id: row.parent_id ?? null,
    }));
  }

  async getFolderById(id: string, userId: string): Promise<Folder | null> {
    const rows = await this.db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.user_id, userId)))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      parent_id: row.parent_id ?? null,
    };
  }

  async createFolder(folder: Folder): Promise<void> {
    await this.db.insert(folders).values({
      id: folder.id,
      user_id: folder.user_id,
      parent_id: folder.parent_id,
      name: folder.name,
      sort_order: folder.sort_order,
      created_at: sql`CURRENT_TIMESTAMP`,
      updated_at: sql`CURRENT_TIMESTAMP`,
    });
  }

  async updateFolder(folder: Folder): Promise<void> {
    await this.db
      .update(folders)
      .set({
        name: folder.name,
        parent_id: folder.parent_id,
        sort_order: folder.sort_order,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .where(
        and(eq(folders.id, folder.id), eq(folders.user_id, folder.user_id))
      );
  }

  async deleteFolder(id: string, userId: string): Promise<void> {
    await this.db
      .delete(folders)
      .where(and(eq(folders.id, id), eq(folders.user_id, userId)));
  }
}
