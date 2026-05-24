import { ReplayPacketSchema, ReceiptsReplaySchemaVersion, type EvidenceRef, type ReceiptBundle, type ReplayPacket, type ReplayStep } from "./schemas";
import { sortReceiptEvents } from "./timeline";

export function buildReplayPacket(bundle: ReceiptBundle, options: { replay_packet_id?: string; created_at?: string; verification_summary?: string } = {}): ReplayPacket {
  const sortedEvents = sortReceiptEvents(bundle.events);
  const publicEvidence = bundle.evidence_refs.filter((ref) => ref.public_safe && ref.sensitivity === "public");
  const omittedSensitiveRefs = bundle.evidence_refs.filter((ref) => !ref.public_safe || ref.sensitivity !== "public").map((ref) => ref.evidence_id).sort();
  const evidenceIndex = Object.fromEntries(publicEvidence.map((ref) => [ref.evidence_id, ref])) as Record<string, EvidenceRef>;
  const artifactIndex = Object.fromEntries(bundle.artifact_refs.map((ref) => [ref, ref]));
  const replaySteps: ReplayStep[] = sortedEvents.map((event, index) => ({
    schema_version: ReceiptsReplaySchemaVersion.ReplayStep,
    step_id: `replay-step:${String(index + 1).padStart(3, "0")}`,
    event_id: event.event_id,
    subsystem: event.source_subsystem,
    summary: event.summary,
    evidence_refs: event.evidence_refs.filter((ref) => evidenceIndex[ref]),
    expected_state: event.status_after ?? "recorded",
    public_safe: event.sensitivity === "public" && event.public_private_boundary === "public_safe",
    replayable_without_side_effects: true
  }));

  return ReplayPacketSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.ReplayPacket,
    replay_packet_id: options.replay_packet_id ?? `replay-packet:${bundle.bundle_id}`,
    mission_id: bundle.mission_id,
    receipt_bundle_id: bundle.bundle_id,
    event_order: sortedEvents.map((event) => event.event_id),
    evidence_index: evidenceIndex,
    artifact_index: artifactIndex,
    replay_steps: replaySteps,
    omitted_sensitive_refs: omittedSensitiveRefs,
    verification_summary: options.verification_summary ?? "Replay is descriptive only and does not execute tools, call APIs, rerun CI, run browsers, or mutate state.",
    created_at: options.created_at ?? bundle.updated_at
  });
}

export function assertReplayPacketSideEffectFree(packet: ReplayPacket): boolean {
  return packet.replay_steps.every((step) => step.replayable_without_side_effects) && packet.replay_steps.every((step) => step.public_safe);
}
