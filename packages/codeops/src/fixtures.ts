import { createCapabilityTokenFixture, type CapabilityToken, type RegistryTrustInput } from "@stealtheye/guard";
import { CodeOpsSchemaVersion, CiLogSummarySchema, FileChangeContractSchema, PatchPlanSchema, RepoTargetSchema, VerificationPlanSchema, type CiLogSummary, type FileChangeContract, type PatchPlan, type RepoTarget, type VerificationPlan } from "./schemas";
import { createCiLogSummary } from "./ci-log";
import { computePatchPlanFingerprint } from "./file-changes";
import { createPrEvidencePacket } from "./pr-evidence";

export const PUBLIC_CODEOPS_FIXTURE_NOTICE = "Build 7 CodeOps/CI Repair fixtures are fake, local, deterministic, and public-safe.";
export const fixtureNow = "2026-01-01T00:00:00.000Z";

const digestA = `sha256:${"a".repeat(64)}`;
const digestB = `sha256:${"b".repeat(64)}`;

export const safeRepoTarget: RepoTarget = RepoTargetSchema.parse({
  schema_version: CodeOpsSchemaVersion.RepoTarget,
  repo_full_name: "StealthEyeLLC/stealtheye-agent-os",
  base_branch: "main",
  working_branch: "agent/codeops-ci-repair-foundation",
  allowed_branch_prefixes: ["agent/"],
  protected_branches: ["main", "master", "release/stable"],
  allowed_paths: ["packages/", "docs/", "README.md", "AGENTS.md", "llms.txt", "llms-full.txt", ".github/"],
  denied_paths: [".env", "secrets/", "private/", "prod/"],
  required_status_checks: ["Scaffold and package checks"],
  required_verification_commands: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test"],
  public_private_boundary_notes: ["No live GitHub mutation or secret access is performed by foundation helpers."],
  authority_refs: ["authority:fixture:codeops"],
  capability_token_refs: ["cap-token:fixture:codeops"],
  manifest_tool_refs: ["tool-manifest:codeops-fixture"],
  evidence_requirements: ["diff", "ci_status", "verification_logs"],
  receipt_requirements: ["guard_decision", "worker_receipt", "pr_evidence"]
});

export const protectedBranchRepoTarget: RepoTarget = RepoTargetSchema.parse({
  ...safeRepoTarget,
  working_branch: "main"
});

export const safeUpdateChange: FileChangeContract = FileChangeContractSchema.parse({
  schema_version: CodeOpsSchemaVersion.FileChangeContract,
  path: "packages/codeops/src/schemas.ts",
  operation: "update",
  before_digest_ref: digestA,
  after_digest_ref: digestB,
  summary: "Add CodeOps schema definitions.",
  risk_indicators: ["package foundation change"],
  evidence_refs: ["evidence:fixture:schema-diff"],
  receipt_refs: ["receipt:fixture:schema-change"]
});

export const docsUpdateChange: FileChangeContract = FileChangeContractSchema.parse({
  schema_version: CodeOpsSchemaVersion.FileChangeContract,
  path: "docs/CODEOPS.md",
  operation: "create",
  after_digest_ref: digestB,
  summary: "Document CodeOps foundation contracts.",
  risk_indicators: ["docs change"],
  evidence_refs: ["evidence:fixture:docs-diff"],
  receipt_refs: ["receipt:fixture:docs-change"]
});

export const destructiveDeleteChange: FileChangeContract = FileChangeContractSchema.parse({
  schema_version: CodeOpsSchemaVersion.FileChangeContract,
  path: "packages/codeops/test/codeops.test.ts",
  operation: "delete",
  before_digest_ref: digestA,
  summary: "Delete a test file to make CI pass.",
  risk_indicators: ["destructive delete", "delete test to pass"],
  evidence_refs: ["evidence:fixture:delete-attempt"],
  receipt_refs: ["receipt:fixture:delete-attempt"]
});

export const secretBearingPathChange: FileChangeContract = FileChangeContractSchema.parse({
  schema_version: CodeOpsSchemaVersion.FileChangeContract,
  path: "secrets/local-token.fixture",
  operation: "create",
  after_digest_ref: digestB,
  summary: "Attempt to add secret-bearing local fixture path without secret material.",
  risk_indicators: ["secret-bearing path"],
  evidence_refs: ["evidence:fixture:secret-path"],
  receipt_refs: ["receipt:fixture:secret-path"]
});

export const ciWeakeningChange: FileChangeContract = FileChangeContractSchema.parse({
  schema_version: CodeOpsSchemaVersion.FileChangeContract,
  path: ".github/workflows/ci.yml",
  operation: "update",
  before_digest_ref: digestA,
  after_digest_ref: digestB,
  summary: "Attempt to continue-on-error for tests to bypass CI.",
  risk_indicators: ["weaken ci", "skip test"],
  evidence_refs: ["evidence:fixture:ci-weakening"],
  receipt_refs: ["receipt:fixture:ci-weakening"]
});

export const verificationPlanFixture: VerificationPlan = VerificationPlanSchema.parse({
  schema_version: CodeOpsSchemaVersion.VerificationPlan,
  verification_plan_id: "verification-plan:fixture:codeops",
  commands: [
    { command: "pnpm install --no-frozen-lockfile", required: true, reason: "Install workspace dependencies in CI." },
    { command: "pnpm typecheck", required: true, reason: "TypeScript package contracts changed." },
    { command: "pnpm test", required: true, reason: "Eval-style tests must pass." }
  ],
  ci_checks: ["Scaffold and package checks"],
  required_artifacts: ["ci_status", "changed_files", "verification_logs"],
  expected_logs: ["Typecheck packages", "Run tests", "Verify required scaffold files exist", "Basic secret-string guard"],
  success_criteria: ["typecheck passes", "tests pass", "required files exist", "no secret-like strings are found"],
  failure_classification_hints: ["typecheck_failure", "test_failure", "secret_guard_failure"],
  timeout_hints: ["Use CI run timeout as authoritative."],
  retry_policy_refs: ["retry-policy:ci-repair-foundation"],
  evidence_refs: ["evidence:fixture:verification"],
  receipt_refs: ["receipt:fixture:verification"]
});

export const safePatchPlan: PatchPlan = PatchPlanSchema.parse({
  schema_version: CodeOpsSchemaVersion.PatchPlan,
  patch_plan_id: "patch-plan:fixture:safe-codeops",
  mission_id: "mission:fixture:build-7",
  task_id: "task:fixture:codeops-safe",
  repo_target: safeRepoTarget,
  files_to_read: [],
  files_to_modify: [safeUpdateChange],
  files_to_create: [docsUpdateChange],
  files_to_delete_or_deprecate: [],
  expected_effects: ["read_repo", "write_branch_files", "commit_branch", "open_pr", "read_ci", "write_receipt"],
  risk_tier: "medium",
  verification_plan: verificationPlanFixture,
  rollback_notes: "Revert the branch commit in a follow-up branch-scoped patch; do not mutate protected branches directly.",
  evidence_refs: ["evidence:fixture:safe-plan"],
  receipt_refs: ["receipt:fixture:safe-plan"],
  status: "ready_for_preflight"
});

export const protectedBranchPatchPlan: PatchPlan = PatchPlanSchema.parse({
  ...safePatchPlan,
  patch_plan_id: "patch-plan:fixture:protected-branch",
  task_id: "task:fixture:protected-branch",
  repo_target: protectedBranchRepoTarget
});

export const forcePushPatchPlan: PatchPlan = PatchPlanSchema.parse({
  ...safePatchPlan,
  patch_plan_id: "patch-plan:fixture:force-push",
  task_id: "task:fixture:force-push",
  expected_effects: [...safePatchPlan.expected_effects, "force_push"],
  files_to_modify: [{ ...safeUpdateChange, risk_indicators: ["force push", "history rewrite"] }]
});

export const destructiveDeletePatchPlan: PatchPlan = PatchPlanSchema.parse({
  ...safePatchPlan,
  patch_plan_id: "patch-plan:fixture:delete-attempt",
  task_id: "task:fixture:delete-attempt",
  files_to_modify: [],
  files_to_create: [],
  files_to_delete_or_deprecate: [destructiveDeleteChange],
  risk_tier: "high"
});

export const ciWeakeningPatchPlan: PatchPlan = PatchPlanSchema.parse({
  ...safePatchPlan,
  patch_plan_id: "patch-plan:fixture:ci-weakening",
  task_id: "task:fixture:ci-weakening",
  files_to_modify: [ciWeakeningChange],
  files_to_create: []
});

export const secretBearingPathPatchPlan: PatchPlan = PatchPlanSchema.parse({
  ...safePatchPlan,
  patch_plan_id: "patch-plan:fixture:secret-path",
  task_id: "task:fixture:secret-path",
  files_to_modify: [],
  files_to_create: [secretBearingPathChange],
  risk_tier: "high"
});

export const typecheckFailureLog = "Run pnpm typecheck\npackages/codeops/src/example.ts(7,3): error TS2322: Type 'string' is not assignable to type 'number'.";
export const testFailureLog = "Run pnpm test\nFAIL packages/codeops/test/codeops.test.ts > expected safe plan to pass\nAssertionError: expected false to be true";
export const secretGuardFailureLog = "Basic secret-string guard\nPotential secret-like string found in public-safe fixture output.";
export const flakyInfrastructureFailureLog = "GitHub Actions runner reported ECONNRESET while downloading dependencies. Retry may succeed. This looks flaky.";

export const typecheckFailureSummary: CiLogSummary = createCiLogSummary({
  workflow_name: "CI",
  run_id: "1001",
  job_id: "2001",
  check_name: "Scaffold and package checks",
  failed_step: "Typecheck packages",
  log: typecheckFailureLog,
  fetched_at: fixtureNow,
  evidence_refs: ["evidence:fixture:typecheck-log"]
});

export const testFailureSummary: CiLogSummary = createCiLogSummary({
  workflow_name: "CI",
  run_id: "1002",
  job_id: "2002",
  check_name: "Scaffold and package checks",
  failed_step: "Run tests",
  log: testFailureLog,
  fetched_at: fixtureNow,
  evidence_refs: ["evidence:fixture:test-log"]
});

export const secretGuardFailureSummary: CiLogSummary = createCiLogSummary({
  workflow_name: "CI",
  run_id: "1003",
  job_id: "2003",
  check_name: "Scaffold and package checks",
  failed_step: "Basic secret-string guard",
  log: secretGuardFailureLog,
  fetched_at: fixtureNow,
  evidence_refs: ["evidence:fixture:secret-guard-log"]
});

export const flakyInfrastructureFailureSummary: CiLogSummary = createCiLogSummary({
  workflow_name: "CI",
  run_id: "1004",
  job_id: "2004",
  check_name: "Scaffold and package checks",
  failed_step: "Install dependencies",
  log: flakyInfrastructureFailureLog,
  fetched_at: fixtureNow,
  evidence_refs: ["evidence:fixture:infra-log"]
});

export const unknownFailureSummary: CiLogSummary = CiLogSummarySchema.parse({
  schema_version: CodeOpsSchemaVersion.CiLogSummary,
  provider: "github_actions",
  workflow_name: "CI",
  run_id: "1005",
  job_id: "2005",
  check_name: "Scaffold and package checks",
  status: "completed",
  conclusion: "failure",
  failed_step: "Unknown",
  relevant_log_excerpts: [{ label: "public_safe_excerpt", text: "The job failed without a recognizable public-safe pattern.", public_safe: true }],
  detected_failure_categories: ["unknown_failure"],
  evidence_refs: ["evidence:fixture:unknown-log"],
  fetched_at: fixtureNow
});

export const trustedCodeOpsCapabilityToken: CapabilityToken = createCapabilityTokenFixture({
  token_id: "cap-token:fixture:codeops",
  mission_id: safePatchPlan.mission_id,
  issued_to: "agent:codeops-fixture",
  allowed_effects: ["read_repo", "write_branch_files", "commit_branch", "open_pr", "read_ci", "rerun_failed_jobs", "write_receipt"],
  forbidden_effects: ["protected_branch_mutation", "force_push", "history_rewrite", "weaken_ci", "delete_test_to_pass", "destructive_delete", "raw_secret_access", "money_movement", "production_deploy"],
  hard_stops: ["raw_secrets_credentials", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "deletion_destruction"],
  target_constraints: {
    repositories: [safeRepoTarget.repo_full_name],
    branches: [],
    branch_prefixes: ["agent/"],
    paths: safeRepoTarget.allowed_paths,
    systems: ["github"],
    environments: ["development", "test"],
    domains: [],
    accounts: ["StealthEyeLLC"]
  },
  evidence_requirements: safeRepoTarget.evidence_requirements,
  receipt_requirements: safeRepoTarget.receipt_requirements
});

export const trustedCodeOpsRegistrySummary: RegistryTrustInput = {
  trusted: true,
  valid: true,
  trust_status: "trusted",
  review_status: "approved",
  errors: [],
  warnings: [],
  revoked: false
};

export const untrustedCodeOpsRegistrySummary: RegistryTrustInput = {
  trusted: false,
  valid: false,
  trust_status: "untrusted",
  review_status: "rejected",
  errors: ["fixture registry trust denied"],
  warnings: [],
  revoked: false
};

export const prEvidencePacketFixture = createPrEvidencePacket({
  evidence_packet_id: "pr-evidence:fixture:codeops",
  patch_plan: safePatchPlan,
  checks: [typecheckFailureSummary],
  pr_number: 8,
  pr_url: "https://github.com/StealthEyeLLC/stealtheye-agent-os/pull/8",
  commit_sha: "abcdef1234567890",
  created_at: fixtureNow
});

export const safePatchPlanFingerprint = computePatchPlanFingerprint(safePatchPlan);
