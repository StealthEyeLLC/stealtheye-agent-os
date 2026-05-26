import { createDeveloperModeChecklist } from "./checklist";
import { ConnectionPlanSchema, type ConnectionStage } from "./schemas";

export function createDeveloperModeConnectionPlan(stage: ConnectionStage = "app_manifest_ready") {
  return ConnectionPlanSchema.parse({
    schema_version: "stealtheye-chatgpt-dev-connection-plan.v1",
    app_name: "StealthEye Agent OS Developer Mode Fixture",
    server_package: "@stealtheye/mcp-server",
    dev_endpoint_package: "@stealtheye/dev-endpoint",
    connection_package: "@stealtheye/chatgpt-dev-connection",
    connection_stage: stage,
    fixture_only: true,
    endpoint_placeholder: "dev-endpoint://fixture/stealtheye-agent-os",
    chatgpt_dev_uri: "chatgpt-dev://fixture/stealtheye-agent-os",
    local_mcp_url: "http://localhost:3000/mcp",
    public_app_submission: false,
    production_ready: false,
    oauth_production_configured: false,
    real_app_id_present: false,
    boundary_statements: [
      "No secrets, tokens, passwords, private keys, cloud credentials, tunnel auth values, production OAuth secrets, or customer/private data are present.",
      "No production endpoint, production domain, production deployment, production mutation, or unrestricted live write tools are enabled.",
      "No OAuth production client or real app ID is configured.",
      "No public app submission is performed; receipt preview is required before future manual connection.",
      "No money movement, billing mutation, purchase, subscription, or refund is enabled."
    ],
    checklist: createDeveloperModeChecklist()
  });
}
