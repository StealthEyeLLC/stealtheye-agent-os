import { createLocalhostDevEndpointManifest, createTunnelConfigRequiredDevEndpointManifest } from "@stealtheye/dev-endpoint";
import { createMcpServer } from "@stealtheye/mcp-server";
import { OFFICIAL_DOCS_CHECKED } from "./checklist";
import { createDeveloperModeConnectionPlan } from "./connection-plan";
import { createDeveloperModeReceiptPreview } from "./receipt";
import { decideDeveloperModeSafety } from "./safety";
import { ManifestSchema, ReadinessReportSchema, type InventoryItem } from "./schemas";

function toInventoryItem(tool: any): InventoryItem {
  return {
    name: tool.name,
    sourcePackage: tool.sourcePackage ?? "@stealtheye/mcp-server",
    readOnly: tool.readOnly ?? tool.safety?.readOnly ?? true,
    previewOnly: tool.previewOnly ?? tool.safety?.previewOnly ?? true,
    fixtureOnly: tool.fixtureOnly ?? tool.safety?.fixtureOnly ?? true,
    unrestrictedLiveWrite: tool.unrestrictedLiveWrite ?? false,
    destructive: tool.destructive ?? false,
    productionMutation: tool.productionMutation ?? false,
    protectedBranchMutation: tool.protectedBranchMutation ?? false,
    secretAccess: tool.secretAccess ?? false,
    customerData: tool.customerData ?? false,
    moneyMovement: tool.moneyMovement ?? false
  };
}

export function createDeveloperModeReadinessReport(plan = createDeveloperModeConnectionPlan(), inventory?: InventoryItem[]) {
  const tools = inventory ?? createMcpServer().listTools().map(toInventoryItem);
  const safety = decideDeveloperModeSafety(plan, tools);
  const findings = [...safety.findings];
  const readyLocal = safety.allowed && plan.fixture_only && plan.connection_stage !== "prerequisites";
  const readyManualLater = readyLocal && (plan.connection_stage === "endpoint_ready" || plan.connection_stage === "app_manifest_ready" || plan.connection_stage === "connect_from_chatgpt" || plan.connection_stage === "test_integration");
  return ReadinessReportSchema.parse({
    ready_for_local_developer_mode_plan: readyLocal,
    ready_for_manual_chatgpt_dev_connection_later: readyManualLater,
    blocked_for_public_submission: true,
    blocked_for_production: true,
    findings,
    required_next_steps: [
      "Keep Build 16 fixture/planning-only; do not perform a real ChatGPT connection.",
      "Configure a safe reachable dev endpoint in a later build without committing credential material.",
      "Run manual ChatGPT developer-mode connection only after endpoint health, safety inventory, receipt preview, and official-doc checklist remain green.",
      "Keep public app submission blocked until a later explicit review."
    ]
  });
}

export function createDeveloperModeConnectionManifest(options: { tunnelConfigRequired?: boolean; stage?: Parameters<typeof createDeveloperModeConnectionPlan>[0] } = {}) {
  const endpoint = options.tunnelConfigRequired ? createTunnelConfigRequiredDevEndpointManifest() : createLocalhostDevEndpointManifest();
  const mcp = createMcpServer();
  const plan = createDeveloperModeConnectionPlan(options.stage ?? "app_manifest_ready");
  const tools = mcp.listTools().map(toInventoryItem);
  const resources = mcp.listResources().map((resource: any) => resource.uri);
  const safety = decideDeveloperModeSafety(plan, tools);
  const readiness = createDeveloperModeReadinessReport(plan, tools);
  const receipt = createDeveloperModeReceiptPreview(plan, safety, readiness);
  return ManifestSchema.parse({
    schema_version: "stealtheye-chatgpt-dev-connection-manifest.v1",
    app_name: plan.app_name,
    server_package: plan.server_package,
    dev_endpoint_package: plan.dev_endpoint_package,
    connection_package: plan.connection_package,
    connection_stage: plan.connection_stage,
    endpoint_readiness_summary: `${endpoint.endpoint_name} mode=${endpoint.mode}; live endpoint disabled or placeholder-only; ${endpoint.readiness_report.blocked_for_public_submission ? "public submission blocked" : "public submission not blocked"}.`,
    mcp_server_safety_inventory_summary: { status: safety.decision, findings: safety.findings },
    tool_inventory_summary: { count: tools.length, unsafe_count: safety.findings.filter((finding) => finding.startsWith("tool denied")).length, tools },
    resource_inventory_summary: { count: resources.length, resources },
    developer_mode_checklist: plan.checklist,
    test_integration_checklist: plan.checklist.test_integration,
    submit_app_future_checklist: plan.checklist.submit_app_future,
    known_gaps: [
      "Build 16 does not perform a real ChatGPT developer-mode connection.",
      "No reachable public dev endpoint, tunnel credential, production domain, real app ID, or OAuth production client is committed.",
      "Public app submission remains future/blocked.",
      "No durable developer-mode connection receipt ledger is added."
    ],
    explicit_boundary_statements: plan.boundary_statements,
    official_docs_checked: [...OFFICIAL_DOCS_CHECKED],
    readiness_report: readiness,
    safety_decision: safety,
    receipt_preview: receipt
  });
}
