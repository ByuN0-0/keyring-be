export interface JwtPayload {
  sub: string;
  email: string;
  name: string | null;
  ua: string;
  ip: string;
  exp: number;
  iat: number;
}

const encoder = new TextEncoder();

function base64urlEncode(data: Uint8Array): string {
  const binString = Array.from(data, (byte) =>
    String.fromCharCode(byte)
  ).join("");
  return btoa(binString).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binString = atob(padded);
  return Uint8Array.from(binString, (c) => c.charCodeAt(0));
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

const HEADER = base64urlEncode(
  encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
);

export async function signJwt(
  payload: Omit<JwtPayload, "iat">,
  secret: string
): Promise<string> {
  const fullPayload: JwtPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const payloadB64 = base64urlEncode(encoder.encode(JSON.stringify(fullPayload)));
  const data = `${HEADER}.${payloadB64}`;

  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return `${data}.${base64urlEncode(new Uint8Array(signature))}`;
}

export async function verifyJwt(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;

  try {
    const key = await getKey(secret);
    const sigBytes = base64urlDecode(signature);
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
    if (!valid) return null;

    const decoded = JSON.parse(
      new TextDecoder().decode(base64urlDecode(payload))
    ) as JwtPayload;

    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return decoded;
  } catch {
    return null;
  }
}
