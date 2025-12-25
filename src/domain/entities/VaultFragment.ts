export interface VaultFragment {
  scope_pk: string;
  user_id: string;
  encrypted_blob: string;
  salt: string;
  updated_at: string;
  scope?: string;
  scope_id?: string | null;
}
