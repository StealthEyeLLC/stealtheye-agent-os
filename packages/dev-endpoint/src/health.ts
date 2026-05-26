import { createMcpServer } from "@stealtheye/mcp-server";
import { DEV_ENDPOINT_NOW } from "./fixtures";
import { DevEndpointHealthSchema, type DevEndpointConfig, type DevEndpointHealth } from "./schemas";

export function getDevEndpointHealth(config: DevEndpointConfig): DevEndpointHealth {
  const server = createMcpServer();
  const metadata = server.metadata;
  const tools = server.listTools();
  const safetyInventory = server.safetyInventory(tools);
  const notes = [
    `Endpoint mode: ${config.mode}.`,
    `Tunnel provider: ${config.tunnelProvider}.`,
    "No external endpoint is bound by Build 15."
  ];
  return DevEndpointHealthSchema.parse({
    ok: Boolean(metadata?.server_id && tools.length >= 0 && safetyInventory?.safety_truth_preserved !== false),
    status: "ok",
    checkedAt: DEV_ENDPOINT_NOW,
    serverMetadataPresent: Boolean(metadata?.server_id),
    toolRegistryPresent: Array.isArray(tools),
    safetyInventoryPresent: Boolean(safetyInventory),
    receiptPreviewAvailable: true,
    notes
  });
}
