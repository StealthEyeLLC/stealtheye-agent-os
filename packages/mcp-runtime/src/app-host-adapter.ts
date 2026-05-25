import { APP_HOST_TOOL_DESCRIPTORS, AppHostToolNameSchema, assertNoLiveWriteTools, createAppHostServer, type AppHostToolName, type ToolDescriptor } from "@stealtheye/app-host";
import { McpRuntimeSchemaVersion, RuntimeToolDescriptorSchema, type RuntimeToolDescriptor } from "./schemas";
export function createRuntimeToolDescriptor(tool: ToolDescriptor): RuntimeToolDescriptor {
  return RuntimeToolDescriptorSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeToolDescriptor, name: tool.name, description: tool.description, inputSchema: tool.input_schema, outputSchema: tool.output_schema, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true }, riskTier: tool.risk_tier, safety: { readOnly: true, previewOnly: tool.safety.previewOnly, fixtureOnly: tool.safety.fixtureOnly, destructive: false, live: false, liveWrite: false, externalSideEffect: false, liveCapabilityStatus: "disabled", allowedEffects: tool.allowed_effects, hardStopCategories: tool.hard_stops, receiptExpectations: tool.receipt_expectations, evidenceExpectations: tool.evidence_expectations }, mcp_compatible: true, app_host_tool: true, repo_status_tool: false });
}
export function listAppHostRuntimeTools(): RuntimeToolDescriptor[] { return APP_HOST_TOOL_DESCRIPTORS.map(createRuntimeToolDescriptor); }
export function callAppHostRuntimeTool(name: string, input: unknown = {}) { const parsedName = AppHostToolNameSchema.parse(name) as AppHostToolName; return createAppHostServer().callTool({ name: parsedName, input }); }
export function assertRuntimeToolDescriptorSafe(tool: RuntimeToolDescriptor): boolean {
  const commonSafe = tool.annotations.readOnlyHint === true && tool.annotations.destructiveHint === false && tool.annotations.openWorldHint === false && tool.safety.readOnly === true && tool.safety.destructive === false && tool.safety.liveWrite === false && tool.safety.externalSideEffect === false;
  const previewSafe = tool.safety.live === false && tool.safety.liveCapabilityStatus === "disabled" && (tool.safety.previewOnly || tool.safety.fixtureOnly);
  const liveReadSafe = tool.safety.live === true && tool.safety.liveCapabilityStatus === "read_only_live" && !tool.safety.previewOnly && !tool.safety.destructive;
  return commonSafe && (previewSafe || liveReadSafe);
}
export function assertRuntimeToolInventorySafe(tools = listAppHostRuntimeTools()): boolean { return assertNoLiveWriteTools() && tools.every(assertRuntimeToolDescriptorSafe); }
