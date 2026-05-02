import { sqliteTable, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
}, (table) => [
  uniqueIndex("idx_users_email").on(table.email),
]);

export const folders = sqliteTable("folders", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  parent_id: text("parent_id"),
  name: text("name").notNull(),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
}, (table) => [
  index("idx_folders_user_parent").on(table.user_id, table.parent_id),
]);

export const secrets = sqliteTable("secrets", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  folder_id: text("folder_id"),
  name: text("name").notNull(),
  encrypted_blob: text("encrypted_blob").notNull(),
  salt: text("salt").notNull(),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
}, (table) => [
  index("idx_secrets_user_folder").on(table.user_id, table.folder_id),
]);

export const loginAttempts = sqliteTable("login_attempts", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  ip: text("ip").notNull(),
  failed_count: integer("failed_count").notNull().default(0),
  locked_until: integer("locked_until"),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_login_attempts_email_ip").on(table.email, table.ip),
]);
