export interface Folder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
