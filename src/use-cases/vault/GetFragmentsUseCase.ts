import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class GetFragmentsUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string) {
    return await this.vaultRepository.getFragmentsByUserId(userId);
  }
}
