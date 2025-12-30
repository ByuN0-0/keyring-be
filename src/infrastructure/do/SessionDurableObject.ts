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

    await this.state.storage.put("session", session, { expirationTtl });

    return new Response(null, { status: 204 });
  }

  private async handleDelete(): Promise<Response> {
    await this.state.storage.delete("session");
    return new Response(null, { status: 204 });
  }
}
