import { describe, expect, it } from "vitest";
import {
  PUBLIC_CODEOPS_FIXTURE_NOTICE,
  ciWeakeningPatchPlan,
  destructiveDeletePatchPlan,
  flakyInfrastructureFailureSummary,
  forcePushPatchPlan,
  prEvidencePacketFixture,
  protectedBranchPatchPlan,
  safePatchPlan,
  safePatchPlanFingerprint,
  safeRepoTarget,
  secretBearingPathPatchPlan,
  secretGuardFailureSummary,
  testFailureLog,
  trustedCodeOpsCapabilityToken,
  trustedCodeOpsRegistrySummary,
  typecheckFailureLog,
  typecheckFailureSummary,
  untrustedCodeOpsRegistrySummary,
  verificationPlanFixture
} from "../src/fixtures";
import { classifyCiLog } from "../src/ci-log";
import { createCiRepairPlan, evaluateRerunEligibility } from "../src/ci-repair";
import { allPatchPlanFileChanges, computePatchPlanFingerprint, detectCiTestWeakeningIndicators, detectForbiddenDeleteOperations, detectSuspiciousSecretBearingPaths } from "../src/file-changes";
import { createPrEvidencePacket } from "../src/pr-evidence";
import { guardDecisionsForPatchPlan, requestedActionsForPatchPlan, runCodeOpsPreflight, workerTasksForPatchPlan } from "../src/preflight";
import { branchSafeOperationSummary, hasAllowedBranchPrefix, isPathAllowed, isProtectedBranch } from "../src/repo-targets";
import { RepoTargetSchema } from "../src/schemas";
import { requiresTypecheckAndTests, verificationObligationsForPatchPlan } from "../src/verification-plan";

const accessKeyPrefix = `${"AK"}${"IA"}`;
const privateKeyHeaderPattern = `BEGIN (RSA|OPENSSH|EC|DSA) ${"PRIVATE"} ${"KEY"}`;
const secretLikeFixturePattern = new RegExp([
  `${accessKeyPrefix}[0-9A-Z]{16}`,
  privateKeyHeaderPattern,
  `client_${"secret"}=`,
  `${"PRIVATE"}_${"KEY"}=`,
  `pass${"word"}=`
].join("|"));

describe("CodeOps + CI Repair foundations", () => {
  it("validates a valid repo target", () => {
    expect(RepoTargetSchema.parse(safeRepoTarget).repo_full_name).toBe("StealthEyeLLC/stealtheye-agent-os");
  });

  it("rejects an invalid repo target", () => {
    expect(() => RepoTargetSchema.parse({ ...safeRepoTarget, repo_full_name: "not-a-full-name" })).toThrow();
  });

  it("accepts allowed branch prefixes", () => {
    expect(hasAllowedBranchPrefix(safeRepoTarget.working_branch, safeRepoTarget)).toBe(true);
  });

  it("rejects protected branch mutations", () => {
    expect(isProtectedBranch("main", safeRepoTarget)).toBe(true);
    expect(branchSafeOperationSummary(protectedBranchPatchPlan.repo_target, ["packages/codeops/src/schemas.ts"]).allowed).toBe(false);
  });

  it("rejects force push or history rewrite intent", () => {
    const summary = branchSafeOperationSummary(forcePushPatchPlan.repo_target, ["packages/codeops/src/schemas.ts"], ["force push", "history rewrite"]);
    expect(summary.allowed).toBe(false);
    expect(summary.reason_codes).toContain("force_push_or_history_rewrite_denied");
  });

  it("accepts allowed paths", () => {
    expect(isPathAllowed("packages/codeops/src/schemas.ts", safeRepoTarget)).toBe(true);
  });

  it("rejects denied paths", () => {
    expect(isPathAllowed("secrets/local-token.fixture", safeRepoTarget)).toBe(false);
  });

  it("detects destructive delete operations", () => {
    const finding = detectForbiddenDeleteOperations(allPatchPlanFileChanges(destructiveDeletePatchPlan));
    expect(finding.matched).toBe(true);
    expect(finding.reason_codes[0]).toContain("destructive_delete");
  });

  it("detects suspicious secret-bearing paths", () => {
    const finding = detectSuspiciousSecretBearingPaths(allPatchPlanFileChanges(secretBearingPathPatchPlan));
    expect(finding.matched).toBe(true);
    expect(finding.reason_codes[0]).toContain("secret_bearing_path");
  });

  it("detects CI/test weakening indicators", () => {
    const finding = detectCiTestWeakeningIndicators(allPatchPlanFileChanges(ciWeakeningPatchPlan));
    expect(finding.matched).toBe(true);
    expect(finding.reason_codes[0]).toContain("ci_test_weakening");
  });

  it("computes stable patch-plan fingerprints", () => {
    expect(computePatchPlanFingerprint(safePatchPlan)).toBe(safePatchPlanFingerprint);
    expect(computePatchPlanFingerprint({ ...safePatchPlan, evidence_refs: ["evidence:changed"] })).toBe(safePatchPlanFingerprint);
  });

  it("requires typecheck and tests for package file changes", () => {
    const obligations = verificationObligationsForPatchPlan(safePatchPlan);
    expect(obligations.find((obligation) => obligation.obligation_id === "package_typecheck_and_tests")?.satisfied).toBe(true);
    expect(requiresTypecheckAndTests({ ...verificationPlanFixture, commands: [] }, allPatchPlanFileChanges(safePatchPlan)).satisfied).toBe(false);
  });

  it("classifies typecheck failures", () => {
    expect(classifyCiLog(typecheckFailureLog)).toContain("typecheck_failure");
  });

  it("classifies test failures", () => {
    expect(classifyCiLog(testFailureLog)).toContain("test_failure");
  });

  it("classifies secret guard failures", () => {
    expect(secretGuardFailureSummary.detected_failure_categories).toContain("secret_guard_failure");
  });

  it("classifies infrastructure or flaky failures", () => {
    expect(flakyInfrastructureFailureSummary.detected_failure_categories).toEqual(expect.arrayContaining(["flaky_failure", "infrastructure_failure"]));
  });

  it("generates a repair plan for typecheck failure", () => {
    const plan = createCiRepairPlan({
      repair_plan_id: "repair-plan:fixture:typecheck",
      mission_id: safePatchPlan.mission_id,
      task_id: "task:fixture:repair-typecheck",
      ci_summary: typecheckFailureSummary,
      ci_summary_ref: "ci-summary:fixture:typecheck",
      suspected_files: ["packages/codeops/src/schemas.ts"],
      proposed_patch_plans: [safePatchPlan],
      evidence_refs: ["evidence:fixture:typecheck-log"],
      receipt_refs: ["receipt:fixture:repair-plan"]
    });
    expect(plan.status).toBe("patch_needed");
    expect(plan.rerun_eligibility.mode).toBe("after_patch");
  });

  it("allows rerun for infrastructure or flaky failures", () => {
    const rerun = evaluateRerunEligibility({
      ci_summary: flakyInfrastructureFailureSummary,
      evidence_refs: ["evidence:fixture:infra-log"],
      receipt_refs: ["receipt:fixture:rerun"]
    });
    expect(rerun.eligible).toBe(true);
    expect(rerun.mode).toBe("rerun_only");
  });

  it("denies rerun as the sole fix for deterministic typecheck failure", () => {
    const rerun = evaluateRerunEligibility({
      ci_summary: typecheckFailureSummary,
      evidence_refs: ["evidence:fixture:typecheck-log"],
      receipt_refs: ["receipt:fixture:rerun"]
    });
    expect(rerun.eligible).toBe(false);
    expect(rerun.reason_codes).toContain("deterministic_failure_requires_patch_before_rerun");
  });

  it("produces Guard requested actions for a safe CodeOps patch plan", () => {
    const actions = requestedActionsForPatchPlan(safePatchPlan);
    expect(actions.map((action) => action.effect)).toEqual(expect.arrayContaining(["read_repo", "write_branch_files", "commit_branch", "open_pr", "read_ci", "write_receipt"]));
  });

  it("produces Worker Fleet task templates for a safe CodeOps patch plan", () => {
    const tasks = workerTasksForPatchPlan(safePatchPlan);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((task) => task.task_type === "future_codeops" || task.task_type === "future_ci_repair")).toBe(true);
  });

  it("Guard preflight allows safe branch-scoped writes with matching authority", () => {
    const preflight = runCodeOpsPreflight({
      patch_plan: safePatchPlan,
      capability_tokens: [trustedCodeOpsCapabilityToken],
      registry_trust_summary: trustedCodeOpsRegistrySummary
    });
    expect(preflight.allowed).toBe(true);
    expect(preflight.blocked).toBe(false);
  });

  it("Guard preflight blocks protected branch mutation", () => {
    const preflight = runCodeOpsPreflight({
      patch_plan: protectedBranchPatchPlan,
      capability_tokens: [trustedCodeOpsCapabilityToken],
      registry_trust_summary: trustedCodeOpsRegistrySummary
    });
    expect(preflight.blocked).toBe(true);
    expect(preflight.reason_codes.some((reason) => reason.includes("protected_branch_mutation"))).toBe(true);
  });

  it("Guard preflight blocks CI/test weakening", () => {
    const preflight = runCodeOpsPreflight({
      patch_plan: ciWeakeningPatchPlan,
      capability_tokens: [trustedCodeOpsCapabilityToken],
      registry_trust_summary: trustedCodeOpsRegistrySummary
    });
    expect(preflight.blocked).toBe(true);
    expect(preflight.reason_codes.some((reason) => reason.includes("weaken_ci") || reason.includes("weaken_ci_tests_security"))).toBe(true);
  });

  it("blocks action-bearing plans with untrusted registry summaries", () => {
    const decisions = guardDecisionsForPatchPlan({
      patch_plan: safePatchPlan,
      capability_tokens: [trustedCodeOpsCapabilityToken],
      registry_trust_summary: untrustedCodeOpsRegistrySummary
    });
    expect(decisions.every((decision) => decision.decision === "deny")).toBe(true);
    expect(decisions.flatMap((decision) => decision.reason_codes)).toContain("registry_invalid");
  });

  it("captures PR evidence for branch, checks, files, and receipts", () => {
    expect(prEvidencePacketFixture.working_branch).toBe(safeRepoTarget.working_branch);
    expect(prEvidencePacketFixture.checks.length).toBeGreaterThan(0);
    expect(prEvidencePacketFixture.changed_files.length).toBeGreaterThan(0);
    expect(prEvidencePacketFixture.receipt_refs).toContain("receipt:fixture:safe-plan");

    const packet = createPrEvidencePacket({
      evidence_packet_id: "pr-evidence:fixture:second",
      patch_plan: safePatchPlan,
      created_at: "2026-01-01T00:00:00.000Z"
    });
    expect(packet.patch_plan_fingerprint).toBe(safePatchPlanFingerprint);
  });

  it("keeps fixtures free of real secrets", () => {
    const fixtureText = JSON.stringify({
      PUBLIC_CODEOPS_FIXTURE_NOTICE,
      safePatchPlan,
      destructiveDeletePatchPlan,
      ciWeakeningPatchPlan,
      secretBearingPathPatchPlan,
      typecheckFailureSummary,
      secretGuardFailureSummary,
      flakyInfrastructureFailureSummary
    });
    expect(fixtureText).not.toMatch(secretLikeFixturePattern);
  });
});
