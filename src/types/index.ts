import { Session } from "../domain/entities/Session";

export type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
};

export type Variables = {
  userId: string;
  session?: Session;
};
