import { createHash } from "node:crypto";
import { canonicalize } from "@stealtheye/agent-registry";
import { CapabilityTokenSchema, GuardSchemaVersion, type CapabilityToken, type RequestedAction } from "./schemas";

export function capabilityTokenDigest(token: CapabilityToken): string {
  const { digest: _digest, signature_refs: _signatureRefs, ...unsigned } = token;
  return `sha256:${createHash("sha256").update(canonicalize(unsigned), "utf8").digest("hex")}`;
}

export function createCapabilityTokenFixture(overrides: Partial<CapabilityToken> = {}): CapabilityToken {
  const issuedAt = overrides.issued_at ?? "2026-01-01T00:00:00.000Z";
  const token: CapabilityToken = {
    schema_version: GuardSchemaVersion.CapabilityToken,
    token_id: "cap-token:fixture:repo-write",
    mission_id: "mission:fixture:build-3",
    issued_to: "agent:codeops-fixture",
    issued_by: "user:jamie-fixture",
    subject_type: "agent",
    authority_origin: "user_chat",
    allowed_effects: ["read_repo", "write_branch_files", "commit_branch", "open_pr", "read_ci", "write_receipt", "generate_final_report"],
    denied_effects: [],
    forbidden_effects: ["raw_secret_access", "money_movement", "production_deploy", "force_push", "history_rewrite", "weaken_ci", "delete_test_to_pass"],
    hard_stops: ["raw_secrets_credentials", "money_billing_subscriptions", "production_deploy_or_data_mutation", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security"],
    target_constraints: {
      repositories: ["StealthEyeLLC/stealtheye-agent-os"],
      branches: [],
      branch_prefixes: ["agent/"],
      paths: ["packages/", "docs/", "README.md", "AGENTS.md", "llms.txt", "llms-full.txt", ".github/workflows/ci.yml"],
      systems: ["github"],
      environments: ["development", "test"],
      domains: [],
      accounts: ["StealthEyeLLC"]
    },
    tool_manifest_constraints: {
      allowed_agent_ids: ["agent:codeops-fixture"],
      allowed_manifest_ids: ["tool-manifest:codeops-fixture"],
      pinned_digests: [],
      required_trust_status: "trusted_and_approved"
    },
    issued_at: issuedAt,
    valid_until: "2027-01-01T00:00:00.000Z",
    usage_constraints: { max_uses: 100, max_attempts: 100, max_commits: 20, max_cost_cents: 0, uses: 0, attempts: 0, commits: 0, cost_cents: 0 },
    evidence_requirements: ["diff", "tests", "ci_status"],
    receipt_requirements: ["guard_decision", "policy_checks", "registry_summary"],
    escalation_requirements: ["hard_stop", "outside_scope", "untrusted_manifest"],
    signature_refs: [],
    status: "active",
    ...overrides
  };
  return CapabilityTokenSchema.parse({ ...token, digest: overrides.digest ?? capabilityTokenDigest(token) });
}

export function isExpired(token: CapabilityToken, now = new Date()): boolean {
  return new Date(token.valid_until).getTime() <= now.getTime();
}

export function isExhausted(token: CapabilityToken): boolean {
  const usage = token.usage_constraints;
  return Boolean(
    (usage.max_uses !== undefined && usage.uses >= usage.max_uses) ||
    (usage.max_attempts !== undefined && usage.attempts >= usage.max_attempts) ||
    (usage.max_commits !== undefined && usage.commits >= usage.max_commits) ||
    (usage.max_cost_cents !== undefined && usage.max_cost_cents > 0 && usage.cost_cents >= usage.max_cost_cents)
  );
}

export function tokenLifecycleStatus(token: CapabilityToken, now = new Date()): CapabilityToken["status"] {
  if (token.status === "revoked" || token.status === "suspended") return token.status;
  if (isExpired(token, now)) return "expired";
  if (isExhausted(token)) return "exhausted";
  return token.status;
}

export function revokeCapabilityToken(token: CapabilityToken): CapabilityToken {
  return { ...token, status: "revoked" };
}

export function suspendCapabilityToken(token: CapabilityToken): CapabilityToken {
  return { ...token, status: "suspended" };
}

export function markCapabilityTokenUsage(token: CapabilityToken, usage: Partial<CapabilityToken["usage_constraints"]> = {}): CapabilityToken {
  return {
    ...token,
    usage_constraints: {
      ...token.usage_constraints,
      uses: token.usage_constraints.uses + (usage.uses ?? 1),
      attempts: token.usage_constraints.attempts + (usage.attempts ?? 0),
      commits: token.usage_constraints.commits + (usage.commits ?? 0),
      cost_cents: token.usage_constraints.cost_cents + (usage.cost_cents ?? 0)
    }
  };
}

function matchesOne(value: string | undefined, allowed: string[]): boolean {
  return allowed.length === 0 || (value !== undefined && allowed.includes(value));
}

function matchesPrefix(value: string | undefined, prefixes: string[]): boolean {
  return prefixes.length === 0 || (value !== undefined && prefixes.some((prefix) => value.startsWith(prefix)));
}

function matchesPath(path: string | undefined, allowed: string[]): boolean {
  return allowed.length === 0 || (path !== undefined && allowed.some((scope) => path === scope || path.startsWith(scope)));
}

export interface TokenMatchResult {
  matches: boolean;
  reason_codes: string[];
}

export function matchCapabilityTokenToAction(token: CapabilityToken, action: RequestedAction, now = new Date()): TokenMatchResult {
  const reasons: string[] = [];
  const lifecycle = tokenLifecycleStatus(token, now);
  if (lifecycle !== "active") reasons.push(`token_${lifecycle}`);
  if (token.mission_id !== action.mission_id) reasons.push("mission_mismatch");
  if (token.issued_to !== action.actor_id) reasons.push("actor_mismatch");
  if (token.subject_type !== action.subject_type) reasons.push("subject_type_mismatch");
  if (!token.allowed_effects.includes(action.effect)) reasons.push("effect_not_allowed");
  if ([...token.denied_effects, ...token.forbidden_effects].includes(action.effect)) reasons.push("effect_forbidden");

  const constraints = token.target_constraints;
  if (!matchesOne(action.target.repo, constraints.repositories)) reasons.push("repo_out_of_scope");
  if (constraints.branches.length > 0 && !matchesOne(action.target.branch, constraints.branches)) reasons.push("branch_out_of_scope");
  if (constraints.branch_prefixes.length > 0 && !matchesPrefix(action.target.branch, constraints.branch_prefixes)) reasons.push("branch_prefix_out_of_scope");
  if (!matchesPath(action.target.path, constraints.paths)) reasons.push("path_out_of_scope");
  if (!matchesOne(action.target.system, constraints.systems)) reasons.push("system_out_of_scope");
  if (!matchesOne(action.target.environment, constraints.environments)) reasons.push("environment_out_of_scope");
  if (!matchesOne(action.target.domain, constraints.domains)) reasons.push("domain_out_of_scope");
  if (!matchesOne(action.target.account, constraints.accounts)) reasons.push("account_out_of_scope");

  const tool = token.tool_manifest_constraints;
  if (tool.allowed_agent_ids.length > 0 && (!action.agent_id || !tool.allowed_agent_ids.includes(action.agent_id))) reasons.push("agent_not_allowed");
  if (tool.allowed_manifest_ids.length > 0 && (!action.manifest_id || !tool.allowed_manifest_ids.includes(action.manifest_id))) reasons.push("manifest_not_allowed");
  if (tool.pinned_digests.length > 0 && (!action.manifest_digest || !tool.pinned_digests.includes(action.manifest_digest))) reasons.push("pinned_digest_mismatch");

  return { matches: reasons.length === 0, reason_codes: reasons.sort() };
}
