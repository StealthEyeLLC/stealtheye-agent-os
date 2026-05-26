import { ControlPlaneReceiptPreviewSchema, type ControlPlaneAction, type ControlPlaneStateSnapshot } from "./schemas";
import { decideControlPlaneSafety } from "./safety";
import { createControlPlaneStateSnapshot } from "./state";

export function createControlPlaneReceiptPreview(action: ControlPlaneAction, snapshot: ControlPlaneStateSnapshot = createControlPlaneStateSnapshot()) {
  const decision = decideControlPlaneSafety(action);
  return ControlPlaneReceiptPreviewSchema.parse({
    schema_version: "stealtheye-control-plane-receipt-preview.v1",
    action_name: action.name,
    view: action.view,
    panel: action.panel,
    input_summary: `Public-safe fixture input for ${action.name}; build ${snapshot.current_build}.`,
    output_summary: `Control plane preview output for ${action.view}/${action.panel}; no live side effect occurs.`,
    safety_decision: decision.decision,
    preview_fixture_readonly_status: action.preview_only && action.fixture_only ? "fixture_preview" : action.read_only ? "read_only" : "blocked",
    no_secret_statement: "No secrets, credentials, tokens, passwords, private keys, OAuth secrets, tunnel auth values, or cloud credentials are requested or stored.",
    no_production_statement: "No production frontend, production deployment, production domain, production endpoint, or production mutation is configured.",
    no_public_submission_statement: "No public app submission is performed by Build 17.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund is enabled.",
    result_status: decision.allowed ? "ok" : "blocked"
  });
}
