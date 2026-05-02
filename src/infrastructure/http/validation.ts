import { Secret } from "../../domain/entities/Secret";

export class HttpError extends Error {
  constructor(public status: 400 | 404, message: string) {
    super(message);
  }
}

export function assertObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Invalid request body");
  }
  return value as Record<string, unknown>;
}

export function optionalString(
  value: unknown,
  field: string
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new HttpError(400, `${field} is invalid`);
  return value;
}

export function optionalNullableString(
  value: unknown,
  field: string
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") throw new HttpError(400, `${field} is invalid`);
  return value;
}

export function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `${field} is required`);
  }
  return value.trim();
}

export function optionalNumber(
  value: unknown,
  field: string
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new HttpError(400, `${field} is invalid`);
  }
  return value;
}

export function parseSecretPayload(
  value: unknown,
  userId: string,
  requireId = false
): Secret {
  const body = assertObject(value);
  const id = optionalString(body.id, "id");
  if (requireId && !id) throw new HttpError(400, "id is required");

  return {
    id: id || crypto.randomUUID(),
    user_id: userId,
    folder_id: optionalNullableString(body.folder_id, "folder_id") ?? null,
    name: requiredString(body.name, "name"),
    encrypted_blob: requiredString(body.encrypted_blob, "encrypted_blob"),
    salt: requiredString(body.salt, "salt"),
  };
}

export function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  if (error instanceof Error && error.message.includes("not found")) {
    return new HttpError(404, error.message);
  }
  return new HttpError(400, "Request failed");
}
