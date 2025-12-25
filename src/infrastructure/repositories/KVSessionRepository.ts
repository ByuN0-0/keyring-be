import { SessionRepository } from "../../domain/repositories/SessionRepository";
import { Session } from "../../domain/entities/Session";

export class KVSessionRepository implements SessionRepository {
  constructor(private kv: KVNamespace) {}

  async get(sessionId: string): Promise<Session | null> {
    const data = await this.kv.get(sessionId);
    if (!data) return null;
    return JSON.parse(data) as Session;
  }

  async set(sessionId: string, session: Session, expirationTtl: number): Promise<void> {
    await this.kv.put(sessionId, JSON.stringify(session), {
      expirationTtl,
    });
  }

  async delete(sessionId: string): Promise<void> {
    await this.kv.delete(sessionId);
  }
}
