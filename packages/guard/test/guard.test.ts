import { describe, expect, it } from "vitest";
import {
  createCapabilityTokenFixture,
  createGuardDecisionReceipt,
  evaluateGuardDecision,
  guardEvalFixtures,
  requestedRepoWriteAction,
  revokeCapabilityToken,
  suspendCapabilityToken,
  trustedCapabilityToken,
  trustedManifestDigest,
  trustedRegistryDecisionFixture
} from "../src";

const now = new Date("2026-01-01T00:02:00.000Z");
const registryTrust = trustedRegistryDecisionFixture();

describe("Guard policy evaluation", () => {
  it("allows an action inside mission-scoped authority", () => {
    const decision = evaluateGuardDecision(requestedRepoWriteAction(), [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("allow");
    expect(decision.matched_capability_token_ids).toEqual([trustedCapabilityToken.token_id]);
    expect(decision.reason_codes).toEqual([]);
  });

  it("denies an action with no token", () => {
    const decision = evaluateGuardDecision(requestedRepoWriteAction(), [], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toEqual(["no_applicable_token", "no_capability_tokens_presented"]);
  });

  it("denies an action outside repo, path, and branch scope", () => {
    const action = requestedRepoWriteAction({ target: { repo: "Other/repo", branch: "feature/out", path: "private/file.ts", environment: "development", system: "github", account: "Other" } });
    const decision = evaluateGuardDecision(action, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("repo_out_of_scope");
    expect(decision.reason_codes).toContain("path_out_of_scope");
    expect(decision.reason_codes).toContain("branch_prefix_out_of_scope");
  });

  it("escalates production deployment hard stops", () => {
    const decision = evaluateGuardDecision(guardEvalFixtures.productionDeployEscalated, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("escalate");
    expect(decision.reason_codes).toContain("hard_stop:production_deploy_or_data_mutation");
  });

  it("escalates money movement hard stops", () => {
    const decision = evaluateGuardDecision(guardEvalFixtures.moneyMovementEscalated, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("escalate");
    expect(decision.reason_codes).toContain("hard_stop:money_billing_subscriptions");
  });

  it("escalates raw secret access hard stops", () => {
    const decision = evaluateGuardDecision(guardEvalFixtures.rawSecretAccessEscalated, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("escalate");
    expect(decision.reason_codes).toContain("hard_stop:raw_secrets_credentials");
  });

  it("denies direct protected branch mutation", () => {
    const decision = evaluateGuardDecision(guardEvalFixtures.protectedBranchMutationDenied, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("hard_stop:protected_branch_mutation");
  });

  it("denies force push/history rewrite", () => {
    const action = requestedRepoWriteAction({ action_id: "action:fixture:force", effect: "force_push" });
    const decision = evaluateGuardDecision(action, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("hard_stop:force_push_history_rewrite");
  });

  it("denies CI/test weakening", () => {
    const action = requestedRepoWriteAction({ action_id: "action:fixture:weaken-ci", effect: "weaken_ci" });
    const decision = evaluateGuardDecision(action, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("hard_stop:weaken_ci_tests_security");
  });

  it("denies untrusted manifest/agent", () => {
    const decision = evaluateGuardDecision(requestedRepoWriteAction(), [trustedCapabilityToken], { now, registryTrust: { ...registryTrust, trusted: false, valid: false, trust_status: "untrusted" } });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("registry_invalid");
    expect(decision.reason_codes).toContain("registry_untrusted");
  });

  it("denies pinned digest mismatch", () => {
    const decision = evaluateGuardDecision(guardEvalFixtures.digestMismatchDenied, [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("pinned_digest_mismatch");
  });

  it("denies expired tokens", () => {
    const expired = createCapabilityTokenFixture({ valid_until: "2025-01-01T00:00:00.000Z" });
    const decision = evaluateGuardDecision(requestedRepoWriteAction({ action_id: "action:fixture:expired" }), [expired], { now, registryTrust });
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("token_expired");
  });

  it("denies revoked and suspended tokens", () => {
    const revokedDecision = evaluateGuardDecision(requestedRepoWriteAction({ action_id: "action:fixture:revoked" }), [revokeCapabilityToken(trustedCapabilityToken)], { now, registryTrust });
    const suspendedDecision = evaluateGuardDecision(requestedRepoWriteAction({ action_id: "action:fixture:suspended" }), [suspendCapabilityToken(trustedCapabilityToken)], { now, registryTrust });
    expect(revokedDecision.decision).toBe("deny");
    expect(suspendedDecision.decision).toBe("deny");
    expect(revokedDecision.reason_codes).toContain("token_revoked");
    expect(suspendedDecision.reason_codes).toContain("token_suspended");
  });

  it("allows trusted registry decisions", () => {
    const decision = evaluateGuardDecision(requestedRepoWriteAction({ manifest_digest: trustedManifestDigest }), [trustedCapabilityToken], { now, registryTrust });
    expect(decision.decision).toBe("allow");
    expect(decision.registry_trust_result?.trusted).toBe(true);
    expect(decision.registry_trust_result?.review_status).toBe("approved");
  });

  it("receipt contains decision and evidence fields", () => {
    const action = requestedRepoWriteAction();
    const decision = evaluateGuardDecision(action, [trustedCapabilityToken], { now, registryTrust });
    const receipt = createGuardDecisionReceipt(decision, action, [trustedCapabilityToken.token_id]);
    expect(receipt.decision_id).toBe(decision.decision_id);
    expect(receipt.evidence_refs).toEqual(action.evidence_refs);
    expect(receipt.policy_checks.length).toBeGreaterThan(0);
    expect(receipt.registry_trust_summary?.trusted).toBe(true);
  });

  it("returns deterministic reason codes for important denials", () => {
    const action = requestedRepoWriteAction({ action_id: "action:fixture:deterministic", manifest_digest: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" });
    const decision = evaluateGuardDecision(action, [], { now });
    expect(decision.reason_codes).toEqual(["no_applicable_token", "no_capability_tokens_presented"]);
  });
});
