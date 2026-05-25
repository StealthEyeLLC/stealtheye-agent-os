import { z } from "zod";
export const McpRuntimeSchemaVersion = {
  RuntimeToolDescriptor: "stealtheye-mcp-runtime-tool-descriptor.v1",
  RuntimeToolCallResult: "stealtheye-mcp-runtime-tool-call-result.v1",
  RuntimeReceiptPreview: "stealtheye-mcp-runtime-receipt-preview.v1",
  RuntimeResourceDescriptor: "stealtheye-mcp-runtime-resource-descriptor.v1",
  RuntimeResourceReadResult: "stealtheye-mcp-runtime-resource-read-result.v1",
  RuntimeMetadata: "stealtheye-mcp-runtime-metadata.v1",
  RuntimeHealth: "stealtheye-mcp-runtime-health.v1",
  RuntimeCapabilities: "stealtheye-mcp-runtime-capabilities.v1",
  DevModeConnectionInfo: "stealtheye-mcp-runtime-dev-mode-connection.v1"
} as const;
export const RuntimeLiveCapabilityStatusSchema = z.enum(["disabled", "fixture_only", "read_only_live", "config_required"]);
export const RuntimeToolDescriptorSchema = z.object({schema_version:z.literal(McpRuntimeSchemaVersion.RuntimeToolDescriptor),name:z.string(),description:z.string(),inputSchema:z.record(z.unknown()),outputSchema:z.record(z.unknown()),annotations:z.object({readOnlyHint:z.boolean(),destructiveHint:z.literal(false),openWorldHint:z.literal(false),idempotentHint:z.literal(true)}),riskTier:z.string(),safety:z.object({readOnly:z.boolean(),previewOnly:z.boolean(),fixtureOnly:z.boolean(),destructive:z.literal(false),live:z.boolean(),liveWrite:z.literal(false).default(false),externalSideEffect:z.literal(false).default(false),liveCapabilityStatus:RuntimeLiveCapabilityStatusSchema,allowedEffects:z.array(z.string()),hardStopCategories:z.array(z.string()),receiptExpectations:z.array(z.string()),evidenceExpectations:z.array(z.string())}),mcp_compatible:z.literal(true),app_host_tool:z.boolean(),repo_status_tool:z.boolean().default(false),memory_graph_tool:z.boolean().default(false),codeops_write_tool:z.boolean().default(false)});
export const RuntimeReceiptPreviewSchema = z.object({schema_version:z.literal(McpRuntimeSchemaVersion.RuntimeReceiptPreview),receipt_event_id:z.string(),runtime_id:z.string(),tool_name:z.string(),actor_id:z.string(),timestamp:z.string(),input_summary:z.string(),output_summary:z.string(),status:z.enum(["ok","error"]),evidence_refs:z.array(z.string()),no_live_side_effects:z.literal(true),public_safe:z.literal(true),receipt_replay_event:z.unknown().optional()});
export const RuntimeToolCallResultSchema = z.object({schema_version:z.literal(McpRuntimeSchemaVersion.RuntimeToolCallResult),tool_name:z.string(),ok:z.boolean(),structuredContent:z.unknown(),content:z.array(z.object({type:z.literal("text"),text:z.string()})),receipt:z.unknown(),_meta:z.object({runtime_id:z.string(),read_only:z.boolean(),preview_only:z.boolean(),fixture_only:z.boolean(),live_write:z.literal(false).default(false),external_side_effect:z.literal(false).default(false),live_capability_status:RuntimeLiveCapabilityStatusSchema})});
export const RuntimeResourceDescriptorSchema = z.object({schema_version:z.literal(McpRuntimeSchemaVersion.RuntimeResourceDescriptor),uri:z.string(),name:z.string(),description:z.string(),mimeType:z.literal("application/json"),readOnly:z.literal(true),fixtureOnly:z.literal(true),public_safe:z.literal(true)});
export const RuntimeResourceReadResultSchema = z.object({schema_version:z.literal(McpRuntimeSchemaVersion.RuntimeResourceReadResult),uri:z.string(),mimeType:z.literal("application/json"),contents:z.unknown(),public_safe:z.literal(true),readOnly:z.literal(true)});
export type RuntimeToolDescriptor = z.infer<typeof RuntimeToolDescriptorSchema>;
export type RuntimeToolCallResult = z.infer<typeof RuntimeToolCallResultSchema>;
export type RuntimeResourceDescriptor = z.infer<typeof RuntimeResourceDescriptorSchema>;
export type RuntimeResourceReadResult = z.infer<typeof RuntimeResourceReadResultSchema>;
