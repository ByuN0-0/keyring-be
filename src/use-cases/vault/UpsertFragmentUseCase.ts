import { VaultRepository } from "../../domain/repositories/VaultRepository";

export class UpsertFragmentUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute(userId: string, scope_uuid: string, key_name: string, encrypted_blob: string, salt: string) {
    const scope_pk = `${scope_uuid}:${key_name}`;
    await this.vaultRepository.upsertFragment({
      scope_pk,
      user_id: userId,
      encrypted_blob,
      salt,
    });
  }
}
