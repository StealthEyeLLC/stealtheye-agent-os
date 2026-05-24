import type { GuardDecision } from "@stealtheye/guard";
import type { WorkerReceiptEvent } from "@stealtheye/worker-fleet";
import type { PrEvidencePacket } from "@stealtheye/codeops";
import type { BrowserPreflightSummary } from "@stealtheye/browserops";
import { ReceiptBundleSchema, ReceiptEventSchema, ReceiptsReplaySchemaVersion, type EvidenceRef, type ReceiptBundle, type ReceiptEvent, type ReceiptEventType, type Sensitivity, type SourceSubsystem } from "./schemas";

export interface CreateReceiptEventInput {
  event_id: string;
  mission_id: string;
  task_id?: string | undefined;
  source_subsystem: SourceSubsystem;
  event_type: ReceiptEventType;
  actor_id: string;
  subject_id: string;
  action_id?: string | undefined;
  timestamp?: string | undefined;
  status_before?: string | null | undefined;
  status_after?: string | null | undefined;
  summary: string;
  reason_codes?: string[] | undefined;
  evidence_refs?: string[] | undefined;
  artifact_refs?: string[] | undefined;
  receipt_refs?: string[] | undefined;
  related_event_ids?: string[] | undefined;
  sensitivity?: Sensitivity | undefined;
  retention_hint?: string | undefined;
}

export function createReceiptEvent(input: CreateReceiptEventInput): ReceiptEvent {
  return ReceiptEventSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.ReceiptEvent,
    event_id: input.event_id,
    mission_id: input.mission_id,
    ...(input.task_id ? { task_id: input.task_id } : {}),
    source_subsystem: input.source_subsystem,
    event_type: input.event_type,
    actor_id: input.actor_id,
    subject_id: input.subject_id,
    ...(input.action_id ? { action_id: input.action_id } : {}),
    timestamp: input.timestamp ?? "2026-01-01T00:00:00.000Z",
    status_before: input.status_before ?? null,
    status_after: input.status_after ?? null,
    summary: input.summary,
    reason_codes: input.reason_codes ?? [],
    evidence_refs: input.evidence_refs ?? [],
    artifact_refs: input.artifact_refs ?? [],
    receipt_refs: input.receipt_refs ?? [],
    related_event_ids: input.related_event_ids ?? [],
    public_private_boundary: "public_safe",
    sensitivity: input.sensitivity ?? "public",
    retention_hint: input.retention_hint ?? "retain with mission receipt bundle"
  });
}

export interface CreateReceiptBundleInput {
  bundle_id: string;
  mission_id: string;
  events: ReceiptEvent[];
  evidence_refs: EvidenceRef[];
  artifact_refs?: string[] | undefined;
  guard_decision_refs?: string[] | undefined;
  registry_decision_refs?: string[] | undefined;
  worker_task_refs?: string[] | undefined;
  codeops_refs?: string[] | undefined;
  ci_refs?: string[] | undefined;
  browser_refs?: string[] | undefined;
  generated_state_refs?: string[] | undefined;
  final_report_ref?: string | null | undefined;
  integrity_digest?: string | undefined;
  status?: ReceiptBundle["status"] | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
}

export function createReceiptBundle(input: CreateReceiptBundleInput): ReceiptBundle {
  return ReceiptBundleSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.ReceiptBundle,
    bundle_id: input.bundle_id,
    mission_id: input.mission_id,
    created_at: input.created_at ?? "2026-01-01T00:00:00.000Z",
    updated_at: input.updated_at ?? input.created_at ?? "2026-01-01T00:00:00.000Z",
    events: input.events,
    evidence_refs: input.evidence_refs,
    artifact_refs: input.artifact_refs ?? [],
    guard_decision_refs: input.guard_decision_refs ?? [],
    registry_decision_refs: input.registry_decision_refs ?? [],
    worker_task_refs: input.worker_task_refs ?? [],
    codeops_refs: input.codeops_refs ?? [],
    ci_refs: input.ci_refs ?? [],
    browser_refs: input.browser_refs ?? [],
    generated_state_refs: input.generated_state_refs ?? [],
    final_report_ref: input.final_report_ref ?? null,
    ...(input.integrity_digest ? { integrity_digest: input.integrity_digest } : {}),
    public_private_boundary: "public_safe",
    sensitivity: "public",
    status: input.status ?? "collecting"
  });
}

export function createReceiptEventFromGuardDecision(decision: GuardDecision): ReceiptEvent {
  return createReceiptEvent({
    event_id: `receipt-event:guard:${decision.decision_id}`,
    mission_id: decision.mission_id,
    source_subsystem: "guard",
    event_type: decision.decision === "deny" ? "denial_recorded" : decision.decision === "escalate" ? "escalation_recorded" : "guard_decision_created",
    actor_id: decision.actor_id,
    subject_id: decision.decision_id,
    action_id: decision.action_id,
    timestamp: decision.created_at,
    status_before: "requested",
    status_after: decision.decision,
    summary: decision.summary,
    reason_codes: decision.reason_codes,
    evidence_refs: decision.evidence_required,
    receipt_refs: decision.receipt_required
  });
}

export function createReceiptEventFromWorkerFleetEvent(event: WorkerReceiptEvent): ReceiptEvent {
  return createReceiptEvent({
    event_id: `receipt-event:worker:${event.event_id}`,
    mission_id: event.mission_id,
    task_id: event.task_id,
    source_subsystem: "worker_fleet",
    event_type: event.event_type === "task_completed" ? "worker_task_completed" : event.event_type === "task_failed" ? "worker_task_failed" : event.event_type === "retry_scheduled" ? "worker_retry_scheduled" : event.event_type === "task_leased" ? "worker_task_leased" : event.event_type === "task_started" ? "worker_task_started" : "worker_task_queued",
    actor_id: event.worker_id,
    subject_id: event.task_id,
    timestamp: event.timestamp,
    status_before: event.status_before ?? null,
    status_after: event.status_after ?? null,
    summary: event.summary,
    evidence_refs: event.evidence_refs,
    artifact_refs: event.artifact_refs.map((artifact) => artifact.artifact_id),
    receipt_refs: [event.event_id]
  });
}

export function createReceiptEventFromCodeOpsPrEvidencePacket(packet: PrEvidencePacket, options: { mission_id: string; task_id?: string; actor_id?: string } ): ReceiptEvent {
  return createReceiptEvent({
    event_id: `receipt-event:codeops:${packet.evidence_packet_id}`,
    mission_id: options.mission_id,
    ...(options.task_id ? { task_id: options.task_id } : {}),
    source_subsystem: "codeops",
    event_type: "codeops_patch_plan_created",
    actor_id: options.actor_id ?? "agent:codeops-fixture",
    subject_id: packet.evidence_packet_id,
    timestamp: packet.created_at,
    status_before: "planned",
    status_after: "evidence_recorded",
    summary: `CodeOps PR evidence packet recorded for ${packet.repo_full_name}.`,
    evidence_refs: packet.evidence_refs,
    receipt_refs: packet.receipt_refs,
    artifact_refs: packet.changed_files.map((change) => change.path)
  });
}

export function createReceiptEventFromBrowserOpsPreflightSummary(summary: BrowserPreflightSummary): ReceiptEvent {
  return createReceiptEvent({
    event_id: `receipt-event:browserops:${summary.preflight_id}`,
    mission_id: summary.mission_id,
    source_subsystem: "browserops",
    event_type: summary.blocked ? "denial_recorded" : summary.escalated ? "escalation_recorded" : "browser_preflight_checked",
    actor_id: "agent:browserops-fixture",
    subject_id: summary.action_plan_id,
    action_id: summary.action_plan_id,
    timestamp: summary.created_at,
    status_before: "ready_for_preflight",
    status_after: summary.blocked ? "blocked" : summary.escalated ? "escalated" : "allowed",
    summary: `BrowserOps preflight ${summary.blocked ? "blocked" : summary.escalated ? "escalated" : "allowed"} action plan ${summary.action_plan_id}.`,
    reason_codes: summary.reason_codes,
    evidence_refs: summary.evidence_refs,
    receipt_refs: summary.receipt_refs,
    related_event_ids: summary.guard_decision_refs
  });
}
