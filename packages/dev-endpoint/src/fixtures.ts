import type { DevEndpointConfig, DevEndpointSafetyPolicy, ToolInventorySummary } from "./schemas";

export const DEV_ENDPOINT_NOW = "2026-01-01T00:00:00.000Z";
export const DEV_ENDPOINT_NAME = "StealthEye Agent OS Dev Endpoint";
export const DEV_ENDPOINT_FIXTURE_URI = "dev-endpoint://fixture/stealtheye-agent-os";
export const LOOPBACK_MCP_URL = "http://localhost:3000/mcp";
export const LOOPBACK_MCP_URL_127 = "http://127.0.0.1:3000/mcp";

export const OFFICIAL_DOCS_CHECKED = [
  "OpenAI Apps SDK docs: MCP server concept, server setup, ChatGPT connection, testing, app submission, security and privacy.",
  "OpenAI Secure MCP Tunnel docs: tunnel behavior was checked for future dev endpoint connection planning only; no tunnel credentials or live tunnel config are committed.",
  "Model Context Protocol transport specification: stdio for local process communication and Streamable HTTP for remote HTTP connection behavior."
] as const;

export const DEFAULT_SAFETY_POLICY: DevEndpointSafetyPolicy = {
  allowDisabled: true,
  allowLocalhostOnly: true,
  allowTunnelConfigRequired: true,
  allowReachableDevPreview: false,
  allowHostedFuture: false,
  requirePlaceholderTunnelConfig: true,
  requireHealthCheck: true,
  requireReceiptPreview: true,
  requireSafetyInventory: true,
  denyProductionMode: true,
  denyPublicProductionDomain: true,
  denyCredentialMaterial: true,
  denyUnrestrictedLiveWriteTools: true,
  denyDestructiveOperations: true,
  denyCustomerData: true,
  denyMoneyMovement: true
};

export const SAFE_TOOL_INVENTORY_FIXTURE: ToolInventorySummary[] = [
  { name: "mcp.server.metadata", sourcePackage: "@stealtheye/mcp-server", readOnly: true, previewOnly: true, fixtureOnly: true, unrestrictedLiveWrite: false, destructive: false, productionMutation: false, protectedBranchMutation: false, secretAccess: false, customerData: false, moneyMovement: false },
  { name: "repo.status.read", sourcePackage: "@stealtheye/repo-status", readOnly: true, previewOnly: false, fixtureOnly: false, unrestrictedLiveWrite: false, destructive: false, productionMutation: false, protectedBranchMutation: false, secretAccess: false, customerData: false, moneyMovement: false },
  { name: "codeops.branch_write.preview", sourcePackage: "@stealtheye/codeops", readOnly: false, previewOnly: true, fixtureOnly: false, unrestrictedLiveWrite: false, destructive: false, productionMutation: false, protectedBranchMutation: false, secretAccess: false, customerData: false, moneyMovement: false }
];

export const LOCALHOST_CONFIG_FIXTURE: DevEndpointConfig = {
  endpointName: DEV_ENDPOINT_NAME,
  mode: "localhost_only",
  tunnelProvider: "none",
  transportMode: "http_dev_preview",
  serverPackage: "@stealtheye/mcp-server",
  devUrlPlaceholder: LOOPBACK_MCP_URL,
  fixtureEndpointUri: DEV_ENDPOINT_FIXTURE_URI,
  requiredFutureConfig: [],
  placeholderOnly: true,
  productionMode: false,
  containsCustomerData: false,
  moneyMovementEnabled: false,
  materialExternalSendsEnabled: false,
  productionDeploymentEnabled: false,
  destructiveOperationsEnabled: false,
  protectedBranchMutationEnabled: false,
  toolInventory: SAFE_TOOL_INVENTORY_FIXTURE,
  safetyPolicy: DEFAULT_SAFETY_POLICY
};

export const DISABLED_CONFIG_FIXTURE: DevEndpointConfig = { ...LOCALHOST_CONFIG_FIXTURE, mode: "disabled", tunnelProvider: "none", devUrlPlaceholder: undefined };

export const TUNNEL_CONFIG_REQUIRED_FIXTURE: DevEndpointConfig = {
  ...LOCALHOST_CONFIG_FIXTURE,
  mode: "tunnel_config_required",
  tunnelProvider: "custom_future",
  devUrlPlaceholder: DEV_ENDPOINT_FIXTURE_URI,
  requiredFutureConfig: ["reachable dev HTTPS endpoint", "provider-specific tunnel config", "ChatGPT developer-mode connection validation"],
  placeholderOnly: true
};
