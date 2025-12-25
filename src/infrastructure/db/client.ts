import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

export const createDb = (database: D1Database) => drizzle(database, { schema });
