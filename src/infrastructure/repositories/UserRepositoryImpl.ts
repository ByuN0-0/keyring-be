import { eq } from "drizzle-orm";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import { Db } from "../db/client";
import { users } from "../db/schema";

export class UserRepositoryImpl implements UserRepository {
  constructor(private db: Db) {}

  private mapUser(row: typeof users.$inferSelect): User {
    return {
      id: row.id,
      name: row.name ?? "",
      email: row.email,
      password_hash: row.password_hash,
      salt: row.salt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return row ? this.mapUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return row ? this.mapUser(row) : null;
  }
}
