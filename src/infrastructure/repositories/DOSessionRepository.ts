import { Session } from "../../domain/entities/Session";
import { SessionRepository } from "../../domain/repositories/SessionRepository";

const SESSION_ENDPOINT = "https://session";

export class DOSessionRepository implements SessionRepository {
  constructor(private namespace: DurableObjectNamespace) {}

  private getStub(sessionId: string) {
    const id = this.namespace.idFromName(sessionId);
    return this.namespace.get(id);
  }

  async get(sessionId: string): Promise<Session | null> {
    const stub = this.getStub(sessionId);
    const response = await stub.fetch(`${SESSION_ENDPOINT}/`);

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Failed to get session: ${response.statusText}`);

    const { session } = (await response.json()) as { session: Session };
    return session;
  }

  async set(sessionId: string, session: Session, expirationTtl: number): Promise<void> {
    const stub = this.getStub(sessionId);
    const response = await stub.fetch(`${SESSION_ENDPOINT}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, expirationTtl }),
    });

    if (!response.ok) throw new Error(`Failed to set session: ${response.statusText}`);
  }

  async delete(sessionId: string): Promise<void> {
    const stub = this.getStub(sessionId);
    const response = await stub.fetch(`${SESSION_ENDPOINT}/`, { method: "DELETE" });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
  }
}
