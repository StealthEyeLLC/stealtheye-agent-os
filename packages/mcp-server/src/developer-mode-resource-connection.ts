import { z } from "zod";
import { createControlledLocalhostPreviewPlan, createControlledLocalhostPreviewReadinessReport, ControlledLocalhostPreviewReceiptPreviewSchema } from "./controlled-localhost-command";
import { createMcpUiResourceReadinessReport } from "./ui-resource-adapter";

export const DeveloperModeResourceConnectionPlanSchema = z.object({
  schema_version: z.literal("stealtheye-developer-mode-resource-connection-plan.v1"),
  stage: z.literal("metadata_only_config_required"),
  mcp_server_package_summary: z.string().min(1),
  dev_endpoint_readiness_summary: z.string().min(1),
  localhost_preview_readiness_summary: z.string().min(1),
  resource_inventory_summary: z.record(z.unknown()),
  ui_resource_inventory_summary: z.record(z.unknown()),
  render_resource_inventory_summary: z.record(z.unknown()),
  required_manual_steps: z.array(z.string().min(1)).min(1),
  blocked_future_steps: z.array(z.string().min(1)).min(1),
  no_secret_statement: z.string().min(1),
  no_production_statement: z.string().min(1),
  no_public_submission_statement: z.string().min(1),
  no_money_statement: z.string().min(1),
  receipt_preview: ControlledLocalhostPreviewReceiptPreviewSchema
});
export type DeveloperModeResourceConnectionPlan = z.infer<typeof DeveloperModeResourceConnectionPlanSchema>;

export const DeveloperModeResourceConnectionManifestSchema = z.object({
  schema_version: z.literal("stealtheye-developer-mode-resource-connection-manifest.v1"),
  build: z.literal(21),
  manifest_uri: z.literal("developer-mode-resource-connection://stealtheye/control-plane/manifest"),
  connection_mode: z.literal("localhost_config_required"),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  creates_real_chatgpt_app: z.literal(false),
  submits_public_app: z.literal(false),
  includes_real_app_id: z.literal(false),
  includes_real_oauth_client: z.literal(false),
  includes_real_public_url: z.literal(false),
  plan: DeveloperModeResourceConnectionPlanSchema
});
export type DeveloperModeResourceConnectionManifest = z.infer<typeof DeveloperModeResourceConnectionManifestSchema>;

export const createDeveloperModeResourceConnectionPlan = (): DeveloperModeResourceConnectionPlan => {
  const readiness = createControlledLocalhostPreviewReadinessReport();
  const resourceReadiness = createMcpUiResourceReadinessReport();
  const localhostPlan = createControlledLocalhostPreviewPlan("localhost_config_required");
  return DeveloperModeResourceConnectionPlanSchema.parse({
    schema_version: "stealtheye-developer-mode-resource-connection-plan.v1",
    stage: "metadata_only_config_required",
    mcp_server_package_summary: "@stealtheye/mcp-server exposes read-only MCP, UI, render, localhost-preview, command-plan, and developer-mode connection metadata resources.",
    dev_endpoint_readiness_summary: "Developer endpoint remains metadata-only until a safe reachable local endpoint exists; no server is bound by default.",
    localhost_preview_readiness_summary: `Implemented modes: ${readiness.command_modes_implemented.join(", ")}; blocked modes: ${readiness.command_modes_blocked.join(", ")}.`,
    resource_inventory_summary: { mcp_server: "@stealtheye/mcp-server", dev_endpoint: "@stealtheye/dev-endpoint", chatgpt_dev_connection: "@stealtheye/chatgpt-dev-connection" },
    ui_resource_inventory_summary: { count: resourceReadiness.ui_resource_count, scheme: "ui://stealtheye/control-plane/" },
    render_resource_inventory_summary: { count: resourceReadiness.render_resource_count, scheme: "ui-render://stealtheye/control-plane/" },
    required_manual_steps: ["Configure an explicit safe localhost endpoint in a future build.", "Use ChatGPT developer-mode connection only after a reachable safe local endpoint exists.", "Verify no secrets, production domains, app IDs, OAuth clients, tunnel credentials, or public submission material are present."],
    blocked_future_steps: ["Do not create a real ChatGPT app in Build 21.", "Do not submit a public app in Build 21.", "Do not bind a server, start a process, enable a tunnel, or expose a public endpoint in Build 21."],
    no_secret_statement: "No secrets, credentials, tokens, private keys, OAuth secrets, app secrets, tunnel tokens, or credential material are included.",
    no_production_statement: "No production frontend, production deployment, production mutation, production endpoint, or production domain is included.",
    no_public_submission_statement: "No public app submission, real app ID, production OAuth client, or hosted public mode is included.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund is included.",
    receipt_preview: localhostPlan.receipt_preview
  });
};

export const createDeveloperModeResourceConnectionManifest = (): DeveloperModeResourceConnectionManifest => DeveloperModeResourceConnectionManifestSchema.parse({
  schema_version: "stealtheye-developer-mode-resource-connection-manifest.v1",
  build: 21,
  manifest_uri: "developer-mode-resource-connection://stealtheye/control-plane/manifest",
  connection_mode: "localhost_config_required",
  read_only: true,
  fixture_only: true,
  preview_only: true,
  creates_real_chatgpt_app: false,
  submits_public_app: false,
  includes_real_app_id: false,
  includes_real_oauth_client: false,
  includes_real_public_url: false,
  plan: createDeveloperModeResourceConnectionPlan()
});
