export class PasswordHasher {
  static async hash(password: string, salt: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(password + salt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static async compare(password: string, salt: string, hash: string): Promise<boolean> {
    const computedHash = await this.hash(password, salt);
    return computedHash === hash;
  }
}
