import { describe, expect, it } from "vitest";
import { workerReceiptEventFixture } from "@stealtheye/worker-fleet";
import { prEvidencePacketFixture, safePatchPlan } from "@stealtheye/codeops";
import { guardDecisionFixture, browserPreflightFixture, fixtureEvidenceRefs, fixtureFinalReportPacket, fixtureReceiptBundle, fixtureReceiptEvents, fixtureReplayPacket, fixtureVerificationPacket, generatedBuildStateEvidence, receiptsReplayFixtureCorpus } from "../src/fixtures";
import * as ReceiptsReplay from "../src/index";

describe("Receipts + Replay foundations", () => {
  it("validates a valid receipt event", () => {
    expect(ReceiptsReplay.ReceiptEventSchema.parse(fixtureReceiptEvents[0]).event_type).toBe("mission_created");
  });

  it("rejects an invalid receipt event", () => {
    expect(() => ReceiptsReplay.ReceiptEventSchema.parse({ ...fixtureReceiptEvents[0], source_subsystem: "live_database" })).toThrow();
  });

  it("rejects non-fixture/live evidence URIs", () => {
    expect(() => ReceiptsReplay.createEvidenceRef({ evidence_id: "evidence:bad", kind: "json_document", uri: "https://example.com/live.json", summary: "Bad live URI.", produced_by: "build_automation" })).toThrow();
  });

  it("validates receipt bundles", () => {
    expect(ReceiptsReplay.ReceiptBundleSchema.parse(fixtureReceiptBundle).status).toBe("replayable");
  });

  it("sorts events deterministically", () => {
    const reversed = [...fixtureReceiptEvents].reverse();
    const sorted = ReceiptsReplay.sortReceiptEvents(reversed);
    expect(sorted[0]?.event_id).toBe("receipt-event:fixture:mission-created");
    expect(sorted.map((event) => event.timestamp)).toEqual([...sorted.map((event) => event.timestamp)].sort());
  });

  it("groups events by subsystem", () => {
    const grouped = ReceiptsReplay.groupEventsBySubsystem(fixtureReceiptEvents);
    expect(grouped.guard.length).toBeGreaterThan(0);
    expect(grouped.browserops.length).toBeGreaterThan(0);
  });

  it("detects missing required event types", () => {
    const missing = ReceiptsReplay.findMissingRequiredEventTypes([fixtureReceiptEvents[0]], ["mission_created", "final_report_created"]);
    expect(missing).toEqual(["final_report_created"]);
  });

  it("summarizes denials and escalations", () => {
    const summary = ReceiptsReplay.summarizeDenialsEscalations(fixtureReceiptEvents);
    expect(summary.denial_count).toBeGreaterThanOrEqual(1);
    expect(summary.escalation_count).toBeGreaterThanOrEqual(1);
    expect(summary.reason_codes).toContain("fixture_denial");
  });

  it("summarizes mission progress", () => {
    const progress = ReceiptsReplay.summarizeMissionProgress(fixtureReceiptEvents);
    expect(progress.total_events).toBe(fixtureReceiptEvents.length);
    expect(progress.completed).toBe(true);
  });

  it("creates a public-safe side-effect-free replay packet", () => {
    expect(ReceiptsReplay.ReplayPacketSchema.parse(fixtureReplayPacket).replay_steps.length).toBeGreaterThan(0);
    expect(ReceiptsReplay.assertReplayPacketSideEffectFree(fixtureReplayPacket)).toBe(true);
  });

  it("preserves event order in replay packets", () => {
    const expected = ReceiptsReplay.sortReceiptEvents(fixtureReceiptEvents).map((event) => event.event_id);
    expect(fixtureReplayPacket.event_order).toEqual(expected);
  });

  it("validates verification packets with passed, warning, and not applicable checks", () => {
    const packet = ReceiptsReplay.VerificationPacketSchema.parse(fixtureVerificationPacket);
    expect(packet.status).toBe("warning");
    expect(packet.checks.map((check) => check.status)).toContain("passed");
    expect(packet.checks.map((check) => check.status)).toContain("warning");
    expect(packet.checks.map((check) => check.status)).toContain("not_applicable");
  });

  it("summarizes final report outcome, evidence, and gaps", () => {
    const packet = ReceiptsReplay.FinalReportPacketSchema.parse(fixtureFinalReportPacket);
    expect(packet.outcome).toBe("partially_completed");
    expect(packet.evidence_summary).toContain("evidence reference");
    expect(packet.known_gaps).toContain("Durable ledger remains future work.");
  });

  it("computes a stable integrity digest", () => {
    const digestA = ReceiptsReplay.computeReceiptBundleIntegrityDigest(fixtureReceiptBundle);
    const digestB = ReceiptsReplay.computeReceiptBundleIntegrityDigest({ ...fixtureReceiptBundle, updated_at: "2026-02-01T00:00:00.000Z" });
    expect(digestA).toBe(digestB);
  });

  it("detects integrity digest mismatch", () => {
    expect(ReceiptsReplay.receiptBundleDigestMatches(fixtureReceiptBundle)).toBe(true);
    expect(ReceiptsReplay.receiptBundleDigestMatches({ ...fixtureReceiptBundle, integrity_digest: "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" })).toBe(false);
  });

  it("creates receipt event from Guard decision fixture", () => {
    const event = ReceiptsReplay.createReceiptEventFromGuardDecision(guardDecisionFixture);
    expect(event.source_subsystem).toBe("guard");
    expect(event.action_id).toBe(guardDecisionFixture.action_id);
  });

  it("creates receipt event from Worker Fleet fixture", () => {
    const event = ReceiptsReplay.createReceiptEventFromWorkerFleetEvent(workerReceiptEventFixture);
    expect(event.source_subsystem).toBe("worker_fleet");
    expect(event.task_id).toBe(workerReceiptEventFixture.task_id);
  });

  it("creates receipt event from CodeOps fixture", () => {
    const event = ReceiptsReplay.createReceiptEventFromCodeOpsPrEvidencePacket(prEvidencePacketFixture, { mission_id: safePatchPlan.mission_id });
    expect(event.source_subsystem).toBe("codeops");
    expect(event.subject_id).toBe(prEvidencePacketFixture.evidence_packet_id);
  });

  it("creates receipt event from BrowserOps fixture", () => {
    const event = ReceiptsReplay.createReceiptEventFromBrowserOpsPreflightSummary(browserPreflightFixture);
    expect(event.source_subsystem).toBe("browserops");
    expect(event.event_type).toBe("browser_preflight_checked");
  });

  it("creates evidence ref from generated build-state fixture", () => {
    const evidence = ReceiptsReplay.createEvidenceRefFromGeneratedBuildStateFile("docs/generated/build-009-manifest.json");
    expect(evidence.uri).toBe("docs://generated/build-009-manifest.json");
    expect(generatedBuildStateEvidence.kind).toBe("generated_build_state_file");
  });

  it("exports JSON Schemas", () => {
    expect(ReceiptsReplay.ReceiptsReplayJsonSchemas.receiptEvent).toBeDefined();
    expect(ReceiptsReplay.ReceiptsReplayJsonSchemas.replayPacket).toBeDefined();
  });

  it("contains only public-safe fixture references and no live endpoints", () => {
    const fixtureText = JSON.stringify(receiptsReplayFixtureCorpus);
    expect(fixtureText).not.toMatch(/https?:\/\//);
    expect(fixtureText).not.toMatch(/raw_screenshot_bytes|actual_ci_log_payload|production_incident_payload/i);
    expect(fixtureEvidenceRefs.every((ref) => ref.public_safe)).toBe(true);
    expect(fixtureEvidenceRefs.every((ref) => ReceiptsReplay.isPublicSafeReceiptUri(ref.uri))).toBe(true);
  });
});
