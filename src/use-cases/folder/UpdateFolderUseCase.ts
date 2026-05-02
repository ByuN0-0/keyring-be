import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { Folder } from "../../domain/entities/Folder";

export class UpdateFolderUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(folder: Partial<Folder> & { id: string; user_id: string }): Promise<void> {
    const updated = await this.folderRepository.updateFolder(folder);
    if (!updated) throw new Error("Folder not found");
  }
}
