export type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function normalize(value: unknown): CanonicalJson | undefined {
  if (value === undefined) return undefined;
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Canonical JSON does not support non-finite numbers");
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => normalize(item) ?? null);
  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, CanonicalJson> = {};
    for (const key of Object.keys(input).sort()) {
      const normalized = normalize(input[key]);
      if (normalized !== undefined) output[key] = normalized;
    }
    return output;
  }
  throw new Error(`Unsupported canonical JSON value: ${typeof value}`);
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(normalize(value));
}

export function createUnsignedPayload<T extends { signatures?: unknown }>(payload: T): Omit<T, "signatures"> {
  const { signatures: _signatures, ...unsigned } = payload;
  return unsigned;
}
