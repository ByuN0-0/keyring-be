import { FolderRepository } from "../../domain/repositories/FolderRepository";

export class DeleteFolderUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.folderRepository.deleteFolder(id, userId);
  }
}
