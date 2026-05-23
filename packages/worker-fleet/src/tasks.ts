import { requestedActionFromPlanStep, type Mission, type MissionPlan, type MissionPlanStep } from "@stealtheye/mission-os";
import { WorkerFleetSchemaVersion, WorkerTaskSchema, type RetryPolicy, type WorkerPriority, type WorkerTask, type WorkerTaskType } from "./schemas";
import { createRetryState, defaultRetryPolicy } from "./retry-policy";

export interface CreateWorkerTaskInput {
  mission_id: string;
  plan_id: string;
  step_id: string;
  title: string;
  description: string;
  task_type?: WorkerTaskType | undefined;
  priority?: WorkerPriority | undefined;
  requested_action?: WorkerTask["requested_action"] | undefined;
  capability_token_refs?: string[] | undefined;
  dependencies?: string[] | undefined;
  receipt_refs?: string[] | undefined;
  retry_policy?: RetryPolicy | undefined;
  now: string;
}

export function createWorkerTask(input: CreateWorkerTaskInput): WorkerTask {
  const retryPolicy = input.retry_policy ?? defaultRetryPolicy;
  const taskId = `worker-task:${input.mission_id}:${input.step_id}`;
  return WorkerTaskSchema.parse({
    schema_version: WorkerFleetSchemaVersion.WorkerTask,
    task_id: taskId,
    mission_id: input.mission_id,
    plan_id: input.plan_id,
    step_id: input.step_id,
    title: input.title,
    description: input.description,
    task_type: input.task_type ?? "mission_step",
    priority: input.priority ?? "normal",
    status: "queued",
    ...(input.requested_action ? { requested_action: input.requested_action } : {}),
    capability_token_refs: input.capability_token_refs ?? [],
    idempotency_key: input.requested_action?.idempotency_key ?? `idem:${input.mission_id}:${input.step_id}`,
    retry_policy: retryPolicy,
    retry_state: createRetryState(retryPolicy),
    dependencies: input.dependencies ?? [],
    artifact_refs: [],
    receipt_refs: input.receipt_refs ?? [],
    created_at: input.now,
    updated_at: input.now,
    queued_at: input.now
  });
}

export interface WorkerTasksFromMissionPlanOptions {
  mission: Mission;
  plan: MissionPlan;
  actor_id?: string | undefined;
  capability_token_refs?: string[] | undefined;
  now?: string | undefined;
  retry_policy?: RetryPolicy | undefined;
}

export function workerTaskFromPlanStep(step: MissionPlanStep, options: WorkerTasksFromMissionPlanOptions): WorkerTask {
  const actorId = options.actor_id ?? "worker-fleet:mission-plan-converter";
  const effect = step.expected_effects[0];
  const requestedAction = effect ? requestedActionFromPlanStep(options.mission, step, actorId, effect) : undefined;
  return createWorkerTask({
    mission_id: options.plan.mission_id,
    plan_id: options.plan.plan_id,
    step_id: step.step_id,
    title: step.title,
    description: step.description,
    task_type: "mission_step",
    priority: options.mission.priority,
    ...(requestedAction ? { requested_action: requestedAction } : {}),
    capability_token_refs: options.capability_token_refs ?? [options.mission.authority_envelope_ref ?? `authority-envelope:${options.mission.mission_id}`],
    dependencies: step.depends_on.map((dependency) => `worker-task:${options.plan.mission_id}:${dependency}`),
    receipt_refs: step.receipt_refs,
    ...(options.retry_policy ? { retry_policy: options.retry_policy } : {}),
    now: options.now ?? options.plan.created_at
  });
}

export function workerTasksFromMissionPlan(options: WorkerTasksFromMissionPlanOptions): WorkerTask[] {
  return options.plan.steps.map((step) => workerTaskFromPlanStep(step, options));
}
