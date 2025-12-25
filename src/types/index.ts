import { Session } from "../domain/entities/Session";

export type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
};

export type Variables = {
  userId: string;
  session?: Session;
};
