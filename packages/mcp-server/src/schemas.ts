import { z } from "zod";
import { TRANSPORT_MODES } from "./fixtures";

export const McpServerSchemaVersion = {
  ServerMetadata: "stealtheye-mcp-server-metadata.v1",
  ProtocolMetadata: "stealtheye-mcp-server-protocol-metadata.v1",
  ToolDescriptor: "stealtheye-mcp-server-tool-descriptor.v1",
  ResourceDescriptor: "stealtheye-mcp-server-resource-descriptor.v1",
  ToolCallReceiptPreview: "stealtheye-mcp-server-tool-call-receipt-preview.v1",
  Health: "stealtheye-mcp-server-health.v1",
  Capabilities: "stealtheye-mcp-server-capabilities.v1",
  TransportDiagnostics: "stealtheye-mcp-server-transport-diagnostics.v1",
  DevConnectionManifest: "stealtheye-mcp-server-dev-connection-manifest.v1",
  SafetyInventory: "stealtheye-mcp-server-safety-inventory.v1"
} as const;

export const TransportModeSchema = z.enum(TRANSPORT_MODES);
export type TransportMode = z.infer<typeof TransportModeSchema>;

export const SafetyDescriptorSchema = z.object({
  readOnly: z.boolean(),
  previewOnly: z.boolean(),
  fixtureOnly: z.boolean(),
  destructive: z.literal(false),
  live: z.boolean(),
  liveWrite: z.literal(false),
  unrestrictedLiveWrite: z.literal(false).default(false),
  externalSideEffect: z.literal(false),
  productionMutation: z.literal(false),
  protectedBranchMutation: z.literal(false),
  secretAccess: z.literal(false),
  customerData: z.literal(false),
  moneyMovement: z.literal(false),
  liveCapabilityStatus: z.enum(["disabled", "fixture_only", "read_only_live", "config_required"]),
  allowedEffects: z.array(z.string()),
  hardStopCategories: z.array(z.string()),
  receiptExpectations: z.array(z.string()),
  evidenceExpectations: z.array(z.string())
});
export type SafetyDescriptor = z.infer<typeof SafetyDescriptorSchema>;

export const McpServerToolDescriptorSchema = z.object({
  schema_version: z.literal(McpServerSchemaVersion.ToolDescriptor),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  inputSchema: z.record(z.unknown()),
  outputSchema: z.record(z.unknown()),
  annotations: z.object({
    readOnlyHint: z.boolean(),
    destructiveHint: z.literal(false),
    openWorldHint: z.literal(false),
    idempotentHint: z.literal(true)
  }),
  safety: SafetyDescriptorSchema,
  sourcePackage: z.string().min(1),
  officialMcpAligned: z.literal(true),
  sdkAdapterBoundary: z.literal(true)
});
export type McpServerToolDescriptor = z.infer<typeof McpServerToolDescriptorSchema>;

export const McpServerResourceDescriptorSchema = z.object({
  schema_version: z.literal(McpServerSchemaVersion.ResourceDescriptor),
  uri: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  mimeType: z.literal("application/json"),
  readOnly: z.literal(true),
  fixtureOnly: z.boolean(),
  public_safe: z.literal(true),
  sourcePackage: z.string().min(1)
});
export type McpServerResourceDescriptor = z.infer<typeof McpServerResourceDescriptorSchema>;

export const ServerMetadataSchema = z.object({
  schema_version: z.literal(McpServerSchemaVersion.ServerMetadata),
  server_id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  build: z.literal(14),
  protocol_version: z.string().min(1),
  official_mcp_aligned: z.literal(true),
  official_sdk_package_used: z.boolean(),
  sdk_adapter_boundary: z.boolean(),
  production_ready: z.literal(false),
  public_app_submitted: z.literal(false),
  unrestricted_live_write_tools: z.literal(false)
});

export const ProtocolMetadataSchema = z.object({
  protocol_version: z.string().min(1),
  transports: z.array(TransportModeSchema),
  implemented_transports: z.array(TransportModeSchema),
  modeled_future_transports: z.array(TransportModeSchema),
  methods: z.array(z.string().min(1)),
  official_docs_checked: z.array(z.string().min(1))
});

export const ToolCallReceiptPreviewSchema = z.object({
  schema_version: z.literal(McpServerSchemaVersion.ToolCallReceiptPreview),
  tool_name: z.string().min(1),
  input_summary: z.string(),
  output_summary: z.string(),
  safety_descriptor: SafetyDescriptorSchema,
  transport_mode: TransportModeSchema,
  timestamp: z.string(),
  fixture_live_capability_status: z.string(),
  no_secret_statement: z.literal("No secrets, credentials, tokens, private keys, or OAuth secrets were requested or exposed."),
  no_production_statement: z.literal("No production endpoint, production deployment, production mutation, or public app submission occurred."),
  no_money_statement: z.literal("No money movement, billing mutation, purchase, subscription, or refund occurred."),
  result_status: z.enum(["ok", "error"]),
  runtime_receipt: z.unknown().optional()
});
export type ToolCallReceiptPreview = z.infer<typeof ToolCallReceiptPreviewSchema>;
