import { createMcpServer } from "@stealtheye/mcp-server";
import { OFFICIAL_DOCS_CHECKED } from "./fixtures";
import { getDevEndpointHealth } from "./health";
import { decideDevEndpointSafety } from "./safety";
import { DevEndpointManifestSchema, DevEndpointReadinessReportSchema, DevEndpointReceiptPreviewSchema, type DevEndpointConfig } from "./schemas";
import { getTunnelProviderStatus, requiredTunnelConfig } from "./tunnel";

export function createDevEndpointReadinessReport(config: DevEndpointConfig) {
  const health = getDevEndpointHealth(config);
  const safety = decideDevEndpointSafety(config);
  const findings = [...safety.findings];
  if (!health.ok) findings.push("missing health check");
  const readyForLocalDev = safety.allowed && health.ok && (config.mode === "localhost_only" || config.mode === "disabled");
  const readyForTunnelConfig = safety.allowed && health.ok && config.mode === "tunnel_config_required" && config.placeholderOnly;
  const requiredNextSteps = [
    "Keep Build 15 dev-only and fixture/test-safe.",
    "Configure a safe reachable dev endpoint in a later build without committing credentials.",
    "Validate ChatGPT developer-mode connection only after safety and health checks remain green."
  ];
  return DevEndpointReadinessReportSchema.parse({
    ready_for_local_dev: readyForLocalDev,
    ready_for_tunnel_config: readyForTunnelConfig,
    blocked_for_public_submission: true,
    blocked_for_production: true,
    findings,
    required_next_steps: requiredNextSteps
  });
}

export function createDevEndpointReceiptPreview(config: DevEndpointConfig) {
  const health = getDevEndpointHealth(config);
  const safety = decideDevEndpointSafety(config);
  const readiness = createDevEndpointReadinessReport(config);
  return DevEndpointReceiptPreviewSchema.parse({
    schema_version: "stealtheye-dev-endpoint-receipt-preview.v1",
    endpoint_mode: config.mode,
    tunnel_provider: config.tunnelProvider,
    server_metadata_summary: `${config.serverPackage} metadata present for Build 15 dev endpoint modeling.`,
    health_summary: health.ok ? "health ok" : "health blocked",
    safety_decision: safety.decision,
    readiness_status: readiness.ready_for_local_dev ? "ready_for_local_dev" : readiness.ready_for_tunnel_config ? "ready_for_tunnel_config" : "blocked",
    no_secret_statement: "No secrets, credentials, tunnel auth values, private keys, cloud credentials, or production OAuth secrets are present.",
    no_production_statement: "No production endpoint, production deployment, production mutation, public production domain, or hosted production mode is enabled.",
    no_oauth_production_statement: "No production OAuth client ID or client secret is present.",
    no_public_app_submission_statement: "No public ChatGPT app submission is performed by Build 15.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund is enabled.",
    result_status: safety.allowed && health.ok ? "ok" : "blocked"
  });
}

export function createDevEndpointManifest(config: DevEndpointConfig) {
  const server = createMcpServer();
  const health = getDevEndpointHealth(config);
  const readiness = createDevEndpointReadinessReport(config);
  const receipt = createDevEndpointReceiptPreview(config);
  const safety = decideDevEndpointSafety(config);
  const resources = server.listResources().map((resource) => resource.uri);
  const tools = config.toolInventory;
  return DevEndpointManifestSchema.parse({
    schema_version: "stealtheye-dev-endpoint-manifest.v1",
    endpoint_name: config.endpointName,
    mode: config.mode,
    transport_mode: config.transportMode,
    server_package: config.serverPackage,
    dev_url_placeholder: config.devUrlPlaceholder,
    fixture_endpoint_uri: config.fixtureEndpointUri,
    tunnel_provider_status: getTunnelProviderStatus(config),
    required_future_config: requiredTunnelConfig(config),
    tool_inventory_summary: { count: tools.length, unsafe_count: safety.findings.filter((finding) => finding.includes("tool denied")).length, tools },
    resource_inventory_summary: { status: "mcp_server_resources_fixture_summary", resources },
    safety_inventory_summary: { status: safety.decision, findings: safety.findings },
    health_check_status: health,
    readiness_report: readiness,
    connection_instructions: [
      "Use this manifest as a dev-only planning artifact.",
      "Keep localhost and fixture modes local until a later safe reachable endpoint is configured.",
      "Use future ChatGPT developer-mode connection steps only after tunnel configuration, health, safety, and receipt preview checks pass.",
      `Official docs checked: ${OFFICIAL_DOCS_CHECKED.join(" | ")}`
    ],
    explicit_boundary_statements: [
      "Build 15 does not deploy production infrastructure.",
      "Build 15 does not create a public production endpoint.",
      "Build 15 does not submit a public ChatGPT app.",
      "Build 15 does not add production OAuth credentials.",
      "Build 15 does not add tunnel secrets or cloud credentials.",
      "Build 15 does not expose unrestricted live write tools."
    ],
    receipt_preview: receipt
  });
}
