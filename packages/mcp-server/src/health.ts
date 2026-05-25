import { getRuntimeHealth } from "@stealtheye/mcp-runtime";
import { McpServerSchemaVersion } from "./schemas";
import { createToolRegistry } from "./tool-registry";
import { listServerResources } from "./resource-registry";

export function getMcpServerHealth() {
  const runtimeHealth = getRuntimeHealth();
  return {
    schema_version: McpServerSchemaVersion.Health,
    status: "ok",
    build: 14,
    runtime_status: runtimeHealth.status,
    official_mcp_aligned: true,
    sdk_adapter_boundary: true,
    production_ready: false,
    public_app_submitted: false,
    tool_count: createToolRegistry().length,
    resource_count: listServerResources().length,
    unrestricted_live_write_tools: false,
    destructive_tools: false,
    message: "Build 14 MCP server wrapper is available for local/dev official-MCP-aligned transport preparation."
  };
}
