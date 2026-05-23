import { createPublicKey, sign, verify, type KeyLike } from "node:crypto";
import { canonicalize, createUnsignedPayload } from "./canonicalize";
import { computeDigest } from "./digest";
import { AgentCardSchema, ToolManifestSchema, type AgentCard, type Signature, type ToolManifest, type VerificationKey } from "./schemas";
import { type RevocationList } from "./revocation";

export interface VerificationResult {
  valid: boolean;
  digest: string;
  errors: string[];
  warnings: string[];
}

export function signPayload(payload: unknown, keyId: string, privateKey: KeyLike, signedAt = new Date().toISOString()): Signature {
  const digest = computeDigest(payload);
  const value = sign(null, Buffer.from(canonicalize(payload)), privateKey).toString("base64");
  return { key_id: keyId, alg: "Ed25519", digest, value, signed_at: signedAt };
}

export function verifySignature(payload: unknown, signature: Signature, publicKey: VerificationKey): boolean {
  if (signature.key_id !== publicKey.key_id || signature.alg !== publicKey.alg) return false;
  if (signature.digest !== computeDigest(payload)) return false;
  const key = createPublicKey(publicKey.public_key);
  return verify(null, Buffer.from(canonicalize(payload)), key, Buffer.from(signature.value, "base64"));
}

function verifySignedPayload<T extends AgentCard | ToolManifest>(payload: T, keys: VerificationKey[], revocations?: RevocationList): VerificationResult {
  const unsignedPayload = createUnsignedPayload(payload);
  const digest = computeDigest(unsignedPayload);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (payload.signatures.length === 0) errors.push("signed payload has no signatures");

  for (const signature of payload.signatures) {
    const key = keys.find((candidate) => candidate.key_id === signature.key_id);
    if (!key) {
      errors.push(`signature references unknown key: ${signature.key_id}`);
      continue;
    }
    if (revocations?.isKeyRevoked(signature.key_id)) errors.push(`signing key is revoked: ${signature.key_id}`);
    if (revocations?.isDigestRevoked(signature.digest)) errors.push(`payload digest is revoked: ${signature.digest}`);
    if (!verifySignature(unsignedPayload, signature, key)) errors.push(`signature verification failed for key: ${signature.key_id}`);
  }

  return { valid: errors.length === 0, digest, errors, warnings };
}

export function verifySignedAgentCard(card: unknown, revocations?: RevocationList): VerificationResult {
  const parsed = AgentCardSchema.safeParse(card);
  if (!parsed.success) {
    return { valid: false, digest: "", errors: parsed.error.issues.map((issue) => issue.message), warnings: [] };
  }
  if (revocations?.isAgentRevoked(parsed.data.agent_id)) {
    const unsignedPayload = createUnsignedPayload(parsed.data);
    return { valid: false, digest: computeDigest(unsignedPayload), errors: [`agent is revoked: ${parsed.data.agent_id}`], warnings: [] };
  }
  return verifySignedPayload(parsed.data, parsed.data.public_keys, revocations);
}

export function verifySignedToolManifest(manifest: unknown, revocations?: RevocationList): VerificationResult {
  const parsed = ToolManifestSchema.safeParse(manifest);
  if (!parsed.success) {
    return { valid: false, digest: "", errors: parsed.error.issues.map((issue) => issue.message), warnings: [] };
  }
  if (revocations?.isManifestRevoked(parsed.data.manifest_id)) {
    const unsignedPayload = createUnsignedPayload(parsed.data);
    return { valid: false, digest: computeDigest(unsignedPayload), errors: [`tool manifest is revoked: ${parsed.data.manifest_id}`], warnings: [] };
  }
  return verifySignedPayload(parsed.data, parsed.data.public_keys, revocations);
}
