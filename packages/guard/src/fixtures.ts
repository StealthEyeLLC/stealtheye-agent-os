import { createUnsignedPayload, computeDigest, trustedSignedAgentCard, trustedSignedToolManifest, trustedFixtureRegistryRecord, InMemoryTrustRegistry } from "@stealtheye/agent-registry";
import { createCapabilityTokenFixture } from "./capability-token";
import { GuardSchemaVersion, type RequestedAction } from "./schemas";

export const PUBLIC_GUARD_FIXTURE_NOTICE = "Public-safe Guard fixtures only. No real secrets, credentials, production endpoints, customer data, OAuth clients, or cloud account identifiers.";

export const trustedManifest = trustedSignedToolManifest();
export const trustedAgent = trustedSignedAgentCard();
export const trustedManifestDigest = computeDigest(createUnsignedPayload(trustedManifest));
export const trustedCapabilityToken = createCapabilityTokenFixture({
  tool_manifest_constraints: {
    allowed_agent_ids: [trustedAgent.agent_id],
    allowed_manifest_ids: [trustedManifest.manifest_id],
    pinned_digests: [trustedManifestDigest],
    required_trust_status: "trusted_and_approved"
  }
});

export function trustedRegistryDecisionFixture() {
  const registry = new InMemoryTrustRegistry();
  registry.trustPublisher(trustedFixtureRegistryRecord(trustedAgent, trustedManifest));
  return registry.verifyToolManifest(trustedManifest);
}

export function requestedRepoWriteAction(overrides: Partial<RequestedAction> = {}): RequestedAction {
  return {
    schema_version: GuardSchemaVersion.RequestedAction,
    action_id: "action:fixture:repo-write",
    mission_id: "mission:fixture:build-3",
    actor_id: trustedAgent.agent_id,
    subject_type: "agent",
    effect: "write_branch_files",
    target: {
      repo: "StealthEyeLLC/stealtheye-agent-os",
      branch: "agent/guard-capability-tokens",
      path: "packages/guard/src/index.ts",
      environment: "development",
      system: "github",
      account: "StealthEyeLLC"
    },
    agent_id: trustedAgent.agent_id,
    manifest_id: trustedManifest.manifest_id,
    manifest_digest: trustedManifestDigest,
    key_id: "public-test-key-1",
    risk_indicators: [],
    side_effects: ["write_branch_file"],
    requested_at: "2026-01-01T00:01:00.000Z",
    idempotency_key: "idem:fixture:repo-write",
    metadata: { fixture_notice: PUBLIC_GUARD_FIXTURE_NOTICE },
    evidence_refs: ["test://guard/fixtures/repo-write"],
    ...overrides
  };
}

export const guardEvalFixtures = {
  normalDelegatedRepoActionAllowed: requestedRepoWriteAction(),
  productionDeployEscalated: requestedRepoWriteAction({ action_id: "action:fixture:production-deploy", effect: "production_deploy", target: { environment: "production", system: "github" } }),
  moneyMovementEscalated: requestedRepoWriteAction({ action_id: "action:fixture:money", effect: "money_movement" }),
  rawSecretAccessEscalated: requestedRepoWriteAction({ action_id: "action:fixture:secrets", effect: "raw_secret_access" }),
  protectedBranchMutationDenied: requestedRepoWriteAction({ action_id: "action:fixture:main", target: { repo: "StealthEyeLLC/stealtheye-agent-os", branch: "main", path: "README.md", environment: "development", system: "github", account: "StealthEyeLLC" } }),
  untrustedManifestDenied: requestedRepoWriteAction({ action_id: "action:fixture:untrusted-manifest", manifest_id: "tool-manifest:unknown" }),
  digestMismatchDenied: requestedRepoWriteAction({ action_id: "action:fixture:digest-mismatch", manifest_digest: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }),
  expiredTokenDenied: requestedRepoWriteAction({ action_id: "action:fixture:expired-token" }),
  revokedTokenDenied: requestedRepoWriteAction({ action_id: "action:fixture:revoked-token" })
};
