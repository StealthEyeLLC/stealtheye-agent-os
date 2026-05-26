import { z } from "zod";

export const DevEndpointModeSchema = z.enum(["disabled", "localhost_only", "tunnel_config_required", "reachable_dev_preview", "hosted_future"]);
export type DevEndpointMode = z.infer<typeof DevEndpointModeSchema>;

export const DevTunnelProviderSchema = z.enum(["none", "cloudflare_tunnel_future", "ngrok_future", "localhost_forward_future", "custom_future"]);
export type DevTunnelProvider = z.infer<typeof DevTunnelProviderSchema>;

export const DevEndpointSafetyPolicySchema = z.object({
  allowDisabled: z.boolean().default(true),
  allowLocalhostOnly: z.boolean().default(true),
  allowTunnelConfigRequired: z.boolean().default(true),
  allowReachableDevPreview: z.boolean().default(false),
  allowHostedFuture: z.boolean().default(false),
  requirePlaceholderTunnelConfig: z.boolean().default(true),
  requireHealthCheck: z.boolean().default(true),
  requireReceiptPreview: z.boolean().default(true),
  requireSafetyInventory: z.boolean().default(true),
  denyProductionMode: z.boolean().default(true),
  denyPublicProductionDomain: z.boolean().default(true),
  denyCredentialMaterial: z.boolean().default(true),
  denyUnrestrictedLiveWriteTools: z.boolean().default(true),
  denyDestructiveOperations: z.boolean().default(true),
  denyCustomerData: z.boolean().default(true),
  denyMoneyMovement: z.boolean().default(true)
});
export type DevEndpointSafetyPolicy = z.infer<typeof DevEndpointSafetyPolicySchema>;

export const ToolInventorySummarySchema = z.object({
  name: z.string(),
  sourcePackage: z.string().default("@stealtheye/mcp-server"),
  readOnly: z.boolean().default(true),
  previewOnly: z.boolean().default(true),
  fixtureOnly: z.boolean().default(true),
  unrestrictedLiveWrite: z.boolean().default(false),
  destructive: z.boolean().default(false),
  productionMutation: z.boolean().default(false),
  protectedBranchMutation: z.boolean().default(false),
  secretAccess: z.boolean().default(false),
  customerData: z.boolean().default(false),
  moneyMovement: z.boolean().default(false)
});
export type ToolInventorySummary = z.infer<typeof ToolInventorySummarySchema>;

export const DevEndpointConfigSchema = z.object({
  endpointName: z.string().min(1).default("StealthEye Agent OS Dev Endpoint"),
  mode: DevEndpointModeSchema,
  tunnelProvider: DevTunnelProviderSchema.default("none"),
  transportMode: z.enum(["in_process", "stdio_dev", "http_dev_preview", "hosted_future"]).default("http_dev_preview"),
  serverPackage: z.string().default("@stealtheye/mcp-server"),
  devUrlPlaceholder: z.string().optional(),
  fixtureEndpointUri: z.string().default("dev-endpoint://fixture/stealtheye-agent-os"),
  requiredFutureConfig: z.array(z.string()).default([]),
  placeholderOnly: z.boolean().default(true),
  productionMode: z.boolean().default(false),
  publicProductionDomain: z.string().optional(),
  oauthProductionClientId: z.string().optional(),
  oauthProductionClientSecret: z.string().optional(),
  tunnelAuthToken: z.string().optional(),
  cloudCredential: z.string().optional(),
  containsCustomerData: z.boolean().default(false),
  moneyMovementEnabled: z.boolean().default(false),
  materialExternalSendsEnabled: z.boolean().default(false),
  productionDeploymentEnabled: z.boolean().default(false),
  destructiveOperationsEnabled: z.boolean().default(false),
  protectedBranchMutationEnabled: z.boolean().default(false),
  toolInventory: z.array(ToolInventorySummarySchema).default([]),
  safetyPolicy: DevEndpointSafetyPolicySchema.default({})
});
export type DevEndpointConfig = z.infer<typeof DevEndpointConfigSchema>;

export const DevEndpointHealthSchema = z.object({
  ok: z.boolean(),
  status: z.enum(["ok", "degraded", "blocked"]),
  checkedAt: z.string(),
  serverMetadataPresent: z.boolean(),
  toolRegistryPresent: z.boolean(),
  safetyInventoryPresent: z.boolean(),
  receiptPreviewAvailable: z.boolean(),
  notes: z.array(z.string())
});
export type DevEndpointHealth = z.infer<typeof DevEndpointHealthSchema>;

export const DevEndpointSafetyDecisionSchema = z.object({
  allowed: z.boolean(),
  decision: z.enum(["allow", "deny"]),
  findings: z.array(z.string()),
  deniedCategories: z.array(z.string()),
  policy: DevEndpointSafetyPolicySchema
});
export type DevEndpointSafetyDecision = z.infer<typeof DevEndpointSafetyDecisionSchema>;

export const DevEndpointReadinessReportSchema = z.object({
  ready_for_local_dev: z.boolean(),
  ready_for_tunnel_config: z.boolean(),
  blocked_for_public_submission: z.boolean(),
  blocked_for_production: z.boolean(),
  findings: z.array(z.string()),
  required_next_steps: z.array(z.string())
});
export type DevEndpointReadinessReport = z.infer<typeof DevEndpointReadinessReportSchema>;

export const DevEndpointReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-dev-endpoint-receipt-preview.v1"),
  endpoint_mode: DevEndpointModeSchema,
  tunnel_provider: DevTunnelProviderSchema,
  server_metadata_summary: z.string(),
  health_summary: z.string(),
  safety_decision: z.enum(["allow", "deny"]),
  readiness_status: z.string(),
  no_secret_statement: z.string(),
  no_production_statement: z.string(),
  no_oauth_production_statement: z.string(),
  no_public_app_submission_statement: z.string(),
  no_money_statement: z.string(),
  result_status: z.enum(["ok", "blocked"])
});
export type DevEndpointReceiptPreview = z.infer<typeof DevEndpointReceiptPreviewSchema>;

export const DevEndpointManifestSchema = z.object({
  schema_version: z.literal("stealtheye-dev-endpoint-manifest.v1"),
  endpoint_name: z.string(),
  mode: DevEndpointModeSchema,
  transport_mode: z.string(),
  server_package: z.string(),
  dev_url_placeholder: z.string().optional(),
  fixture_endpoint_uri: z.string(),
  tunnel_provider_status: z.object({ provider: DevTunnelProviderSchema, status: z.string(), live_enabled: z.boolean(), placeholder_only: z.boolean() }),
  required_future_config: z.array(z.string()),
  tool_inventory_summary: z.object({ count: z.number(), unsafe_count: z.number(), tools: z.array(ToolInventorySummarySchema) }),
  resource_inventory_summary: z.object({ status: z.string(), resources: z.array(z.string()) }),
  safety_inventory_summary: z.object({ status: z.string(), findings: z.array(z.string()) }),
  health_check_status: DevEndpointHealthSchema,
  readiness_report: DevEndpointReadinessReportSchema,
  connection_instructions: z.array(z.string()),
  explicit_boundary_statements: z.array(z.string()),
  receipt_preview: DevEndpointReceiptPreviewSchema
});
export type DevEndpointManifest = z.infer<typeof DevEndpointManifestSchema>;
