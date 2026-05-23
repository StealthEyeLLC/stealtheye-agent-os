import { WorkerFleetSchemaVersion, WorkerReceiptEventSchema, type WorkerReceiptEvent, type WorkerTask, type WorkerTaskStatus } from "./schemas";

export interface CreateWorkerReceiptEventInput {
  task: WorkerTask;
  worker_id: string;
  event_type: WorkerReceiptEvent["event_type"];
  timestamp: string;
  status_before?: WorkerTaskStatus;
  status_after?: WorkerTaskStatus;
  summary: string;
  evidence_refs?: string[];
}

export function createWorkerReceiptEvent(input: CreateWorkerReceiptEventInput): WorkerReceiptEvent {
  return WorkerReceiptEventSchema.parse({
    schema_version: WorkerFleetSchemaVersion.WorkerReceiptEvent,
    event_id: `worker-event:${input.task.task_id}:${input.event_type}:${new Date(input.timestamp).getTime()}`,
    mission_id: input.task.mission_id,
    task_id: input.task.task_id,
    worker_id: input.worker_id,
    event_type: input.event_type,
    status_before: input.status_before,
    status_after: input.status_after,
    guard_decision_ref: input.task.guard_decision_ref,
    idempotency_key: input.task.idempotency_key,
    lease_id: input.task.lease?.lease_id,
    artifact_refs: input.task.artifact_refs,
    timestamp: input.timestamp,
    evidence_refs: input.evidence_refs ?? [],
    summary: input.summary
  });
}
