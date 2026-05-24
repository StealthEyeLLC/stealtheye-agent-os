import { createHash } from "node:crypto";
import { MissionTimelineSchema, ReceiptBundleSchema, ReceiptsReplaySchemaVersion, type MissionTimeline, type ReceiptBundle, type ReceiptEvent, type ReceiptEventType, type SourceSubsystem } from "./schemas";

export const defaultRequiredEventTypes: ReceiptEventType[] = ["mission_created", "mission_compiled", "guard_decision_created", "verification_recorded", "final_report_created"];

export function sortReceiptEvents(events: ReceiptEvent[]): ReceiptEvent[] {
  return [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.event_id.localeCompare(b.event_id));
}

export function groupEventsBySubsystem(events: ReceiptEvent[]): Record<SourceSubsystem, ReceiptEvent[]> {
  const grouped = Object.fromEntries(["mission_os", "agent_registry", "guard", "worker_fleet", "app_host", "codeops", "ci_repair", "browserops", "build_automation", "workflow_compiler_future", "tool_router_future", "domain_apps_future"].map((key) => [key, []])) as Record<SourceSubsystem, ReceiptEvent[]>;
  for (const event of events) grouped[event.source_subsystem].push(event);
  for (const key of Object.keys(grouped) as SourceSubsystem[]) grouped[key] = sortReceiptEvents(grouped[key]);
  return grouped;
}

export function findMissingRequiredEventTypes(events: ReceiptEvent[], required: ReceiptEventType[] = defaultRequiredEventTypes): ReceiptEventType[] {
  const present = new Set(events.map((event) => event.event_type));
  return required.filter((eventType) => !present.has(eventType));
}

export function summarizeDenialsEscalations(events: ReceiptEvent[]): { denial_count: number; escalation_count: number; summaries: string[]; reason_codes: string[] } {
  const denials = events.filter((event) => event.event_type === "denial_recorded" || event.status_after === "deny" || event.status_after === "blocked");
  const escalations = events.filter((event) => event.event_type === "escalation_recorded" || event.status_after === "escalate" || event.status_after === "escalated");
  return {
    denial_count: denials.length,
    escalation_count: escalations.length,
    summaries: [...denials, ...escalations].map((event) => event.summary),
    reason_codes: [...new Set([...denials, ...escalations].flatMap((event) => event.reason_codes))].sort()
  };
}

export function summarizeMissionProgress(events: ReceiptEvent[]): { total_events: number; subsystems: SourceSubsystem[]; latest_status: string; completed: boolean; public_summary: string } {
  const sorted = sortReceiptEvents(events);
  const subsystems = [...new Set(sorted.map((event) => event.source_subsystem))].sort() as SourceSubsystem[];
  const latest = sorted.at(-1);
  const latestStatus = latest?.status_after ?? "unknown";
  const completed = sorted.some((event) => event.event_type === "final_report_created") || latestStatus === "complete" || latestStatus === "completed";
  return {
    total_events: sorted.length,
    subsystems,
    latest_status: latestStatus,
    completed,
    public_summary: `${sorted.length} receipt events across ${subsystems.length} subsystem(s); latest status: ${latestStatus}.`
  };
}

export function buildMissionTimeline(events: ReceiptEvent[], required: ReceiptEventType[] = defaultRequiredEventTypes): MissionTimeline {
  const sorted = sortReceiptEvents(events);
  const denialSummary = summarizeDenialsEscalations(sorted);
  const progress = summarizeMissionProgress(sorted);
  return MissionTimelineSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.MissionTimeline,
    mission_id: sorted[0]?.mission_id ?? "mission:unknown",
    event_order: sorted.map((event) => event.event_id),
    entries: sorted.map((event) => ({ event_id: event.event_id, timestamp: event.timestamp, source_subsystem: event.source_subsystem, event_type: event.event_type, summary: event.summary, status_after: event.status_after, evidence_refs: event.evidence_refs })),
    missing_required_event_types: findMissingRequiredEventTypes(sorted, required),
    denial_count: denialSummary.denial_count,
    escalation_count: denialSummary.escalation_count,
    public_safe_summary: progress.public_summary
  });
}

export function producePublicSafeTimelineSummary(events: ReceiptEvent[]): string {
  const timeline = buildMissionTimeline(events, []);
  return `${timeline.public_safe_summary} Denials: ${timeline.denial_count}; escalations: ${timeline.escalation_count}.`;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().filter((key) => record[key] !== undefined).map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function canonicalizeReceiptBundle(bundle: ReceiptBundle): string {
  const parsed = ReceiptBundleSchema.parse(bundle);
  const canonical = {
    ...parsed,
    updated_at: undefined,
    integrity_digest: undefined,
    events: sortReceiptEvents(parsed.events),
    evidence_refs: [...parsed.evidence_refs].sort((a, b) => a.evidence_id.localeCompare(b.evidence_id))
  };
  return stableJson(canonical);
}

export function computeReceiptBundleIntegrityDigest(bundle: ReceiptBundle): string {
  return `sha256:${createHash("sha256").update(canonicalizeReceiptBundle(bundle)).digest("hex")}`;
}

export function receiptBundleDigestMatches(bundle: ReceiptBundle): boolean {
  if (!bundle.integrity_digest) return false;
  return computeReceiptBundleIntegrityDigest(bundle) === bundle.integrity_digest;
}
