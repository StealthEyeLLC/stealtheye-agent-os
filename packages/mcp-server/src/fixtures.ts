export const MCP_SERVER_ID = "mcp-server:stealtheye-agent-os:build-14:official-transport-adapter";
export const MCP_SERVER_NAME = "StealthEye Agent OS MCP Server";
export const MCP_SERVER_VERSION = "0.1.0";
export const MCP_PROTOCOL_VERSION = "2025-06-18";
export const MCP_SERVER_NOW = "2026-01-01T00:00:00.000Z";

export const OFFICIAL_DOCS_CHECKED = [
  "OpenAI Apps SDK docs: MCP server patterns, tool registration metadata, and developer-mode connection model.",
  "Model Context Protocol specification: base protocol metadata, tools list/call, resources list/read, and transport concepts.",
  "Model Context Protocol specification: stdio and Streamable HTTP transport guidance."
] as const;

export const TRANSPORT_MODES = ["in_process", "stdio_dev", "http_dev_preview", "hosted_future"] as const;

export const MCP_SERVER_RESOURCE_URIS = {
  metadata: "app://stealtheye-agent-os/mcp-server/metadata",
  health: "app://stealtheye-agent-os/mcp-server/health",
  capabilities: "app://stealtheye-agent-os/mcp-server/capabilities",
  devConnectionManifest: "app://stealtheye-agent-os/mcp-server/dev-connection-manifest",
  safetyInventory: "app://stealtheye-agent-os/mcp-server/safety-inventory",
  transportDiagnostics: "app://stealtheye-agent-os/mcp-server/transport-diagnostics"
} as const;

export const FORBIDDEN_MANIFEST_PATTERNS = [
  /client_secret/i,
  /private_key/i,
  /oauth.*secret/i,
  /token/i,
  /production endpoint/i,
  /public deployed app/i,
  /cloud account/i,
  /customer data/i
] as const;
