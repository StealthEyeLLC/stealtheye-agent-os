import { ReceiptEventSchema } from "@stealtheye/receipts-replay";
import type { LocalDevUiHydrationResult, LocalDevUiReceiptPreview, LocalDevUiRoute, LocalDevUiSafetyDecision } from "./schemas";

export const createLocalDevUiReceiptPreview = (
  route: LocalDevUiRoute,
  hydrationSummary: LocalDevUiHydrationResult,
  safetyDecision: LocalDevUiSafetyDecision
): LocalDevUiReceiptPreview => {
  const replayEvent = ReceiptEventSchema.parse({
    schema_version: "receipts-replay-event.v1",
    event_id: `build19-render-${route.route_id}`,
    mission_id: "build-019-local-dev-ui-shell",
    source_subsystem: "app_host",
    event_type: "artifact_recorded",
    actor_id: "@stealtheye/local-dev-ui-shell",
    subject_id: route.resource_uri,
    action_id: "static_fixture_render",
    timestamp: "2026-01-01T00:00:00.000Z",
    status_before: null,
    status_after: safetyDecision.allowed ? "rendered_static_fixture_preview" : "blocked",
    summary: `Static fixture render preview for ${route.path}.`,
    reason_codes: safetyDecision.reasons,
    evidence_refs: [],
    artifact_refs: [`receipt://fixture/build-019/${route.route_id}`],
    receipt_refs: route.receipt_refs,
    related_event_ids: [],
    public_private_boundary: "public_safe",
    sensitivity: "public",
    retention_hint: "generated Build 19 fixture receipt preview"
  });
  return {
    schema_version: "local-dev-ui-shell.receipt-preview.v1",
    route: route.path,
    resource_uri: route.resource_uri,
    component_type: route.component_type,
    render_mode: route.shell_mode,
    hydration_summary: hydrationSummary,
    safety_decision: safetyDecision,
    read_only: true,
    preview_only: true,
    fixture_only: true,
    no_secret_statement: "No secrets, credentials, tokens, private keys, OAuth secrets, or tunnel tokens were requested, rendered, or stored.",
    no_production_statement: "No production frontend, production deployment, production mutation, production domain, or real public endpoint was created.",
    no_public_submission_statement: "No public app submission, real app ID, production OAuth client, or production app registration was added.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund occurred.",
    result_status: safetyDecision.allowed ? "ok" : "blocked",
    replay_receipt_event_preview: replayEvent
  };
};
