import { z } from "zod";
import { callAppHostRuntimeTool, listAppHostRuntimeTools } from "./app-host-adapter";
import { callCodeOpsWriteRuntimeTool, isCodeOpsWriteRuntimeToolName, listCodeOpsWriteRuntimeTools } from "./codeops-write-adapter";
import { MCP_RUNTIME_ID } from "./fixtures";
import { callMemoryGraphRuntimeTool, isMemoryGraphRuntimeToolName, listMemoryGraphRuntimeTools } from "./memory-graph-adapter";
import { createRuntimeReceiptPreview } from "./receipts";
import { callRepoStatusRuntimeTool, isRepoStatusRuntimeToolName, listRepoStatusRuntimeTools, type RepoStatusRuntimeOptions } from "./repo-status-adapter";
import { McpRuntimeSchemaVersion, RuntimeToolCallResultSchema, type RuntimeToolCallResult, type RuntimeToolDescriptor } from "./schemas";
export interface RuntimeToolOptions extends RepoStatusRuntimeOptions {}
export function listRuntimeTools(): RuntimeToolDescriptor[] { return [...listAppHostRuntimeTools(), ...listRepoStatusRuntimeTools(), ...listMemoryGraphRuntimeTools(), ...listCodeOpsWriteRuntimeTools()]; }
export function findRuntimeTool(name: string): RuntimeToolDescriptor | undefined { return listRuntimeTools().find((tool) => tool.name === name); }
function callResult(name: string, tool: RuntimeToolDescriptor, structuredContent: unknown, receipt: unknown): RuntimeToolCallResult { return RuntimeToolCallResultSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeToolCallResult, tool_name: name, ok: true, structuredContent, content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }], receipt, _meta: { runtime_id: MCP_RUNTIME_ID, read_only: tool.safety.readOnly, preview_only: tool.safety.previewOnly, fixture_only: tool.safety.fixtureOnly, live_write: false, external_side_effect: false, live_capability_status: tool.safety.liveCapabilityStatus } }); }
export async function callRuntimeTool(name: string, input: unknown = {}, options: RuntimeToolOptions = {}): Promise<RuntimeToolCallResult> {
  const tool = findRuntimeTool(name);
  if (!tool) throw new Error(`Unknown runtime tool: ${name}`);
  try {
    if (isRepoStatusRuntimeToolName(name)) { const structuredContent = await callRepoStatusRuntimeTool(name, input, options); return callResult(name, tool, structuredContent, structuredContent.receipt); }
    if (isMemoryGraphRuntimeToolName(name)) { const structuredContent = callMemoryGraphRuntimeTool(name, input); const receipt = createRuntimeReceiptPreview(name, input, structuredContent, "ok"); return callResult(name, tool, structuredContent, receipt); }
    if (isCodeOpsWriteRuntimeToolName(name)) { const structuredContent = callCodeOpsWriteRuntimeTool(name, input); const receipt = createRuntimeReceiptPreview(name, input, structuredContent, "ok"); return callResult(name, tool, structuredContent, receipt); }
    const structuredContent = callAppHostRuntimeTool(name, input);
    const receipt = createRuntimeReceiptPreview(name, input, structuredContent, "ok");
    return callResult(name, tool, structuredContent, receipt);
  } catch (error) { if (error instanceof z.ZodError) throw error; throw new Error(error instanceof Error ? error.message : String(error)); }
}
