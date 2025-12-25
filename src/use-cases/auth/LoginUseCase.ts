import { UserRepository } from "../../domain/repositories/UserRepository";
import { SessionRepository } from "../../domain/repositories/SessionRepository";
import { PasswordHasher } from "../../infrastructure/crypto/PasswordHasher";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../../domain/entities/Session";

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {}

  async execute(email: string, password: string, ua: string | undefined, ip: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isValid = await PasswordHasher.compare(password, user.salt, user.password_hash);
    if (!isValid) throw new Error("Invalid credentials");

    const sessionId = uuidv4();
    const expiresAt = Date.now() + 900 * 1000; // 15 minutes
    const session: Session = {
      userId: user.id,
      ua,
      ip,
      createdAt: Date.now(),
      expiresAt,
    };

    await this.sessionRepository.set(sessionId, session, 900);

    return {
      sessionId,
      user: { id: user.id, name: user.name, email: user.email },
      expiresAt,
    };
  }
}
