import { FolderRepository } from "../../domain/repositories/FolderRepository";

export class DeleteFolderUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const deleted = await this.folderRepository.deleteFolder(id, userId);
    if (!deleted) throw new Error("Folder not found");
  }
}
