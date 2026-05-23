import { createUnsignedPayload } from "./canonicalize";
import { computeDigest } from "./digest";
import { RevocationList } from "./revocation";
import { type AgentCard, type ToolManifest, type TrustRegistryRecord } from "./schemas";
import { verifySignedAgentCard, verifySignedToolManifest, type VerificationResult } from "./signing";

export interface RegistryDecision extends VerificationResult {
  trusted: boolean;
  review_status: TrustRegistryRecord["review_status"] | "missing";
}

export class InMemoryTrustRegistry {
  readonly revocations = new RevocationList();
  private readonly records = new Map<string, TrustRegistryRecord>();

  trustPublisher(record: TrustRegistryRecord): void {
    this.records.set(record.publisher, record);
  }

  verifyAgentCard(card: AgentCard): RegistryDecision {
    const verification = verifySignedAgentCard(card, this.revocations);
    const record = this.records.get(card.publisher);
    const digest = computeDigest(createUnsignedPayload(card));
    const errors = [...verification.errors];
    if (!record || record.trust_status !== "trusted") errors.push(`publisher is not trusted: ${card.publisher}`);
    if (record && record.allowed_agents.length > 0 && !record.allowed_agents.includes(card.agent_id)) errors.push(`agent is not allowed: ${card.agent_id}`);
    if (record && record.key_ids.length > 0 && !card.signatures.some((signature) => record.key_ids.includes(signature.key_id))) errors.push("no signature uses a trusted key");
    if (record && record.pinned_digests.length > 0 && !record.pinned_digests.includes(digest)) errors.push(`agent card digest is not pinned: ${digest}`);
    return { ...verification, errors, valid: errors.length === 0, trusted: errors.length === 0, review_status: record?.review_status ?? "missing" };
  }

  verifyToolManifest(manifest: ToolManifest): RegistryDecision {
    const verification = verifySignedToolManifest(manifest, this.revocations);
    const record = this.records.get(manifest.publisher);
    const digest = computeDigest(createUnsignedPayload(manifest));
    const errors = [...verification.errors];
    if (!record || record.trust_status !== "trusted") errors.push(`publisher is not trusted: ${manifest.publisher}`);
    if (record && record.allowed_tool_manifests.length > 0 && !record.allowed_tool_manifests.includes(manifest.manifest_id)) errors.push(`tool manifest is not allowed: ${manifest.manifest_id}`);
    if (record && record.key_ids.length > 0 && !manifest.signatures.some((signature) => record.key_ids.includes(signature.key_id))) errors.push("no signature uses a trusted key");
    if (record && record.pinned_digests.length > 0 && !record.pinned_digests.includes(digest)) errors.push(`tool manifest digest is not pinned: ${digest}`);
    return { ...verification, errors, valid: errors.length === 0, trusted: errors.length === 0, review_status: record?.review_status ?? "missing" };
  }
}
