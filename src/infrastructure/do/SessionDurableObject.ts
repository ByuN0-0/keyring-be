import { Session } from "../../domain/entities/Session";

type RequestBody = {
  session: Session;
  expirationTtl: number;
};

export class SessionDurableObject {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const { method } = request;

    if (method === "GET") return this.handleGet();
    if (method === "PUT") return this.handlePut(request);
    if (method === "DELETE") return this.handleDelete();

    return new Response("Method Not Allowed", { status: 405 });
  }

  private async handleGet(): Promise<Response> {
    const session = await this.state.storage.get<Session>("session");
    if (!session) return new Response("Not Found", { status: 404 });

    return Response.json({ session });
  }

  private async handlePut(request: Request): Promise<Response> {
    const { session, expirationTtl } = (await request.json()) as RequestBody;

    // 1. expirationTtl 옵션 제거 (Durable Object 스토리지에서는 지원되지 않음)
    await this.state.storage.put("session", session);

    // 2. 알람을 사용하여 만료 설정 (expirationTtl은 대개 초 단위이므로 ms로 변환)
    if (expirationTtl && expirationTtl > 0) {
      await this.state.storage.setAlarm(Date.now() + expirationTtl * 1000);
    }

    return new Response(null, { status: 204 });
  }

  private async handleDelete(): Promise<Response> {
    await this.state.storage.delete("session");
    return new Response(null, { status: 204 });
  }

  // 3. 알람이 발생했을 때 호출되는 메서드 (세션 삭제)
  async alarm() {
    await this.state.storage.delete("session");
  }
}
