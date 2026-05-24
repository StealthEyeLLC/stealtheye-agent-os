import { FinalReportPacketSchema, ReceiptsReplaySchemaVersion, type FinalReportPacket, type ReceiptBundle, type VerificationPacket } from "./schemas";
import { summarizeDenialsEscalations, summarizeMissionProgress } from "./timeline";

export function createFinalReportFromReceiptBundle(bundle: ReceiptBundle, verification: VerificationPacket, options: { final_report_id?: string; title?: string; known_gaps?: string[]; next_recommended_actions?: string[]; created_at?: string } = {}): FinalReportPacket {
  const progress = summarizeMissionProgress(bundle.events);
  const denials = summarizeDenialsEscalations(bundle.events);
  const outcome = verification.status === "failed" ? "failed" : denials.denial_count > 0 || denials.escalation_count > 0 ? "partially_completed" : progress.completed ? "completed" : "partially_completed";
  return FinalReportPacketSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.FinalReportPacket,
    final_report_id: options.final_report_id ?? `final-report:${bundle.bundle_id}`,
    mission_id: bundle.mission_id,
    receipt_bundle_id: bundle.bundle_id,
    title: options.title ?? `Final report for ${bundle.mission_id}`,
    summary: progress.public_summary,
    outcome,
    completed_work: bundle.events.filter((event) => event.status_after === "completed" || event.event_type === "final_report_created").map((event) => event.summary),
    verification_summary: `${verification.status}: ${verification.checks.length} check(s), ${verification.failures.length} failure(s), ${verification.warnings.length} warning(s).`,
    evidence_summary: `${bundle.evidence_refs.length} public-safe evidence reference(s) captured in bundle ${bundle.bundle_id}.`,
    denials_escalations: denials.summaries,
    known_gaps: options.known_gaps ?? [],
    next_recommended_actions: options.next_recommended_actions ?? [],
    public_private_boundary: "public_safe",
    created_at: options.created_at ?? verification.created_at
  });
}
