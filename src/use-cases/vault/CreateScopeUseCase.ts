import { VaultRepository } from "../../domain/repositories/VaultRepository";
import { v4 as uuidv4 } from "uuid";

export class CreateScopeUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string, scope: string, scope_id: string | null) {
    const id = uuidv4();
    await this.vaultRepository.createScope({
      id,
      user_id: userId,
      scope,
      scope_id,
    });
    return id;
  }
}
