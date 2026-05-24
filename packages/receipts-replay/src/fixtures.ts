import { evaluateGuardDecision, guardEvalFixtures, trustedCapabilityToken, type RegistryTrustInput } from "@stealtheye/guard";
import { workerReceiptEventFixture } from "@stealtheye/worker-fleet";
import { prEvidencePacketFixture, safePatchPlan } from "@stealtheye/codeops";
import { browserOpsCapabilityToken, fixtureBrowserSession, safeObservationPlan, trustedBrowserOpsRegistrySummary, runBrowserOpsPreflight } from "@stealtheye/browserops";
import { createEvidenceRef, createEvidenceRefFromGeneratedBuildStateFile } from "./evidence";
import { createReceiptBundle, createReceiptEvent, createReceiptEventFromBrowserOpsPreflightSummary, createReceiptEventFromCodeOpsPrEvidencePacket, createReceiptEventFromGuardDecision, createReceiptEventFromWorkerFleetEvent } from "./events";
import { createFinalReportFromReceiptBundle } from "./final-report";
import { buildReplayPacket } from "./replay";
import { computeReceiptBundleIntegrityDigest } from "./timeline";
import { createVerificationPacket } from "./verification";
import type { EvidenceRef, ReceiptBundle, ReceiptEvent } from "./schemas";

export const receiptsReplayFixtureNow = "2026-01-01T00:00:00.000Z";
export const receiptsReplayFixtureDigest = "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
export const PUBLIC_RECEIPTS_REPLAY_FIXTURE_NOTICE = "Public-safe Receipts + Replay fixtures only. No real secrets, credentials, production endpoints, customer data, real logs, real screenshots, real DOM, or production incidents.";

export const trustedReceiptsRegistrySummary: RegistryTrustInput = {
  trusted: true,
  valid: true,
  trust_status: "trusted",
  review_status: "approved",
  errors: [],
  warnings: [],
  revoked: false
};

export const guardDecisionFixture = evaluateGuardDecision(guardEvalFixtures.normalDelegatedRepoActionAllowed, [trustedCapabilityToken], {
  registryTrust: trustedReceiptsRegistrySummary,
  now: new Date(receiptsReplayFixtureNow),
  decisionId: "guard-decision:fixture:receipts-replay"
});

export const browserPreflightFixture = runBrowserOpsPreflight({
  session: fixtureBrowserSession,
  action_plan: safeObservationPlan,
  capability_tokens: [browserOpsCapabilityToken],
  registry_trust_summary: trustedBrowserOpsRegistrySummary,
  options: { requested_at: receiptsReplayFixtureNow }
});

export const generatedBuildStateEvidence = createEvidenceRefFromGeneratedBuildStateFile("docs/generated/build-009-manifest.json", receiptsReplayFixtureDigest);

export const guardDecisionEvidence = createEvidenceRef({
  evidence_id: "evidence:fixture:guard-decision",
  kind: "guard_decision",
  uri: "receipt://fixture/guard-decision.json",
  digest: receiptsReplayFixtureDigest,
  summary: "Public-safe Guard decision fixture reference.",
  produced_by: "guard",
  produced_at: receiptsReplayFixtureNow
});

export const workerEventEvidence = createEvidenceRef({
  evidence_id: "evidence:fixture:worker-event",
  kind: "worker_fleet_event",
  uri: "receipt://fixture/worker-event.json",
  summary: "Public-safe Worker Fleet event fixture reference.",
  produced_by: "worker_fleet",
  produced_at: receiptsReplayFixtureNow
});

export const codeOpsEvidence = createEvidenceRef({
  evidence_id: "evidence:fixture:codeops-pr-evidence",
  kind: "pr_evidence_packet",
  uri: "receipt://fixture/codeops-pr-evidence.json",
  summary: "Public-safe CodeOps PR evidence packet reference.",
  produced_by: "codeops",
  produced_at: receiptsReplayFixtureNow
});

export const browserEvidence = createEvidenceRef({
  evidence_id: "evidence:fixture:browser-preflight",
  kind: "browser_screenshot_ref",
  uri: "artifact://fixture/browserops/screenshot-metadata.json",
  summary: "Browser evidence reference metadata only; no real screenshot bytes.",
  produced_by: "browserops",
  produced_at: receiptsReplayFixtureNow
});

export const finalReportEvidence = createEvidenceRef({
  evidence_id: "evidence:fixture:final-report",
  kind: "final_report_packet",
  uri: "receipt://fixture/final-report.json",
  summary: "Public-safe final report packet fixture reference.",
  produced_by: "build_automation",
  produced_at: receiptsReplayFixtureNow
});

export const fixtureEvidenceRefs: EvidenceRef[] = [generatedBuildStateEvidence, guardDecisionEvidence, workerEventEvidence, codeOpsEvidence, browserEvidence, finalReportEvidence];

export const missionCreatedEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:mission-created",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "mission_os",
  event_type: "mission_created",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: safePatchPlan.mission_id,
  timestamp: "2026-01-01T00:00:00.000Z",
  status_before: null,
  status_after: "created",
  summary: "Fixture mission was created for receipt replay coverage.",
  evidence_refs: [generatedBuildStateEvidence.evidence_id]
});

export const missionCompiledEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:mission-compiled",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "mission_os",
  event_type: "mission_compiled",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: safePatchPlan.mission_id,
  timestamp: "2026-01-01T00:00:01.000Z",
  status_before: "created",
  status_after: "compiled",
  summary: "Fixture mission was compiled into a public-safe plan.",
  evidence_refs: [generatedBuildStateEvidence.evidence_id]
});

export const guardReceiptEvent = { ...createReceiptEventFromGuardDecision(guardDecisionFixture), timestamp: "2026-01-01T00:00:02.000Z", evidence_refs: [guardDecisionEvidence.evidence_id] } as ReceiptEvent;
export const workerReceiptEvent = { ...createReceiptEventFromWorkerFleetEvent(workerReceiptEventFixture), mission_id: safePatchPlan.mission_id, timestamp: "2026-01-01T00:00:03.000Z", evidence_refs: [workerEventEvidence.evidence_id] } as ReceiptEvent;
export const codeOpsReceiptEvent = { ...createReceiptEventFromCodeOpsPrEvidencePacket(prEvidencePacketFixture, { mission_id: safePatchPlan.mission_id, task_id: safePatchPlan.task_id }), timestamp: "2026-01-01T00:00:04.000Z", evidence_refs: [codeOpsEvidence.evidence_id] } as ReceiptEvent;
export const browserReceiptEvent = { ...createReceiptEventFromBrowserOpsPreflightSummary(browserPreflightFixture), mission_id: safePatchPlan.mission_id, timestamp: "2026-01-01T00:00:05.000Z", evidence_refs: [browserEvidence.evidence_id] } as ReceiptEvent;

export const buildStateGeneratedEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:build-state-generated",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "build_automation",
  event_type: "build_state_generated",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: "docs/generated/build-009-manifest.json",
  timestamp: "2026-01-01T00:00:06.000Z",
  status_before: "pending",
  status_after: "generated",
  summary: "Build 9 generated-state manifest was recorded as evidence reference only.",
  evidence_refs: [generatedBuildStateEvidence.evidence_id]
});

export const verificationRecordedEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:verification-recorded",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "build_automation",
  event_type: "verification_recorded",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: "verification-packet:fixture:build-9",
  timestamp: "2026-01-01T00:00:07.000Z",
  status_before: "running",
  status_after: "passed",
  summary: "Fixture verification packet recorded passed checks.",
  evidence_refs: [generatedBuildStateEvidence.evidence_id]
});

export const finalReportCreatedEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:final-report-created",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "build_automation",
  event_type: "final_report_created",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: "final-report:fixture:build-9",
  timestamp: "2026-01-01T00:00:08.000Z",
  status_before: "verified",
  status_after: "completed",
  summary: "Fixture final report packet was created.",
  evidence_refs: [finalReportEvidence.evidence_id]
});

export const denialFixtureEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:denial",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "guard",
  event_type: "denial_recorded",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: "action:fixture:denied",
  action_id: "action:fixture:denied",
  timestamp: "2026-01-01T00:00:09.000Z",
  status_before: "requested",
  status_after: "deny",
  summary: "Fixture denial recorded for replay summary coverage.",
  reason_codes: ["fixture_denial"]
});

export const escalationFixtureEvent = createReceiptEvent({
  event_id: "receipt-event:fixture:escalation",
  mission_id: safePatchPlan.mission_id,
  source_subsystem: "guard",
  event_type: "escalation_recorded",
  actor_id: "agent:receipts-replay-fixture",
  subject_id: "action:fixture:escalated",
  action_id: "action:fixture:escalated",
  timestamp: "2026-01-01T00:00:10.000Z",
  status_before: "requested",
  status_after: "escalate",
  summary: "Fixture escalation recorded for replay summary coverage.",
  reason_codes: ["fixture_escalation"]
});

export const fixtureReceiptEvents: ReceiptEvent[] = [missionCreatedEvent, missionCompiledEvent, guardReceiptEvent, workerReceiptEvent, codeOpsReceiptEvent, browserReceiptEvent, buildStateGeneratedEvent, verificationRecordedEvent, finalReportCreatedEvent, denialFixtureEvent, escalationFixtureEvent];

const unsignedReceiptBundle = createReceiptBundle({
  bundle_id: "receipt-bundle:fixture:build-9",
  mission_id: safePatchPlan.mission_id,
  events: fixtureReceiptEvents,
  evidence_refs: fixtureEvidenceRefs,
  artifact_refs: ["artifact:fixture:worker-output"],
  guard_decision_refs: [guardDecisionFixture.decision_id],
  worker_task_refs: [workerReceiptEventFixture.task_id],
  codeops_refs: [prEvidencePacketFixture.evidence_packet_id],
  ci_refs: ["ci:fixture:summary"],
  browser_refs: [browserPreflightFixture.preflight_id],
  generated_state_refs: [generatedBuildStateEvidence.evidence_id],
  final_report_ref: "final-report:fixture:build-9",
  status: "replayable",
  created_at: receiptsReplayFixtureNow,
  updated_at: "2026-01-01T00:00:11.000Z"
});

export const fixtureReceiptBundle: ReceiptBundle = createReceiptBundle({
  ...unsignedReceiptBundle,
  integrity_digest: computeReceiptBundleIntegrityDigest(unsignedReceiptBundle)
});

export const fixtureVerificationPacket = createVerificationPacket({
  verification_packet_id: "verification-packet:fixture:build-9",
  mission_id: fixtureReceiptBundle.mission_id,
  receipt_bundle_id: fixtureReceiptBundle.bundle_id,
  checks: [
    { check_id: "check:typecheck", name: "Typecheck packages", status: "passed", summary: "Typecheck passed in fixture metadata.", evidence_refs: [generatedBuildStateEvidence.evidence_id] },
    { check_id: "check:warning", name: "Manual verifier warning", status: "warning", summary: "Fixture warning retained for packet coverage.", evidence_refs: [] },
    { check_id: "check:skipped", name: "Live replay execution", status: "not_applicable", summary: "Live replay execution is not part of Build 9.", evidence_refs: [] }
  ],
  ci_run_refs: ["ci-run:fixture:build-9"],
  test_refs: ["test://receipts-replay/vitest"],
  generated_state_refs: [generatedBuildStateEvidence.evidence_id]
});

export const fixtureReplayPacket = buildReplayPacket(fixtureReceiptBundle, { replay_packet_id: "replay-packet:fixture:build-9", created_at: "2026-01-01T00:00:12.000Z" });
export const fixtureFinalReportPacket = createFinalReportFromReceiptBundle(fixtureReceiptBundle, fixtureVerificationPacket, { final_report_id: "final-report:fixture:build-9", known_gaps: ["Durable ledger remains future work."], next_recommended_actions: ["Build 10 — Memory Graph"], created_at: "2026-01-01T00:00:13.000Z" });

export const receiptsReplayFixtureCorpus = {
  notice: PUBLIC_RECEIPTS_REPLAY_FIXTURE_NOTICE,
  events: fixtureReceiptEvents,
  evidence_refs: fixtureEvidenceRefs,
  bundle: fixtureReceiptBundle,
  replay_packet: fixtureReplayPacket,
  verification_packet: fixtureVerificationPacket,
  final_report_packet: fixtureFinalReportPacket
} as const;
