import { Folder } from "../entities/Folder";

export interface FolderRepository {
  getFoldersByUserId(
    userId: string,
    parentId?: string | null
  ): Promise<Folder[]>;
  getFolderById(id: string, userId: string): Promise<Folder | null>;
  createFolder(folder: Folder): Promise<void>;
  updateFolder(folder: Folder): Promise<void>;
  deleteFolder(id: string, userId: string): Promise<void>;
}
