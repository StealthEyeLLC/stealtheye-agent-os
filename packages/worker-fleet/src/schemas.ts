import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CapabilityTokenSchema, GuardDecisionSchema, RequestedActionSchema, RegistryTrustSummarySchema } from "@stealtheye/guard";

export const WorkerFleetSchemaVersion = {
  WorkerTask: "worker-task.v1",
  WorkerLease: "worker-lease.v1",
  IdempotencyRecord: "worker-idempotency-record.v1",
  RetryPolicy: "worker-retry-policy.v1",
  RetryState: "worker-retry-state.v1",
  ArtifactReference: "worker-artifact-reference.v1",
  WorkerReceiptEvent: "worker-receipt-event.v1"
} as const;

export const WorkerTaskStatusSchema = z.enum([
  "queued",
  "leased",
  "running",
  "waiting",
  "blocked",
  "completed",
  "failed",
  "retry_scheduled",
  "canceled"
]);

export const WorkerTaskTypeSchema = z.enum([
  "mission_step",
  "guard_preflight",
  "registry_check",
  "receipt_write",
  "status_update",
  "app_host_preview",
  "future_codeops",
  "future_browserops",
  "future_ci_repair"
]);

export const WorkerPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);
export const WorkerLeaseStatusSchema = z.enum(["active", "expired", "released", "stolen", "completed"]);
export const IdempotencyStatusSchema = z.enum(["first_seen", "in_progress", "completed", "failed", "collision"]);
export const RetryBackoffStrategySchema = z.enum(["fixed", "linear", "exponential"]);
export const ArtifactSensitivitySchema = z.enum(["public", "internal", "confidential", "restricted"]);
export const ArtifactKindSchema = z.enum(["log", "diff", "receipt", "status_snapshot", "guard_decision", "preview", "test_output", "other"]);
export const WorkerReceiptEventTypeSchema = z.enum([
  "task_queued",
  "task_leased",
  "task_started",
  "guard_preflight_checked",
  "task_blocked",
  "task_completed",
  "task_failed",
  "retry_scheduled",
  "task_canceled",
  "artifact_recorded",
  "receipt_recorded"
]);

export const WorkerErrorSummarySchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  retryable: z.boolean().default(false),
  evidence_refs: z.array(z.string()).default([])
});

export const RetryPolicySchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.RetryPolicy),
  max_attempts: z.number().int().positive(),
  backoff_strategy: RetryBackoffStrategySchema,
  base_delay_ms: z.number().int().nonnegative(),
  max_delay_ms: z.number().int().nonnegative(),
  jitter: z.boolean().default(false),
  retryable_reason_codes: z.array(z.string()).default([]),
  non_retryable_reason_codes: z.array(z.string()).default([])
});

export const RetryStateSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.RetryState),
  max_attempts: z.number().int().positive(),
  current_attempt: z.number().int().nonnegative(),
  backoff_strategy: RetryBackoffStrategySchema,
  base_delay_ms: z.number().int().nonnegative(),
  max_delay_ms: z.number().int().nonnegative(),
  jitter: z.boolean().default(false),
  retryable_reason_codes: z.array(z.string()).default([]),
  non_retryable_reason_codes: z.array(z.string()).default([]),
  next_retry_at: z.string().datetime().optional(),
  exhausted: z.boolean().default(false)
});

export const WorkerLeaseSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.WorkerLease),
  lease_id: z.string().min(1),
  task_id: z.string().min(1),
  worker_id: z.string().min(1),
  acquired_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  heartbeat_at: z.string().datetime(),
  lease_status: WorkerLeaseStatusSchema,
  attempt: z.number().int().positive(),
  fencing_token: z.number().int().nonnegative(),
  evidence_refs: z.array(z.string()).default([])
});

export const WorkerArtifactReferenceSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.ArtifactReference),
  artifact_id: z.string().min(1),
  task_id: z.string().min(1),
  mission_id: z.string().min(1),
  kind: ArtifactKindSchema,
  uri: z.string().min(1),
  digest: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
  summary: z.string().min(1),
  created_at: z.string().datetime(),
  sensitivity: ArtifactSensitivitySchema,
  retention_hint: z.string().min(1)
});

export const WorkerTaskSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.WorkerTask),
  task_id: z.string().min(1),
  mission_id: z.string().min(1),
  plan_id: z.string().min(1),
  step_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  task_type: WorkerTaskTypeSchema,
  priority: WorkerPrioritySchema,
  status: WorkerTaskStatusSchema,
  requested_action: RequestedActionSchema.optional(),
  capability_token_refs: z.array(z.string()).default([]),
  guard_decision_ref: z.string().optional(),
  idempotency_key: z.string().min(1),
  retry_policy: RetryPolicySchema,
  retry_state: RetryStateSchema.optional(),
  lease: WorkerLeaseSchema.optional(),
  dependencies: z.array(z.string()).default([]),
  artifact_refs: z.array(WorkerArtifactReferenceSchema).default([]),
  receipt_refs: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  queued_at: z.string().datetime(),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  failed_at: z.string().datetime().optional(),
  blocked_reason: z.string().optional(),
  error_summary: WorkerErrorSummarySchema.optional()
});

export const IdempotencyRecordSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.IdempotencyRecord),
  idempotency_key: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  action_fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  status: IdempotencyStatusSchema,
  first_seen_at: z.string().datetime(),
  last_seen_at: z.string().datetime(),
  result_ref: z.string().optional(),
  collision: z.boolean().default(false),
  collision_summary: z.string().optional()
});

export const WorkerReceiptEventSchema = z.object({
  schema_version: z.literal(WorkerFleetSchemaVersion.WorkerReceiptEvent),
  event_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  worker_id: z.string().min(1),
  event_type: WorkerReceiptEventTypeSchema,
  status_before: WorkerTaskStatusSchema.optional(),
  status_after: WorkerTaskStatusSchema.optional(),
  guard_decision_ref: z.string().optional(),
  idempotency_key: z.string().optional(),
  lease_id: z.string().optional(),
  artifact_refs: z.array(WorkerArtifactReferenceSchema).default([]),
  timestamp: z.string().datetime(),
  evidence_refs: z.array(z.string()).default([]),
  summary: z.string().min(1)
});

export const WorkerPreflightResultSchema = z.object({
  outcome: z.enum(["allow", "block", "escalate"]),
  guard_decision: GuardDecisionSchema,
  receipt_event: WorkerReceiptEventSchema,
  updated_task_status_suggestion: WorkerTaskStatusSchema
});

export type WorkerTaskStatus = z.infer<typeof WorkerTaskStatusSchema>;
export type WorkerTaskType = z.infer<typeof WorkerTaskTypeSchema>;
export type WorkerPriority = z.infer<typeof WorkerPrioritySchema>;
export type WorkerLeaseStatus = z.infer<typeof WorkerLeaseStatusSchema>;
export type RetryBackoffStrategy = z.infer<typeof RetryBackoffStrategySchema>;
export type RetryPolicy = z.infer<typeof RetryPolicySchema>;
export type RetryState = z.infer<typeof RetryStateSchema>;
export type WorkerLease = z.infer<typeof WorkerLeaseSchema>;
export type WorkerArtifactReference = z.infer<typeof WorkerArtifactReferenceSchema>;
export type WorkerTask = z.infer<typeof WorkerTaskSchema>;
export type IdempotencyRecord = z.infer<typeof IdempotencyRecordSchema>;
export type WorkerReceiptEvent = z.infer<typeof WorkerReceiptEventSchema>;
export type WorkerReceiptEventType = z.infer<typeof WorkerReceiptEventTypeSchema>;
export type WorkerPreflightResult = z.infer<typeof WorkerPreflightResultSchema>;
export type WorkerCapabilityToken = z.infer<typeof CapabilityTokenSchema>;
export type WorkerRegistryTrustSummary = z.infer<typeof RegistryTrustSummarySchema>;

export const WorkerFleetJsonSchemas = {
  workerTask: zodToJsonSchema(WorkerTaskSchema, "WorkerTask"),
  workerLease: zodToJsonSchema(WorkerLeaseSchema, "WorkerLease"),
  idempotencyRecord: zodToJsonSchema(IdempotencyRecordSchema, "IdempotencyRecord"),
  retryPolicy: zodToJsonSchema(RetryPolicySchema, "RetryPolicy"),
  retryState: zodToJsonSchema(RetryStateSchema, "RetryState"),
  artifactReference: zodToJsonSchema(WorkerArtifactReferenceSchema, "WorkerArtifactReference"),
  workerReceiptEvent: zodToJsonSchema(WorkerReceiptEventSchema, "WorkerReceiptEvent")
};
