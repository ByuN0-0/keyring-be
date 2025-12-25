import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

export class D1UserRepository implements UserRepository {
  constructor(private db: D1Database) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.db.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first<User>();
  }

  async findById(id: string): Promise<User | null> {
    return await this.db.prepare("SELECT id, name, email FROM users WHERE id = ?")
      .bind(id)
      .first<User>();
  }
}
