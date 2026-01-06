export interface Secret {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  encrypted_blob: string;
  salt: string;
  created_at?: string;
  updated_at?: string;
}
