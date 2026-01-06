import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { Folder } from "../../domain/entities/Folder";

export class GetFoldersUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(userId: string, parentId?: string | null): Promise<Folder[]> {
    return this.folderRepository.getFoldersByUserId(userId, parentId);
  }
}
