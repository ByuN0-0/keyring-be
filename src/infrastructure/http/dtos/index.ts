import { User } from "../../../domain/entities/User";
import { Folder } from "../../../domain/entities/Folder";
import { Secret } from "../../../domain/entities/Secret";

// User DTO
export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export const toUserDto = (user: User | null): UserDto | null => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

// Folder DTO
export interface FolderDto {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const toFolderDto = (folder: Folder): FolderDto => ({
  id: folder.id,
  user_id: folder.user_id,
  parent_id: folder.parent_id,
  name: folder.name,
  sort_order: folder.sort_order,
  created_at: folder.created_at || "",
  updated_at: folder.updated_at || "",
});

// Secret DTO
export interface SecretDto {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  encrypted_blob: string;
  salt: string;
  created_at: string;
  updated_at: string;
}

export const toSecretDto = (secret: Secret): SecretDto => ({
  id: secret.id,
  user_id: secret.user_id,
  folder_id: secret.folder_id,
  name: secret.name,
  encrypted_blob: secret.encrypted_blob,
  salt: secret.salt,
  created_at: secret.created_at || "",
  updated_at: secret.updated_at || "",
});
