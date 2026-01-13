import { UserRepository } from "../../domain/repositories/UserRepository";

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, expiresAt: number) {
    const user = await this.userRepository.findById(userId);

    return {
      user,
      expiresAt,
    };
  }
}
