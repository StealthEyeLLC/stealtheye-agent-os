import { generateKeyPairSync } from "node:crypto";
import { createUnsignedPayload } from "./canonicalize";
import { computeDigest } from "./digest";
import { SchemaVersion, type AgentCard, type ToolManifest, type TrustRegistryRecord } from "./schemas";
import { signPayload } from "./signing";

export const PUBLIC_TEST_FIXTURE_NOTICE = "Generated local test keypair only. No real secrets, credentials, production endpoints, or private infrastructure details.";

const testKeyPair = generateKeyPairSync("ed25519");
export const TEST_KEY_ID = "public-test-key-1";
export const TEST_PUBLIC_KEY = testKeyPair.publicKey.export({ type: "spki", format: "pem" }).toString();

const now = "2026-01-01T00:00:00.000Z";
const later = "2027-01-01T00:00:00.000Z";

export function unsignedTrustedToolManifest(): Omit<ToolManifest, "signatures"> {
  return {
    schema_version: SchemaVersion.ToolManifest,
    manifest_id: "tool-manifest:codeops-fixture",
    name: "CodeOps Fixture Tools",
    publisher: "StealthEye Test Fixtures",
    version: "0.1.0",
    description: "Public test fixture for signed tool manifests.",
    tools: [{
      name: "repo.patch",
      description: "Apply scoped branch patches in test fixtures.",
      input_schema: { type: "object", required: ["path", "patch"] },
      output_schema: { type: "object", required: ["diff"] },
      scopes: ["repo:write_branch"],
      side_effects: { read: true, write: true, destructive: false, open_world: false, idempotent: false }
    }],
    auth_requirements: [{ mode: "github_app", scopes: ["contents:write", "pull_requests:write"], audience: "github" }],
    scopes: ["repo:write_branch", "pull_request:open"],
    side_effects: { read: true, write: true, destructive: false, open_world: false, idempotent: false },
    allowed_effects: ["write_branch_files", "commit_branch", "open_pr", "write_receipt"],
    hard_stop_categories: ["protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "raw_secrets_credentials"],
    receipt_requirements: { required: true, fields: ["tool_call", "diff", "authority", "artifact"], artifact_policy: "required" },
    risk_tier: "medium",
    public_keys: [{ key_id: TEST_KEY_ID, alg: "Ed25519", encoding: "pem-spki", public_key: TEST_PUBLIC_KEY, created_at: now }],
    created_at: now,
    valid_until: later,
    revocation_refs: [{ kind: "manifest_id", ref: "revocations/test-manifests" }]
  };
}

export function trustedSignedToolManifest(): ToolManifest {
  const unsigned = unsignedTrustedToolManifest();
  return { ...unsigned, signatures: [signPayload(unsigned, TEST_KEY_ID, testKeyPair.privateKey, now)] };
}

export function unsignedTrustedAgentCard(): Omit<AgentCard, "signatures"> {
  const manifest = trustedSignedToolManifest();
  return {
    schema_version: SchemaVersion.AgentCard,
    agent_id: "agent:codeops-fixture",
    name: "CodeOps Fixture Agent",
    publisher: "StealthEye Test Fixtures",
    version: "0.1.0",
    description: "Public test fixture for signed agent cards.",
    protocols: ["mcp", "internal"],
    public_keys: [{ key_id: TEST_KEY_ID, alg: "Ed25519", encoding: "pem-spki", public_key: TEST_PUBLIC_KEY, created_at: now }],
    capabilities: ["repo_patch", "open_pr", "receipt_write"],
    risk_tier: "medium",
    allowed_effects: ["write_branch_files", "commit_branch", "open_pr", "write_receipt"],
    hard_stops: ["protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "raw_secrets_credentials"],
    auth_requirements: [{ mode: "github_app", scopes: ["contents:write", "pull_requests:write"], audience: "github" }],
    receipt_requirements: { required: true, fields: ["mission", "tool_call", "diff", "final_report"], artifact_policy: "required" },
    linked_tool_manifests: [{ manifest_id: manifest.manifest_id, digest: computeDigest(createUnsignedPayload(manifest)) }],
    manifest_digest: computeDigest(createUnsignedPayload(manifest)),
    created_at: now,
    valid_until: later,
    revocation_refs: [{ kind: "agent_id", ref: "revocations/test-agents" }]
  };
}

export function trustedSignedAgentCard(): AgentCard {
  const unsigned = unsignedTrustedAgentCard();
  return { ...unsigned, signatures: [signPayload(unsigned, TEST_KEY_ID, testKeyPair.privateKey, now)] };
}

export function untrustedAgentCard(): AgentCard {
  const card = trustedSignedAgentCard();
  return { ...card, agent_id: "agent:untrusted-fixture", publisher: "Unknown Fixture Publisher" };
}

export function riskyEscalatedToolManifest(): ToolManifest {
  const base = trustedSignedToolManifest();
  return {
    ...base,
    risk_tier: "high",
    scopes: [...base.scopes, "production:write"],
    side_effects: { ...base.side_effects, open_world: true },
    tools: [...base.tools, {
      name: "prod.mutate",
      description: "Risky fixture demonstrating escalation review.",
      scopes: ["production:write"],
      side_effects: { read: true, write: true, destructive: false, open_world: true, idempotent: false }
    }]
  };
}

export function trustedFixtureRegistryRecord(agent: AgentCard, manifest: ToolManifest): TrustRegistryRecord {
  return {
    publisher: "StealthEye Test Fixtures",
    key_ids: [TEST_KEY_ID],
    pinned_digests: [computeDigest(createUnsignedPayload(agent)), computeDigest(createUnsignedPayload(manifest))],
    allowed_agents: [agent.agent_id],
    allowed_tool_manifests: [manifest.manifest_id],
    trust_status: "trusted",
    review_status: "approved",
    notes: PUBLIC_TEST_FIXTURE_NOTICE,
    evidence_refs: ["test://agent-registry/fixtures"]
  };
}
