import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
});

export const vault_scopes = sqliteTable("vault_scopes", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  scope: text("scope").notNull(),
  scope_id: text("scope_id"),
  sort_order: integer("sort_order").notNull(),
});

export const vault_fragments = sqliteTable("vault_fragments", {
  scope_pk: text("scope_pk").primaryKey(),
  user_id: text("user_id").notNull(),
  encrypted_blob: text("encrypted_blob").notNull(),
  salt: text("salt").notNull(),
  updated_at: text("updated_at").notNull(),
});
