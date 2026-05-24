import { z } from "zod";
import { callAppHostRuntimeTool, listAppHostRuntimeTools } from "./app-host-adapter";
import { MCP_RUNTIME_ID } from "./fixtures";
import { createRuntimeReceiptPreview } from "./receipts";
import { McpRuntimeSchemaVersion, RuntimeToolCallResultSchema, type RuntimeToolCallResult, type RuntimeToolDescriptor } from "./schemas";
export function listRuntimeTools(): RuntimeToolDescriptor[] { return listAppHostRuntimeTools(); }
export function findRuntimeTool(name: string): RuntimeToolDescriptor | undefined { return listRuntimeTools().find((tool) => tool.name === name); }
export function callRuntimeTool(name: string, input: unknown = {}): RuntimeToolCallResult {
  const tool = findRuntimeTool(name);
  if (!tool) throw new Error(`Unknown runtime tool: ${name}`);
  try {
    const structuredContent = callAppHostRuntimeTool(name, input);
    const receipt = createRuntimeReceiptPreview(name, input, structuredContent, "ok");
    return RuntimeToolCallResultSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeToolCallResult, tool_name: name, ok: true, structuredContent, content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }], receipt, _meta: { runtime_id: MCP_RUNTIME_ID, read_only: true, preview_only: tool.safety.previewOnly, fixture_only: tool.safety.fixtureOnly, live_capability_status: "disabled" } });
  } catch (error) {
    if (error instanceof z.ZodError) throw error;
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
