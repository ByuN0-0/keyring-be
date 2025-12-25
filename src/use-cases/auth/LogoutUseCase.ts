import { SessionRepository } from "../../domain/repositories/SessionRepository";

export class LogoutUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(sessionId: string | undefined) {
    if (sessionId) {
      await this.sessionRepository.delete(sessionId);
    }
  }
}
