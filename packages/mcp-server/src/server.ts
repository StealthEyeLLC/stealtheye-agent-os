import { createMcpRuntimeServer } from "@stealtheye/mcp-runtime";
import { MCP_PROTOCOL_VERSION, MCP_SERVER_ID, MCP_SERVER_NAME, MCP_SERVER_NOW, MCP_SERVER_VERSION, OFFICIAL_DOCS_CHECKED, TRANSPORT_MODES } from "./fixtures";
import { McpServerSchemaVersion, ProtocolMetadataSchema, ServerMetadataSchema, ToolCallReceiptPreviewSchema, type TransportMode } from "./schemas";
import { getMcpServerHealth } from "./health";
import { listServerResources, readServerResource } from "./resource-registry";
import { getTransportDiagnostics } from "./transport";
import { createSafetyInventory, createToolRegistry } from "./tool-registry";

export { getMcpServerHealth } from "./health";

function summarize(value: unknown): string {
  if (value && typeof value === "object" && !Array.isArray(value)) return Object.keys(value as Record<string, unknown>).sort().slice(0, 8).join(", ") || "empty object";
  return typeof value;
}

export function getServerMetadata() {
  return ServerMetadataSchema.parse({
    schema_version: McpServerSchemaVersion.ServerMetadata,
    server_id: MCP_SERVER_ID,
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
    build: 14,
    protocol_version: MCP_PROTOCOL_VERSION,
    official_mcp_aligned: true,
    official_sdk_package_used: false,
    sdk_adapter_boundary: true,
    production_ready: false,
    public_app_submitted: false,
    unrestricted_live_write_tools: false
  });
}

export function getProtocolMetadata() {
  return ProtocolMetadataSchema.parse({
    protocol_version: MCP_PROTOCOL_VERSION,
    transports: TRANSPORT_MODES,
    implemented_transports: ["in_process", "stdio_dev"],
    modeled_future_transports: ["http_dev_preview", "hosted_future"],
    methods: ["initialize", "tools/list", "tools/call", "resources/list", "resources/read", "health", "capabilities"],
    official_docs_checked: OFFICIAL_DOCS_CHECKED
  });
}

export function getMcpServerCapabilities() {
  const tools = createToolRegistry();
  const resources = listServerResources();
  return {
    schema_version: McpServerSchemaVersion.Capabilities,
    server: getServerMetadata(),
    protocol: getProtocolMetadata(),
    tool_count: tools.length,
    resource_count: resources.length,
    tool_sources: [...new Set(tools.map((tool) => tool.sourcePackage))].sort(),
    transport_modes: TRANSPORT_MODES,
    implemented_transport_modes: ["in_process", "stdio_dev"],
    modeled_future_transport_modes: ["http_dev_preview", "hosted_future"],
    unrestricted_live_write_tools: false,
    destructive_tools: false,
    production_mutation_tools: false,
    protected_branch_mutation_tools: false,
    secret_access_tools: false,
    customer_data_tools: false,
    money_movement_tools: false,
    safety_inventory: createSafetyInventory(tools)
  };
}

export async function callMcpServerTool(name: string, input: unknown = {}, transportMode: TransportMode = "in_process") {
  const tool = createToolRegistry().find((candidate) => candidate.name === name);
  if (!tool) throw new Error(`Unknown MCP server tool: ${name}`);
  const runtimeResult = await createMcpRuntimeServer().callTool(name, input);
  const receipt = ToolCallReceiptPreviewSchema.parse({
    schema_version: McpServerSchemaVersion.ToolCallReceiptPreview,
    tool_name: name,
    input_summary: `Public-safe input keys: ${summarize(input)}.`,
    output_summary: `Public-safe output keys: ${summarize(runtimeResult.structuredContent)}.`,
    safety_descriptor: tool.safety,
    transport_mode: transportMode,
    timestamp: MCP_SERVER_NOW,
    fixture_live_capability_status: tool.safety.liveCapabilityStatus,
    no_secret_statement: "No secrets, credentials, tokens, private keys, or OAuth secrets were requested or exposed.",
    no_production_statement: "No production endpoint, production deployment, production mutation, or public app submission occurred.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund occurred.",
    result_status: runtimeResult.ok ? "ok" : "error",
    runtime_receipt: runtimeResult.receipt
  });
  return { ...runtimeResult, mcp_server_receipt: receipt, transport_mode: transportMode };
}

export function createDevConnectionManifest() {
  const tools = createToolRegistry();
  const resources = listServerResources();
  return {
    schema_version: McpServerSchemaVersion.DevConnectionManifest,
    server_name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
    build: 14,
    transport_mode: "stdio_dev" as const,
    local_dev_connection_instructions: [
      "Run the workspace test-safe MCP server package in a local development shell.",
      "Use stdio developer transport or in-process adapter calls while preparing ChatGPT developer-mode wiring.",
      "Use only loopback or process-local development wiring until a later reachable dev endpoint build."
    ],
    tool_inventory: tools.map((tool) => ({ name: tool.name, sourcePackage: tool.sourcePackage, readOnly: tool.safety.readOnly, previewOnly: tool.safety.previewOnly, fixtureOnly: tool.safety.fixtureOnly, liveCapabilityStatus: tool.safety.liveCapabilityStatus })),
    resource_inventory: resources.map((resource) => ({ uri: resource.uri, sourcePackage: resource.sourcePackage, readOnly: resource.readOnly, fixtureOnly: resource.fixtureOnly })),
    safety_boundaries: [
      "No production infrastructure is deployed.",
      "No public ChatGPT app is submitted.",
      "No production OAuth client or credential material is added.",
      "No unrestricted live write tool is exposed.",
      "No protected branch mutation, destructive deletion, production mutation, customer data, or money movement is available."
    ],
    known_gaps: [
      "Official SDK package is not added in Build 14; an SDK-aligned adapter boundary is implemented instead.",
      "HTTP dev preview is modeled only and not bound to any public endpoint.",
      "Hosted/public app deployment remains future work."
    ],
    future_chatgpt_developer_mode_steps: [
      "Replace the adapter boundary with the official SDK package after dependency compatibility is verified.",
      "Add reachable dev endpoint or tunnel configuration in the next build without committing credential material.",
      "Validate ChatGPT developer-mode connection against the official Apps SDK workflow."
    ],
    contains_secret_material: false,
    contains_production_endpoint: false,
    contains_public_app_id: false,
    contains_oauth_client: false,
    production_ready: false
  };
}

export function createMcpServer() {
  return {
    metadata: getServerMetadata(),
    protocol: getProtocolMetadata(),
    health: getMcpServerHealth,
    capabilities: getMcpServerCapabilities,
    transportDiagnostics: getTransportDiagnostics,
    listTools: createToolRegistry,
    callTool: callMcpServerTool,
    listResources: listServerResources,
    readResource: readServerResource,
    safetyInventory: createSafetyInventory,
    devConnectionManifest: createDevConnectionManifest
  };
}
