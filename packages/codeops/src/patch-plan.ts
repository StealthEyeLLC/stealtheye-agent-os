import { allPatchPlanFileChanges, assessFileChangeRisks, computePatchPlanFingerprint, summarizeFileChanges } from "./file-changes";
import { branchSafeOperationSummary } from "./repo-targets";
import type { FileChangeContract, PatchPlan } from "./schemas";
import { verificationPlanSatisfiedForPatchPlan } from "./verification-plan";

export interface PatchPlanSafetySummary {
  allowed_for_preflight: boolean;
  blocked: boolean;
  escalated: boolean;
  fingerprint: string;
  reason_codes: string[];
  summary: string;
}

export function patchPlanCandidatePaths(plan: PatchPlan): string[] {
  return [...new Set(allPatchPlanFileChanges(plan).map((change) => change.path))].sort();
}

export function patchPlanRiskIndicators(plan: PatchPlan): string[] {
  return [...new Set(allPatchPlanFileChanges(plan).flatMap((change) => change.risk_indicators))].sort();
}

export function safeDeleteRepresentation(change: FileChangeContract): FileChangeContract {
  if (change.operation !== "delete") return change;
  return {
    ...change,
    operation: "update",
    summary: `Safe deprecation placeholder for blocked delete: ${change.summary}`,
    risk_indicators: [...new Set([...change.risk_indicators, "destructive delete represented but not performed"])].sort()
  };
}

export function destructiveDeletesBlockedByDefault(plan: PatchPlan): boolean {
  return assessFileChangeRisks(plan).some((finding) => finding.check_id === "forbidden_delete_operations" && finding.matched);
}

export function evaluatePatchPlanSafety(plan: PatchPlan): PatchPlanSafetySummary {
  const fingerprint = computePatchPlanFingerprint(plan);
  const branchSummary = branchSafeOperationSummary(plan.repo_target, patchPlanCandidatePaths(plan), patchPlanRiskIndicators(plan));
  const changeFindings = assessFileChangeRisks(plan);
  const destructiveDelete = changeFindings.find((finding) => finding.check_id === "forbidden_delete_operations" && finding.matched);
  const weakening = changeFindings.find((finding) => finding.check_id === "ci_test_weakening_indicators" && finding.matched);
  const secretPaths = changeFindings.find((finding) => finding.check_id === "suspicious_secret_bearing_paths" && finding.matched);
  const verificationSatisfied = verificationPlanSatisfiedForPatchPlan(plan);

  const reasonCodes = [...new Set([
    ...branchSummary.reason_codes,
    ...changeFindings.flatMap((finding) => finding.reason_codes),
    ...(verificationSatisfied ? [] : ["verification_obligations_missing"])
  ])].sort();

  const blocked = !branchSummary.allowed || Boolean(weakening) || !verificationSatisfied;
  const escalated = Boolean(destructiveDelete || secretPaths) || plan.risk_tier === "high";
  const allowedForPreflight = !blocked && !escalated && plan.status === "ready_for_preflight";

  return {
    allowed_for_preflight: allowedForPreflight,
    blocked,
    escalated,
    fingerprint,
    reason_codes: reasonCodes,
    summary: allowedForPreflight
      ? `Patch plan is branch-safe for preflight (${summarizeFileChanges(allPatchPlanFileChanges(plan))}).`
      : `Patch plan requires block or escalation before branch work (${reasonCodes.join(", ") || "status_not_ready"}).`
  };
}

export function approvePatchPlanForBranchWork(plan: PatchPlan): PatchPlan {
  const safety = evaluatePatchPlanSafety(plan);
  if (!safety.allowed_for_preflight) {
    return {
      ...plan,
      status: safety.blocked ? "blocked" : "preflight_failed",
      evidence_refs: [...new Set([...plan.evidence_refs, safety.fingerprint])].sort()
    };
  }
  return {
    ...plan,
    status: "approved_for_branch_work",
    evidence_refs: [...new Set([...plan.evidence_refs, safety.fingerprint])].sort()
  };
}

export function patchPlanStatusSummary(plan: PatchPlan): string {
  const safety = evaluatePatchPlanSafety(plan);
  return `${plan.patch_plan_id} status=${plan.status} risk=${plan.risk_tier} fingerprint=${safety.fingerprint} allowed=${safety.allowed_for_preflight}`;
}
