import { ReceiptPreviewSchema, type ChatGptDeveloperModeConnectionPlan, type ChatGptDeveloperModeReadinessReport, type ChatGptDeveloperModeSafetyDecision } from "./schemas";

export function createDeveloperModeReceiptPreview(plan: ChatGptDeveloperModeConnectionPlan, safety: ChatGptDeveloperModeSafetyDecision, readiness: ChatGptDeveloperModeReadinessReport) {
  return ReceiptPreviewSchema.parse({
    schema_version: "stealtheye-chatgpt-dev-connection-receipt-preview.v1",
    connection_stage: plan.connection_stage,
    endpoint_readiness_summary: readiness.ready_for_local_developer_mode_plan ? "dev endpoint fixture/local readiness represented" : "dev endpoint readiness blocked",
    mcp_server_safety_summary: safety.allowed ? "MCP server safety inventory contains no denied tool category" : "MCP server safety inventory has denied findings",
    app_manifest_summary: "Developer-mode app manifest is fixture-only; no real app ID, production OAuth client, production domain, or public submission is present.",
    test_integration_status: plan.connection_stage === "test_integration" ? "fixture/local test plan represented" : "test integration remains planned only",
    safety_decision: safety.decision,
    readiness_status: readiness.ready_for_manual_chatgpt_dev_connection_later ? "ready_for_manual_chatgpt_dev_connection_later" : "blocked",
    no_secret_statement: "No secrets, credentials, tokens, passwords, private keys, tunnel auth values, cloud credentials, or production OAuth secrets are present.",
    no_production_statement: "No production endpoint, production domain, production deployment, or production mutation is enabled.",
    no_oauth_production_statement: "No OAuth production client or secret is configured.",
    no_public_app_submission_statement: "No public ChatGPT app submission is performed by Build 16.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund is enabled.",
    result_status: safety.allowed ? "ok" : "blocked"
  });
}
