import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const ReceiptsReplaySchemaVersion = {
  EvidenceRef: "receipts-replay-evidence-ref.v1",
  ReceiptEvent: "receipts-replay-event.v1",
  ReceiptBundle: "receipts-replay-bundle.v1",
  MissionTimeline: "receipts-replay-timeline.v1",
  ReplayStep: "receipts-replay-step.v1",
  ReplayPacket: "receipts-replay-packet.v1",
  VerificationPacket: "receipts-replay-verification-packet.v1",
  FinalReportPacket: "receipts-replay-final-report-packet.v1"
} as const;

export const DigestRefSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const SensitivitySchema = z.enum(["public", "internal", "confidential", "restricted"]);
export const PublicPrivateBoundarySchema = z.enum(["public_safe", "internal_reference", "redacted", "private_reference_placeholder"]);

export const PublicSafeReceiptUriSchema = z.string().min(1).refine((uri) => {
  const normalized = uri.toLowerCase();
  return normalized.startsWith("receipt://fixture/")
    || normalized.startsWith("artifact://fixture/")
    || normalized.startsWith("docs://generated/")
    || normalized.startsWith("test://");
}, "Receipt evidence must use public-safe fixture or generated-document URIs only.");

export const SourceSubsystemSchema = z.enum([
  "mission_os",
  "agent_registry",
  "guard",
  "worker_fleet",
  "app_host",
  "codeops",
  "ci_repair",
  "browserops",
  "build_automation",
  "workflow_compiler_future",
  "tool_router_future",
  "domain_apps_future"
]);

export const ReceiptEventTypeSchema = z.enum([
  "mission_created",
  "mission_compiled",
  "authority_envelope_created",
  "capability_token_created",
  "agent_card_verified",
  "tool_manifest_verified",
  "guard_decision_created",
  "worker_task_queued",
  "worker_task_leased",
  "worker_task_started",
  "worker_task_completed",
  "worker_task_failed",
  "worker_retry_scheduled",
  "app_host_tool_previewed",
  "codeops_patch_plan_created",
  "ci_summary_recorded",
  "ci_repair_plan_created",
  "browser_session_planned",
  "browser_page_observed",
  "browser_action_plan_created",
  "browser_preflight_checked",
  "build_state_generated",
  "artifact_recorded",
  "verification_recorded",
  "final_report_created",
  "denial_recorded",
  "escalation_recorded"
]);

export const EvidenceKindSchema = z.enum([
  "text_summary",
  "json_document",
  "manifest_digest",
  "guard_decision",
  "worker_fleet_event",
  "codeops_patch_plan",
  "ci_log_excerpt",
  "pr_evidence_packet",
  "browser_screenshot_ref",
  "browser_dom_snapshot_ref",
  "browser_console_network_refs",
  "generated_build_state_file",
  "final_report_packet",
  "artifact_digest"
]);

export const ReceiptBundleStatusSchema = z.enum(["draft", "collecting", "complete", "replayable", "incomplete", "invalid", "redacted"]);
export const VerificationCheckStatusSchema = z.enum(["passed", "failed", "warning", "skipped", "not_applicable"]);
export const VerificationPacketStatusSchema = z.enum(["passed", "failed", "warning", "incomplete"]);
export const FinalReportOutcomeSchema = z.enum(["completed", "partially_completed", "blocked", "failed", "canceled"]);

export const EvidenceRefSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.EvidenceRef),
  evidence_id: z.string().min(1),
  kind: EvidenceKindSchema,
  uri: PublicSafeReceiptUriSchema,
  digest: DigestRefSchema.optional(),
  summary: z.string().min(1),
  produced_by: SourceSubsystemSchema,
  produced_at: z.string().datetime(),
  sensitivity: SensitivitySchema,
  public_safe: z.boolean(),
  retention_hint: z.string().min(1),
  related_event_ids: z.array(z.string().min(1)).default([])
});

export const ReceiptEventSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.ReceiptEvent),
  event_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1).optional(),
  source_subsystem: SourceSubsystemSchema,
  event_type: ReceiptEventTypeSchema,
  actor_id: z.string().min(1),
  subject_id: z.string().min(1),
  action_id: z.string().min(1).optional(),
  timestamp: z.string().datetime(),
  status_before: z.string().min(1).nullable(),
  status_after: z.string().min(1).nullable(),
  summary: z.string().min(1),
  reason_codes: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(z.string().min(1)).default([]),
  artifact_refs: z.array(z.string().min(1)).default([]),
  receipt_refs: z.array(z.string().min(1)).default([]),
  related_event_ids: z.array(z.string().min(1)).default([]),
  public_private_boundary: PublicPrivateBoundarySchema,
  sensitivity: SensitivitySchema,
  retention_hint: z.string().min(1)
});

export const ReceiptBundleSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.ReceiptBundle),
  bundle_id: z.string().min(1),
  mission_id: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  events: z.array(ReceiptEventSchema).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  artifact_refs: z.array(z.string().min(1)).default([]),
  guard_decision_refs: z.array(z.string().min(1)).default([]),
  registry_decision_refs: z.array(z.string().min(1)).default([]),
  worker_task_refs: z.array(z.string().min(1)).default([]),
  codeops_refs: z.array(z.string().min(1)).default([]),
  ci_refs: z.array(z.string().min(1)).default([]),
  browser_refs: z.array(z.string().min(1)).default([]),
  generated_state_refs: z.array(z.string().min(1)).default([]),
  final_report_ref: z.string().min(1).nullable(),
  integrity_digest: DigestRefSchema.optional(),
  public_private_boundary: PublicPrivateBoundarySchema,
  sensitivity: SensitivitySchema,
  status: ReceiptBundleStatusSchema
});

export const TimelineEntrySchema = z.object({
  event_id: z.string().min(1),
  timestamp: z.string().datetime(),
  source_subsystem: SourceSubsystemSchema,
  event_type: ReceiptEventTypeSchema,
  summary: z.string().min(1),
  status_after: z.string().min(1).nullable(),
  evidence_refs: z.array(z.string()).default([])
});

export const MissionTimelineSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.MissionTimeline),
  mission_id: z.string().min(1),
  event_order: z.array(z.string().min(1)).default([]),
  entries: z.array(TimelineEntrySchema).default([]),
  missing_required_event_types: z.array(ReceiptEventTypeSchema).default([]),
  denial_count: z.number().int().nonnegative(),
  escalation_count: z.number().int().nonnegative(),
  public_safe_summary: z.string().min(1)
});

export const ReplayStepSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.ReplayStep),
  step_id: z.string().min(1),
  event_id: z.string().min(1),
  subsystem: SourceSubsystemSchema,
  summary: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).default([]),
  expected_state: z.string().min(1),
  public_safe: z.boolean(),
  replayable_without_side_effects: z.boolean()
});

export const ReplayPacketSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.ReplayPacket),
  replay_packet_id: z.string().min(1),
  mission_id: z.string().min(1),
  receipt_bundle_id: z.string().min(1),
  event_order: z.array(z.string().min(1)).default([]),
  evidence_index: z.record(EvidenceRefSchema).default({}),
  artifact_index: z.record(z.string()).default({}),
  replay_steps: z.array(ReplayStepSchema).default([]),
  omitted_sensitive_refs: z.array(z.string().min(1)).default([]),
  verification_summary: z.string().min(1),
  created_at: z.string().datetime()
});

export const VerificationCheckSchema = z.object({
  check_id: z.string().min(1),
  name: z.string().min(1),
  status: VerificationCheckStatusSchema,
  summary: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).default([])
});

export const VerificationPacketSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.VerificationPacket),
  verification_packet_id: z.string().min(1),
  mission_id: z.string().min(1),
  receipt_bundle_id: z.string().min(1),
  checks: z.array(VerificationCheckSchema).default([]),
  ci_run_refs: z.array(z.string().min(1)).default([]),
  test_refs: z.array(z.string().min(1)).default([]),
  generated_state_refs: z.array(z.string().min(1)).default([]),
  policy_checks: z.array(VerificationCheckSchema).default([]),
  failures: z.array(z.string().min(1)).default([]),
  warnings: z.array(z.string().min(1)).default([]),
  status: VerificationPacketStatusSchema,
  created_at: z.string().datetime()
});

export const FinalReportPacketSchema = z.object({
  schema_version: z.literal(ReceiptsReplaySchemaVersion.FinalReportPacket),
  final_report_id: z.string().min(1),
  mission_id: z.string().min(1),
  receipt_bundle_id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  outcome: FinalReportOutcomeSchema,
  completed_work: z.array(z.string().min(1)).default([]),
  verification_summary: z.string().min(1),
  evidence_summary: z.string().min(1),
  denials_escalations: z.array(z.string().min(1)).default([]),
  known_gaps: z.array(z.string().min(1)).default([]),
  next_recommended_actions: z.array(z.string().min(1)).default([]),
  public_private_boundary: PublicPrivateBoundarySchema,
  created_at: z.string().datetime()
});

export type SourceSubsystem = z.infer<typeof SourceSubsystemSchema>;
export type ReceiptEventType = z.infer<typeof ReceiptEventTypeSchema>;
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
export type ReceiptEvent = z.infer<typeof ReceiptEventSchema>;
export type EvidenceRef = z.infer<typeof EvidenceRefSchema>;
export type ReceiptBundle = z.infer<typeof ReceiptBundleSchema>;
export type MissionTimeline = z.infer<typeof MissionTimelineSchema>;
export type ReplayPacket = z.infer<typeof ReplayPacketSchema>;
export type ReplayStep = z.infer<typeof ReplayStepSchema>;
export type VerificationCheck = z.infer<typeof VerificationCheckSchema>;
export type VerificationPacket = z.infer<typeof VerificationPacketSchema>;
export type FinalReportPacket = z.infer<typeof FinalReportPacketSchema>;

export const ReceiptsReplayJsonSchemas = {
  evidenceRef: zodToJsonSchema(EvidenceRefSchema, "EvidenceRef"),
  receiptEvent: zodToJsonSchema(ReceiptEventSchema, "ReceiptEvent"),
  receiptBundle: zodToJsonSchema(ReceiptBundleSchema, "ReceiptBundle"),
  missionTimeline: zodToJsonSchema(MissionTimelineSchema, "MissionTimeline"),
  replayPacket: zodToJsonSchema(ReplayPacketSchema, "ReplayPacket"),
  verificationPacket: zodToJsonSchema(VerificationPacketSchema, "VerificationPacket"),
  finalReportPacket: zodToJsonSchema(FinalReportPacketSchema, "FinalReportPacket")
};
