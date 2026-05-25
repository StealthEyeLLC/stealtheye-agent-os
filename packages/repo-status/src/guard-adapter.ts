import {
  GuardSchemaVersion,
  RequestedActionSchema,
  createCapabilityTokenFixture,
  evaluateGuardDecision,
  type CapabilityToken,
  type Effect,
  type GuardDecision,
  type RegistryTrustSummary
} from "@stealtheye/guard";
import { evaluateReadOnlyRepoPolicy } from "./read-policy";
import type { ReadOnlyGitHubEffect, ReadOnlyPolicyResult, RepositoryTarget } from "./schemas";

export const REPO_STATUS_MISSION_ID = "mission:fixture:build-11-repo-status";
export const REPO_STATUS_ACTOR_ID = "agent:repo-status-fixture";
export const REPO_STATUS_AGENT_ID = "agent:repo-status-fixture";
export const REPO_STATUS_MANIFEST_ID = "tool-manifest:repo-status-fixture";
export const REPO_STATUS_NOW = "2026-01-01T00:00:00.000Z";

export interface EvaluateRepoStatusGuardInput {
  effect: ReadOnlyGitHubEffect | string;
  target: RepositoryTarget;
  ref?: string | undefined;
  path?: string | undefined;
  operationId?: string | undefined;
  registryTrust?: RegistryTrustSummary | undefined;
  liveCapable?: boolean | undefined;
}

export interface RepoStatusGuardResult {
  policy: ReadOnlyPolicyResult;
  decision: GuardDecision;
}

export function mapRepoStatusEffectToGuardEffect(effect: string): Effect {
  if (effect === "read_public_workflow_status") return "read_ci";
  if (effect === "write_branch_files") return "write_branch_files";
  if (effect === "commit_branch") return "commit_branch";
  if (effect === "open_pr") return "open_pr";
  if (effect === "rerun_ci" || effect === "dispatch_workflow") return "rerun_failed_jobs";
  if (effect === "read_secrets" || effect === "read_private_repo") return "raw_secret_access";
  if (effect === "deploy") return "production_deploy";
  if (effect === "money_movement") return "money_movement";
  if (effect === "external_send" || effect === "update_pr" || effect === "update_issue" || effect === "mutate_repo_settings") return "external_send";
  return "read_repo";
}

export function createRepoStatusCapabilityTokenFixture(overrides: Partial<CapabilityToken> = {}): CapabilityToken {
  return createCapabilityTokenFixture({
    token_id: "cap-token:fixture:repo-status-read-only",
    mission_id: REPO_STATUS_MISSION_ID,
    issued_to: REPO_STATUS_ACTOR_ID,
    subject_type: "agent",
    allowed_effects: ["read_repo", "read_ci", "write_receipt"],
    denied_effects: ["write_branch_files", "commit_branch", "open_pr", "rerun_failed_jobs", "external_send"],
    forbidden_effects: ["raw_secret_access", "money_movement", "production_deploy", "force_push", "history_rewrite", "weaken_ci", "delete_test_to_pass", "protected_branch_mutation"],
    hard_stops: ["raw_secrets_credentials", "money_billing_subscriptions", "production_deploy_or_data_mutation", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "material_external_send"],
    target_constraints: {
      repositories: ["StealthEyeLLC/stealtheye-agent-os"],
      branches: [],
      branch_prefixes: [],
      paths: [],
      systems: ["github"],
      environments: ["public"],
      domains: [],
      accounts: ["StealthEyeLLC"]
    },
    tool_manifest_constraints: {
      allowed_agent_ids: [REPO_STATUS_AGENT_ID],
      allowed_manifest_ids: [REPO_STATUS_MANIFEST_ID],
      pinned_digests: [],
      required_trust_status: "trusted_and_approved"
    },
    evidence_requirements: ["public_github_metadata_summary"],
    receipt_requirements: ["guard_decision", "repo_status_read_receipt"],
    escalation_requirements: ["private_repo", "write_or_mutation", "secret_access", "untrusted_manifest"],
    ...overrides
  });
}

export const TRUSTED_REPO_STATUS_REGISTRY: RegistryTrustSummary = {
  trusted: true,
  valid: true,
  trust_status: "trusted",
  review_status: "approved",
  errors: [],
  warnings: [],
  revoked: false
};

export const UNTRUSTED_REPO_STATUS_REGISTRY: RegistryTrustSummary = {
  trusted: false,
  valid: true,
  trust_status: "untrusted",
  review_status: "unreviewed",
  errors: [],
  warnings: ["fixture registry summary is intentionally untrusted"],
  revoked: false
};

export function evaluateRepoStatusGuard(input: EvaluateRepoStatusGuardInput): RepoStatusGuardResult {
  const policy = evaluateReadOnlyRepoPolicy({ effect: input.effect, target: input.target, ref: input.ref, path: input.path, liveCapable: input.liveCapable });
  const guardEffect = mapRepoStatusEffectToGuardEffect(input.effect);
  const action = RequestedActionSchema.parse({
    schema_version: GuardSchemaVersion.RequestedAction,
    action_id: input.operationId ?? `repo-status:${input.effect}:${input.target.full_name}`,
    mission_id: REPO_STATUS_MISSION_ID,
    actor_id: REPO_STATUS_ACTOR_ID,
    subject_type: "agent",
    effect: guardEffect,
    target: {
      repo: input.target.full_name,
      ...(input.ref ? { branch: input.ref } : {}),
      ...(input.path ? { path: input.path } : {}),
      system: "github",
      environment: "public",
      account: input.target.owner
    },
    agent_id: REPO_STATUS_AGENT_ID,
    manifest_id: REPO_STATUS_MANIFEST_ID,
    risk_indicators: policy.allowed ? ["public_read_only", "no_write_side_effect"] : policy.reason_codes,
    side_effects: [],
    requested_at: REPO_STATUS_NOW,
    idempotency_key: `repo-status:${input.effect}:${input.target.full_name}:${input.ref ?? "default"}:${input.path ?? "none"}`,
    metadata: { read_policy_allowed: policy.allowed, live_capability_status: policy.live_capability_status },
    evidence_refs: []
  });
  const decision = evaluateGuardDecision(action, [createRepoStatusCapabilityTokenFixture()], {
    now: new Date(REPO_STATUS_NOW),
    registryTrust: input.registryTrust ?? TRUSTED_REPO_STATUS_REGISTRY,
    decisionId: `guard-decision:${action.action_id}`
  });
  return { policy, decision: policy.allowed ? decision : { ...decision, decision: "deny", reason_codes: [...new Set([...decision.reason_codes, ...policy.reason_codes])].sort(), summary: policy.summary } };
}
