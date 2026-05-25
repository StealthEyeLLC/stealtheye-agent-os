import { z } from "zod";
import { callAppHostRuntimeTool, listAppHostRuntimeTools } from "./app-host-adapter";
import { MCP_RUNTIME_ID } from "./fixtures";
import { createRuntimeReceiptPreview } from "./receipts";
import { callRepoStatusRuntimeTool, isRepoStatusRuntimeToolName, listRepoStatusRuntimeTools, type RepoStatusRuntimeOptions } from "./repo-status-adapter";
import { McpRuntimeSchemaVersion, RuntimeToolCallResultSchema, type RuntimeToolCallResult, type RuntimeToolDescriptor } from "./schemas";
export function listRuntimeTools(): RuntimeToolDescriptor[] { return [...listAppHostRuntimeTools(), ...listRepoStatusRuntimeTools()]; }
export function findRuntimeTool(name: string): RuntimeToolDescriptor | undefined { return listRuntimeTools().find((tool) => tool.name === name); }
export async function callRuntimeTool(name: string, input: unknown = {}, options: RepoStatusRuntimeOptions = {}): Promise<RuntimeToolCallResult> {
  const tool = findRuntimeTool(name);
  if (!tool) throw new Error(`Unknown runtime tool: ${name}`);
  try {
    if (isRepoStatusRuntimeToolName(name)) {
      const structuredContent = await callRepoStatusRuntimeTool(name, input, options);
      return RuntimeToolCallResultSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeToolCallResult, tool_name: name, ok: true, structuredContent, content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }], receipt: structuredContent.receipt, _meta: { runtime_id: MCP_RUNTIME_ID, read_only: true, preview_only: tool.safety.previewOnly, fixture_only: tool.safety.fixtureOnly, live_write: false, external_side_effect: false, live_capability_status: tool.safety.liveCapabilityStatus } });
    }
    const structuredContent = callAppHostRuntimeTool(name, input);
    const receipt = createRuntimeReceiptPreview(name, input, structuredContent, "ok");
    return RuntimeToolCallResultSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeToolCallResult, tool_name: name, ok: true, structuredContent, content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }], receipt, _meta: { runtime_id: MCP_RUNTIME_ID, read_only: true, preview_only: tool.safety.previewOnly, fixture_only: tool.safety.fixtureOnly, live_write: false, external_side_effect: false, live_capability_status: tool.safety.liveCapabilityStatus } });
  } catch (error) {
    if (error instanceof z.ZodError) throw error;
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
