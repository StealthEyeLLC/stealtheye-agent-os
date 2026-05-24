import { createReceiptEvent } from "@stealtheye/receipts-replay";
import { MCP_RUNTIME_ACTOR_ID, MCP_RUNTIME_ID, MCP_RUNTIME_NOW } from "./fixtures";
import { McpRuntimeSchemaVersion, RuntimeReceiptPreviewSchema } from "./schemas";
function summarizeInput(input: unknown): string { return input && typeof input === "object" && !Array.isArray(input) ? Object.keys(input as Record<string, unknown>).sort().join(", ") || "empty object" : typeof input; }
function summarizeOutput(output: unknown): string { return output && typeof output === "object" && !Array.isArray(output) ? Object.keys(output as Record<string, unknown>).sort().slice(0, 8).join(", ") || "empty object" : typeof output; }
export function createRuntimeReceiptPreview(tool_name: string, input: unknown, output: unknown, status: "ok" | "error" = "ok") {
  const safeName = tool_name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const receipt_event_id = `receipt-event:mcp-runtime:${safeName}:build-10`;
  const receipt_replay_event = createReceiptEvent({ event_id: receipt_event_id, mission_id: "mission:fixture:mcp-runtime-build-10", source_subsystem: "app_host", event_type: "app_host_tool_previewed", actor_id: MCP_RUNTIME_ACTOR_ID, subject_id: tool_name, action_id: tool_name, timestamp: MCP_RUNTIME_NOW, status_before: "requested", status_after: status, summary: `Runtime preview call for ${tool_name}; no live side effects were performed.`, reason_codes: ["mcp_runtime:preview_only", "mcp_runtime:no_live_side_effects"], receipt_refs: [receipt_event_id], retention_hint: "return with in-memory runtime call result only" });
  return RuntimeReceiptPreviewSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeReceiptPreview, receipt_event_id, runtime_id: MCP_RUNTIME_ID, tool_name, actor_id: MCP_RUNTIME_ACTOR_ID, timestamp: MCP_RUNTIME_NOW, input_summary: `Public-safe input summary: ${summarizeInput(input)}.`, output_summary: `Public-safe output summary: ${summarizeOutput(output)}.`, status, evidence_refs: [], no_live_side_effects: true, public_safe: true, receipt_replay_event });
}
