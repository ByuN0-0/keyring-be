import { Session } from "../entities/Session";

export interface SessionRepository {
  get(sessionId: string): Promise<Session | null>;
  set(sessionId: string, session: Session, expirationTtl: number): Promise<void>;
  delete(sessionId: string): Promise<void>;
}
