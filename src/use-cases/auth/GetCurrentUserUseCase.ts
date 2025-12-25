import { UserRepository } from "../../domain/repositories/UserRepository";
import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class GetCurrentUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private vaultRepository: VaultRepository
  ) {}

  async execute(userId: string, expiresAt: number) {
    const user = await this.userRepository.findById(userId);
    const fragments = await this.vaultRepository.getFragmentsByUserId(userId);
    const scopes = await this.vaultRepository.getDistinctScopesByUserId(userId);

    return {
      user,
      expiresAt,
      fragments,
      scopes,
    };
  }
}
