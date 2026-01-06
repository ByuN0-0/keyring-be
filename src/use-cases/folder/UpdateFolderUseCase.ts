import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { Folder } from "../../domain/entities/Folder";

export class UpdateFolderUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(folder: Folder): Promise<void> {
    await this.folderRepository.updateFolder(folder);
  }
}
