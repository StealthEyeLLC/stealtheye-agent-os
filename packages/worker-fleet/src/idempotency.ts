import { createHash } from "node:crypto";
import { IdempotencyRecordSchema, WorkerFleetSchemaVersion, type IdempotencyRecord, type WorkerTask } from "./schemas";

function stableJson(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
}

export function sha256Digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

export function computeActionFingerprint(task: WorkerTask): string {
  const stableFields = {
    mission_id: task.mission_id,
    plan_id: task.plan_id,
    step_id: task.step_id,
    task_type: task.task_type,
    requested_action: task.requested_action ? {
      effect: task.requested_action.effect,
      target: task.requested_action.target,
      agent_id: task.requested_action.agent_id,
      manifest_id: task.requested_action.manifest_id,
      manifest_digest: task.requested_action.manifest_digest,
      side_effects: task.requested_action.side_effects
    } : undefined
  };
  return sha256Digest(stableJson(stableFields));
}

export function createIdempotencyRecord(task: WorkerTask, now: string): IdempotencyRecord {
  return IdempotencyRecordSchema.parse({
    schema_version: WorkerFleetSchemaVersion.IdempotencyRecord,
    idempotency_key: task.idempotency_key,
    mission_id: task.mission_id,
    task_id: task.task_id,
    action_fingerprint: computeActionFingerprint(task),
    status: "first_seen",
    first_seen_at: now,
    last_seen_at: now,
    collision: false
  });
}

export type IdempotencyDetection =
  | { kind: "new"; record: IdempotencyRecord }
  | { kind: "duplicate"; record: IdempotencyRecord; result_ref?: string }
  | { kind: "collision"; record: IdempotencyRecord; collision_summary: string };

export function detectIdempotency(existing: IdempotencyRecord | undefined, task: WorkerTask, now: string): IdempotencyDetection {
  if (!existing) return { kind: "new", record: createIdempotencyRecord(task, now) };
  const fingerprint = computeActionFingerprint(task);
  if (existing.action_fingerprint !== fingerprint) {
    return {
      kind: "collision",
      record: IdempotencyRecordSchema.parse({
        ...existing,
        status: "collision",
        last_seen_at: now,
        collision: true,
        collision_summary: `Idempotency key ${task.idempotency_key} reused for a different action fingerprint.`
      }),
      collision_summary: `Idempotency key ${task.idempotency_key} reused for a different action fingerprint.`
    };
  }
  const duplicateRecord = IdempotencyRecordSchema.parse({ ...existing, last_seen_at: now });
  if (existing.status === "completed" && existing.result_ref) return { kind: "duplicate", record: duplicateRecord, result_ref: existing.result_ref };
  return { kind: "duplicate", record: duplicateRecord };
}

export function completeIdempotencyRecord(record: IdempotencyRecord, resultRef: string, now: string): IdempotencyRecord {
  return IdempotencyRecordSchema.parse({ ...record, status: "completed", result_ref: resultRef, last_seen_at: now });
}
