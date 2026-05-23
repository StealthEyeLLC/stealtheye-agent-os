import { assessFileChangeRisks } from "./file-changes";
import { branchSafeOperationSummary } from "./repo-targets";
import { CodeOpsSchemaVersion, CiRepairPlanSchema, type CiLogSummary, type CiRepairPlan, type FailureCategory, type PatchPlan, type RerunEligibility, type VerificationCommand } from "./schemas";
import { ciSummaryIsDeterministicCodeFailure, ciSummaryIsRerunOnlyCandidate } from "./ci-log";

const deterministicPatchCategories = new Set<FailureCategory>([
  "typecheck_failure",
  "test_failure",
  "lint_failure",
  "formatting_failure",
  "dependency_install_failure",
  "missing_file_failure",
  "secret_guard_failure",
  "workflow_syntax_failure"
]);

export interface RerunPolicyInput {
  ci_summary: CiLogSummary;
  proposed_patch_plans?: PatchPlan[] | undefined;
  evidence_refs?: string[] | undefined;
  receipt_refs?: string[] | undefined;
}

function patchPlansWeakenCiOrSecurity(plans: PatchPlan[]): boolean {
  return plans.some((plan) => assessFileChangeRisks(plan).some((finding) => finding.check_id === "ci_test_weakening_indicators" && finding.matched));
}

function patchPlansRequireProtectedMutation(plans: PatchPlan[]): boolean {
  return plans.some((plan) => !branchSafeOperationSummary(plan.repo_target, plan.files_to_modify.concat(plan.files_to_create, plan.files_to_delete_or_deprecate).map((change) => change.path)).allowed);
}

export function evaluateRerunEligibility(input: RerunPolicyInput): RerunEligibility {
  const plans = input.proposed_patch_plans ?? [];
  const evidenceRefs = input.evidence_refs ?? input.ci_summary.evidence_refs;
  const receiptRefs = input.receipt_refs ?? [];
  const reasons: string[] = [];

  if (patchPlansWeakenCiOrSecurity(plans)) reasons.push("repair_weakens_ci_tests_or_security");
  if (patchPlansRequireProtectedMutation(plans)) reasons.push("protected_branch_mutation_required");
  if (evidenceRefs.length === 0) reasons.push("evidence_ref_required");
  if (receiptRefs.length === 0) reasons.push("receipt_ref_required");

  const deterministicFailure = ciSummaryIsDeterministicCodeFailure(input.ci_summary);
  const rerunOnlyCandidate = ciSummaryIsRerunOnlyCandidate(input.ci_summary);

  if (deterministicFailure && plans.length === 0) reasons.push("deterministic_failure_requires_patch_before_rerun");

  if (reasons.length > 0) {
    return {
      eligible: false,
      mode: "not_allowed",
      reason_codes: [...new Set(reasons)].sort(),
      summary: "CI rerun is not eligible under the current repair policy.",
      required_evidence_refs: evidenceRefs,
      required_receipt_refs: receiptRefs
    };
  }

  if (rerunOnlyCandidate) {
    return {
      eligible: true,
      mode: "rerun_only",
      reason_codes: ["flaky_or_infrastructure_failure"],
      summary: "CI rerun is eligible as a rerun-only repair for flaky/infrastructure failure evidence.",
      required_evidence_refs: evidenceRefs,
      required_receipt_refs: receiptRefs
    };
  }

  if (deterministicFailure && plans.length > 0) {
    return {
      eligible: true,
      mode: "after_patch",
      reason_codes: ["patch_required_before_rerun"],
      summary: "CI rerun is eligible only after the proposed patch plan is applied and verified.",
      required_evidence_refs: evidenceRefs,
      required_receipt_refs: receiptRefs
    };
  }

  return {
    eligible: false,
    mode: "not_allowed",
    reason_codes: ["unknown_failure_not_rerun_eligible_without_more_evidence"],
    summary: "CI rerun is not eligible without clearer failure classification evidence.",
    required_evidence_refs: evidenceRefs,
    required_receipt_refs: receiptRefs
  };
}

export interface CreateCiRepairPlanInput {
  repair_plan_id: string;
  mission_id: string;
  task_id: string;
  ci_summary: CiLogSummary;
  ci_summary_ref: string;
  suspected_files?: string[] | undefined;
  proposed_patch_plans?: PatchPlan[] | undefined;
  verification_commands?: VerificationCommand[] | undefined;
  evidence_refs?: string[] | undefined;
  receipt_refs?: string[] | undefined;
}

function statusForRepairPlan(categories: FailureCategory[], rerun: RerunEligibility, proposedPatchPlans: PatchPlan[]): CiRepairPlan["status"] {
  if (!rerun.eligible) return "blocked";
  if (rerun.mode === "rerun_only") return "rerun_only";
  if (proposedPatchPlans.length > 0 || categories.some((category) => deterministicPatchCategories.has(category))) return "patch_needed";
  return "draft";
}

export function createCiRepairPlan(input: CreateCiRepairPlanInput): CiRepairPlan {
  const proposedPatchPlans = input.proposed_patch_plans ?? [];
  const evidenceRefs = input.evidence_refs ?? input.ci_summary.evidence_refs;
  const receiptRefs = input.receipt_refs ?? [];
  const rerun = evaluateRerunEligibility({
    ci_summary: input.ci_summary,
    proposed_patch_plans: proposedPatchPlans,
    evidence_refs: evidenceRefs,
    receipt_refs: receiptRefs
  });
  const categories = input.ci_summary.detected_failure_categories;
  return CiRepairPlanSchema.parse({
    schema_version: CodeOpsSchemaVersion.CiRepairPlan,
    repair_plan_id: input.repair_plan_id,
    mission_id: input.mission_id,
    task_id: input.task_id,
    ci_summary_ref: input.ci_summary_ref,
    failure_categories: categories,
    suspected_files: input.suspected_files ?? [],
    proposed_patch_plans: proposedPatchPlans,
    verification_commands: input.verification_commands ?? proposedPatchPlans.flatMap((plan) => plan.verification_plan.commands),
    rerun_eligibility: rerun,
    non_retryable_reasons: rerun.eligible ? [] : rerun.reason_codes,
    risk_tier: categories.includes("secret_guard_failure") || proposedPatchPlans.some((plan) => plan.risk_tier === "high") ? "high" : "medium",
    status: statusForRepairPlan(categories, rerun, proposedPatchPlans),
    evidence_refs: evidenceRefs,
    receipt_refs: receiptRefs
  });
}

export function summarizeRepairPlan(plan: CiRepairPlan): string {
  return `${plan.repair_plan_id} status=${plan.status} rerun=${plan.rerun_eligibility.mode} categories=${plan.failure_categories.join("|")}`;
}
