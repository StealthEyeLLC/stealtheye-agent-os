import { evaluateGuardDecision, type CapabilityToken, type RegistryTrustInput } from "@stealtheye/guard";
import { createWorkerReceiptEvent } from "./receipts";
import { WorkerPreflightResultSchema, type WorkerPreflightResult, type WorkerTask } from "./schemas";

const authorityRequiredTaskTypes = new Set<WorkerTask["task_type"]>([
  "mission_step",
  "future_codeops",
  "future_browserops",
  "future_ci_repair"
]);

export function taskRequiresGuardPreflight(task: WorkerTask): boolean {
  return authorityRequiredTaskTypes.has(task.task_type) && Boolean(task.requested_action);
}

export interface GuardPreflightInput {
  task: WorkerTask;
  capability_tokens: CapabilityToken[];
  registry_trust_summary?: RegistryTrustInput;
  worker_id: string;
  now?: Date;
}

export function runGuardPreflight(input: GuardPreflightInput): WorkerPreflightResult {
  if (taskRequiresGuardPreflight(input.task) && !input.task.requested_action) throw new Error(`task requires requested_action for Guard preflight: ${input.task.task_id}`);
  if (!input.task.requested_action) throw new Error(`no requested_action available for Guard preflight: ${input.task.task_id}`);
  const now = input.now ?? new Date();
  const guardDecision = evaluateGuardDecision(input.task.requested_action, input.capability_tokens, {
    now,
    registryTrust: input.registry_trust_summary,
    decisionId: `guard-decision:${input.task.task_id}`
  });
  const outcome = guardDecision.decision === "allow" ? "allow" : guardDecision.decision === "escalate" ? "escalate" : "block";
  const updatedStatus = outcome === "allow" ? "leased" : outcome === "escalate" ? "waiting" : "blocked";
  return WorkerPreflightResultSchema.parse({
    outcome,
    guard_decision: guardDecision,
    receipt_event: createWorkerReceiptEvent({
      task: { ...input.task, guard_decision_ref: guardDecision.decision_id },
      worker_id: input.worker_id,
      event_type: outcome === "allow" ? "guard_preflight_checked" : "task_blocked",
      timestamp: now.toISOString(),
      status_before: input.task.status,
      status_after: updatedStatus,
      summary: guardDecision.summary,
      evidence_refs: guardDecision.evidence_required
    }),
    updated_task_status_suggestion: updatedStatus
  });
}
