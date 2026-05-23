import { evaluateGuardDecision, GuardSchemaVersion, type CapabilityToken, type GuardDecision, type RegistryTrustInput, type RequestedAction } from "@stealtheye/guard";
import { createWorkerTask, runGuardPreflight, type WorkerTask } from "@stealtheye/worker-fleet";
import { allPatchPlanFileChanges, assessFileChangeRisks } from "./file-changes";
import { branchSafeOperationSummary, isProtectedBranch } from "./repo-targets";
import { CodeOpsPreflightSummarySchema, CodeOpsSchemaVersion, type CodeOpsPreflightSummary, type PatchPlan } from "./schemas";

export interface CodeOpsActionOptions {
  actor_id?: string | undefined;
  agent_id?: string | undefined;
  manifest_id?: string | undefined;
  requested_at?: string | undefined;
}

interface NormalizedCodeOpsActionOptions {
  actor_id: string;
  agent_id: string;
  manifest_id: string;
  requested_at: string;
}

function targetAccount(repoFullName: string): string {
  return repoFullName.split("/")[0] ?? "unknown";
}

function requestedAction(plan: PatchPlan, actionIdSuffix: string, effect: RequestedAction["effect"], options: NormalizedCodeOpsActionOptions, path?: string): RequestedAction {
  return {
    schema_version: GuardSchemaVersion.RequestedAction,
    action_id: `codeops-action:${plan.patch_plan_id}:${actionIdSuffix}`,
    mission_id: plan.mission_id,
    actor_id: options.actor_id,
    subject_type: "agent",
    effect,
    target: {
      repo: plan.repo_target.repo_full_name,
      branch: plan.repo_target.working_branch,
      ...(path ? { path } : {}),
      system: "github",
      environment: "development",
      account: targetAccount(plan.repo_target.repo_full_name)
    },
    agent_id: options.agent_id,
    manifest_id: options.manifest_id,
    risk_indicators: allPatchPlanFileChanges(plan).flatMap((change) => change.risk_indicators),
    side_effects: effect === "read_repo" || effect === "read_ci" ? [] : ["future_live_action_modeled_only"],
    requested_at: options.requested_at,
    idempotency_key: `idem:${plan.patch_plan_id}:${actionIdSuffix}`,
    metadata: {
      patch_plan_id: plan.patch_plan_id,
      task_id: plan.task_id,
      foundation_only: true
    },
    evidence_refs: plan.evidence_refs
  };
}

function normalizeOptions(options: CodeOpsActionOptions = {}): NormalizedCodeOpsActionOptions {
  return {
    actor_id: options.actor_id ?? "agent:codeops-fixture",
    agent_id: options.agent_id ?? "agent:codeops-fixture",
    manifest_id: options.manifest_id ?? "tool-manifest:codeops-fixture",
    requested_at: options.requested_at ?? "2026-01-01T00:00:00.000Z"
  };
}

export function requestedActionsForPatchPlan(plan: PatchPlan, options: CodeOpsActionOptions = {}): RequestedAction[] {
  const normalized = normalizeOptions(options);
  const changed = allPatchPlanFileChanges(plan).filter((change) => change.operation !== "read");
  const actions: RequestedAction[] = [requestedAction(plan, "read-repo", "read_repo", normalized)];

  for (const change of changed) actions.push(requestedAction(plan, `write-branch-files:${change.path}`, "write_branch_files", normalized, change.path));
  if (changed.length > 0) actions.push(requestedAction(plan, "commit-branch", "commit_branch", normalized));
  actions.push(requestedAction(plan, "open-pr", "open_pr", normalized));
  actions.push(requestedAction(plan, "read-ci", "read_ci", normalized));
  if (plan.expected_effects.includes("rerun_failed_jobs")) actions.push(requestedAction(plan, "rerun-failed-jobs", "rerun_failed_jobs", normalized));
  actions.push(requestedAction(plan, "write-receipt", "write_receipt", normalized));

  const branchSummary = branchSafeOperationSummary(plan.repo_target, changed.map((change) => change.path));
  if (branchSummary.direct_protected_branch_mutation_denied || isProtectedBranch(plan.repo_target.working_branch, plan.repo_target)) actions.push(requestedAction(plan, "protected-branch-mutation", "protected_branch_mutation", normalized));
  if (branchSummary.history_rewrite_denied || plan.expected_effects.includes("force_push")) actions.push(requestedAction(plan, "force-push", "force_push", normalized));

  const riskFindings = assessFileChangeRisks(plan);
  if (riskFindings.some((finding) => finding.check_id === "ci_test_weakening_indicators" && finding.matched)) actions.push(requestedAction(plan, "weaken-ci", "weaken_ci", normalized));
  if (riskFindings.some((finding) => finding.check_id === "forbidden_delete_operations" && finding.matched)) actions.push(requestedAction(plan, "destructive-delete", "destructive_delete", normalized));

  return actions;
}

export function workerTasksForPatchPlan(plan: PatchPlan, options: CodeOpsActionOptions = {}): WorkerTask[] {
  const normalized = normalizeOptions(options);
  return requestedActionsForPatchPlan(plan, normalized).map((action, index) => createWorkerTask({
    mission_id: plan.mission_id,
    plan_id: plan.patch_plan_id,
    step_id: `codeops-step-${String(index + 1).padStart(2, "0")}`,
    title: `CodeOps ${action.effect}`,
    description: `Foundation-only worker task template for ${action.effect}. It does not execute live GitHub mutation.`,
    task_type: action.effect === "read_ci" || action.effect === "rerun_failed_jobs" ? "future_ci_repair" : "future_codeops",
    priority: plan.risk_tier === "high" ? "high" : "normal",
    requested_action: action,
    capability_token_refs: plan.repo_target.capability_token_refs,
    receipt_refs: plan.receipt_refs,
    now: normalized.requested_at
  }));
}

export interface RunCodeOpsPreflightInput {
  patch_plan: PatchPlan;
  capability_tokens: CapabilityToken[];
  registry_trust_summary?: RegistryTrustInput | undefined;
  worker_id?: string | undefined;
  options?: CodeOpsActionOptions | undefined;
}

export function guardDecisionsForPatchPlan(input: RunCodeOpsPreflightInput): GuardDecision[] {
  const normalized = normalizeOptions(input.options);
  return requestedActionsForPatchPlan(input.patch_plan, normalized).map((action) => evaluateGuardDecision(action, input.capability_tokens, {
    now: new Date(normalized.requested_at),
    ...(input.registry_trust_summary ? { registryTrust: input.registry_trust_summary } : {}),
    decisionId: `guard-decision:${action.action_id}`
  }));
}

export function runCodeOpsPreflight(input: RunCodeOpsPreflightInput): CodeOpsPreflightSummary {
  const normalized = normalizeOptions(input.options);
  const tasks = workerTasksForPatchPlan(input.patch_plan, normalized);
  const results = tasks.map((task) => runGuardPreflight({
    task,
    capability_tokens: input.capability_tokens,
    ...(input.registry_trust_summary ? { registry_trust_summary: input.registry_trust_summary } : {}),
    worker_id: input.worker_id ?? "worker:codeops-preflight-fixture",
    now: new Date(normalized.requested_at)
  }));
  const reasonCodes = [...new Set(results.flatMap((result) => result.guard_decision.reason_codes))].sort();
  return CodeOpsPreflightSummarySchema.parse({
    schema_version: CodeOpsSchemaVersion.PreflightSummary,
    preflight_id: `codeops-preflight:${input.patch_plan.patch_plan_id}`,
    patch_plan_id: input.patch_plan.patch_plan_id,
    mission_id: input.patch_plan.mission_id,
    allowed: results.every((result) => result.outcome === "allow"),
    blocked: results.some((result) => result.outcome === "block"),
    escalated: results.some((result) => result.outcome === "escalate"),
    reason_codes: reasonCodes,
    guard_decision_refs: results.map((result) => result.guard_decision.decision_id).sort(),
    worker_task_refs: tasks.map((task) => task.task_id).sort(),
    evidence_refs: [...new Set(results.flatMap((result) => result.guard_decision.evidence_required))].sort(),
    receipt_refs: [...new Set([...input.patch_plan.receipt_refs, ...results.map((result) => result.receipt_event.event_id)])].sort(),
    created_at: normalized.requested_at
  });
}
