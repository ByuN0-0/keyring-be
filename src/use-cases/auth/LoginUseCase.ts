import { UserRepository } from "../../domain/repositories/UserRepository";
import { PasswordHasher } from "../../infrastructure/crypto/PasswordHasher";

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isValid = await PasswordHasher.compare(password, user.salt, user.password_hash);
    if (!isValid) throw new Error("Invalid credentials");

    return { user: { id: user.id, name: user.name, email: user.email } };
  }
}
