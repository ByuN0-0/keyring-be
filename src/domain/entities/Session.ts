export interface Session {
  userId: string;
  ua: string | undefined;
  ip: string;
  createdAt: number;
  expiresAt: number;
}
