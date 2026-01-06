import { UserRepository } from "../../domain/repositories/UserRepository";
import { FolderRepository } from "../../domain/repositories/FolderRepository";
import { SecretRepository } from "../../domain/repositories/SecretRepository";

export class GetCurrentUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private folderRepository: FolderRepository,
    private secretRepository: SecretRepository
  ) {}

  async execute(userId: string, expiresAt: number) {
    const user = await this.userRepository.findById(userId);
    const folders = await this.folderRepository.getFoldersByUserId(
      userId,
      null
    );
    const secrets = await this.secretRepository.getSecretsByUserId(
      userId,
      null
    );

    return {
      user,
      expiresAt,
      folders,
      secrets,
    };
  }
}
