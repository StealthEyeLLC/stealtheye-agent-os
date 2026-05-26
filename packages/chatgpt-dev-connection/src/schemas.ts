import { z } from "zod";

export const ConnectionStageSchema = z.enum(["prerequisites", "endpoint_ready", "app_manifest_ready", "connect_from_chatgpt", "test_integration", "submit_app_future"]);
export type ConnectionStage = z.infer<typeof ConnectionStageSchema>;

export const InventoryItemSchema = z.object({
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
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const SafetyPolicySchema = z.object({
  allowFixtureOnlyPlan: z.boolean().default(true),
  allowLocalDevManifest: z.boolean().default(true),
  allowDisabledOrLocalhostEndpoint: z.boolean().default(true),
  allowTunnelConfigRequiredPlaceholder: z.boolean().default(true),
  allowPublicSafeToolInventory: z.boolean().default(true),
  denyProductionAppSubmission: z.boolean().default(true),
  denyRealAppIds: z.boolean().default(true),
  denyRealOAuthClientsOrSecrets: z.boolean().default(true),
  denyProductionDomains: z.boolean().default(true),
  denyRealPublicEndpointUrls: z.boolean().default(true),
  denyTunnelAuthTokens: z.boolean().default(true),
  denyCloudCredentials: z.boolean().default(true),
  denyUnrestrictedLiveWriteTools: z.boolean().default(true),
  denyProtectedBranchMutationTools: z.boolean().default(true),
  denyDestructiveTools: z.boolean().default(true),
  denyProductionMutationTools: z.boolean().default(true),
  denyCustomerPrivateData: z.boolean().default(true),
  denyMoneyMovement: z.boolean().default(true),
  requireDevEndpointReadiness: z.boolean().default(true),
  requireMcpServerSafetyInventory: z.boolean().default(true),
  requireReceiptPreview: z.boolean().default(true),
  requireBoundaryStatements: z.boolean().default(true)
});
export type ChatGptDeveloperModeSafetyPolicy = z.infer<typeof SafetyPolicySchema>;

export const ChecklistSchema = z.object({
  schema_version: z.literal("stealtheye-chatgpt-dev-connection-checklist.v1"),
  stages: z.array(ConnectionStageSchema),
  prerequisites: z.array(z.string()),
  endpoint_ready: z.array(z.string()),
  app_manifest_ready: z.array(z.string()),
  connect_from_chatgpt: z.array(z.string()),
  test_integration: z.array(z.string()),
  submit_app_future: z.array(z.string()),
  official_docs_checked: z.array(z.string())
});
export type ChatGptDeveloperModeConnectionChecklist = z.infer<typeof ChecklistSchema>;

export const ConnectionPlanSchema = z.object({
  schema_version: z.literal("stealtheye-chatgpt-dev-connection-plan.v1"),
  app_name: z.string(),
  server_package: z.literal("@stealtheye/mcp-server"),
  dev_endpoint_package: z.literal("@stealtheye/dev-endpoint"),
  connection_package: z.literal("@stealtheye/chatgpt-dev-connection"),
  connection_stage: ConnectionStageSchema,
  fixture_only: z.boolean(),
  endpoint_placeholder: z.string(),
  chatgpt_dev_uri: z.string(),
  local_mcp_url: z.string(),
  public_app_submission: z.boolean(),
  production_ready: z.boolean(),
  oauth_production_configured: z.boolean(),
  real_app_id_present: z.boolean(),
  boundary_statements: z.array(z.string()),
  checklist: ChecklistSchema
});
export type ChatGptDeveloperModeConnectionPlan = z.infer<typeof ConnectionPlanSchema>;

export const SafetyDecisionSchema = z.object({
  allowed: z.boolean(),
  decision: z.enum(["allow", "deny"]),
  findings: z.array(z.string()),
  denied_categories: z.array(z.string()),
  policy: SafetyPolicySchema
});
export type ChatGptDeveloperModeSafetyDecision = z.infer<typeof SafetyDecisionSchema>;

export const ReadinessReportSchema = z.object({
  ready_for_local_developer_mode_plan: z.boolean(),
  ready_for_manual_chatgpt_dev_connection_later: z.boolean(),
  blocked_for_public_submission: z.boolean(),
  blocked_for_production: z.boolean(),
  findings: z.array(z.string()),
  required_next_steps: z.array(z.string())
});
export type ChatGptDeveloperModeReadinessReport = z.infer<typeof ReadinessReportSchema>;

export const ReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-chatgpt-dev-connection-receipt-preview.v1"),
  connection_stage: ConnectionStageSchema,
  endpoint_readiness_summary: z.string(),
  mcp_server_safety_summary: z.string(),
  app_manifest_summary: z.string(),
  test_integration_status: z.string(),
  safety_decision: z.enum(["allow", "deny"]),
  readiness_status: z.string(),
  no_secret_statement: z.string(),
  no_production_statement: z.string(),
  no_oauth_production_statement: z.string(),
  no_public_app_submission_statement: z.string(),
  no_money_statement: z.string(),
  result_status: z.enum(["ok", "blocked"])
});
export type ChatGptDeveloperModeReceiptPreview = z.infer<typeof ReceiptPreviewSchema>;

export const ManifestSchema = z.object({
  schema_version: z.literal("stealtheye-chatgpt-dev-connection-manifest.v1"),
  app_name: z.string(),
  server_package: z.literal("@stealtheye/mcp-server"),
  dev_endpoint_package: z.literal("@stealtheye/dev-endpoint"),
  connection_package: z.literal("@stealtheye/chatgpt-dev-connection"),
  connection_stage: ConnectionStageSchema,
  endpoint_readiness_summary: z.string(),
  mcp_server_safety_inventory_summary: z.object({ status: z.string(), findings: z.array(z.string()) }),
  tool_inventory_summary: z.object({ count: z.number(), unsafe_count: z.number(), tools: z.array(InventoryItemSchema) }),
  resource_inventory_summary: z.object({ count: z.number(), resources: z.array(z.string()) }),
  developer_mode_checklist: ChecklistSchema,
  test_integration_checklist: z.array(z.string()),
  submit_app_future_checklist: z.array(z.string()),
  known_gaps: z.array(z.string()),
  explicit_boundary_statements: z.array(z.string()),
  official_docs_checked: z.array(z.string()),
  readiness_report: ReadinessReportSchema,
  safety_decision: SafetyDecisionSchema,
  receipt_preview: ReceiptPreviewSchema
});
export type ChatGptDeveloperModeConnectionManifest = z.infer<typeof ManifestSchema>;
