import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { Folder } from "../../domain/entities/Folder";

export class CreateFolderUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(folder: Folder): Promise<void> {
    const folderWithId = {
      ...folder,
      id: folder.id || crypto.randomUUID(),
      sort_order: folder.sort_order ?? 0,
    };
    await this.folderRepository.createFolder(folderWithId);
  }
}
