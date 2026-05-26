import { z } from "zod";

export const ControlPlaneViewIdSchema = z.enum(["overview", "missions", "agents", "tools", "guard", "receipts", "replay", "memory", "repo_status", "codeops", "browserops", "worker_fleet", "mcp_server", "dev_endpoint", "chatgpt_developer_mode", "settings_safe"]);
export type ControlPlaneViewId = z.infer<typeof ControlPlaneViewIdSchema>;

export const ControlPlaneActionNameSchema = z.enum(["view_overview", "view_missions", "view_agents", "view_tools", "view_guard_decisions", "view_receipts", "view_replay", "view_memory", "view_repo_status", "view_codeops", "view_browserops", "view_worker_fleet", "view_mcp_server", "view_dev_endpoint", "view_chatgpt_developer_mode", "preview_mission_compile", "preview_guard_decision", "preview_codeops_plan", "preview_browserops_plan", "preview_memory_context", "preview_receipt_report", "refresh_fixture_state"]);
export type ControlPlaneActionName = z.infer<typeof ControlPlaneActionNameSchema>;

export const ControlPlaneActionCategorySchema = z.enum(["navigation", "fixture_preview", "readonly_summary", "refresh_fixture_state", "unknown", "forbidden"]);
export type ControlPlaneActionCategory = z.infer<typeof ControlPlaneActionCategorySchema>;

export const ControlPlanePanelSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  status: z.enum(["ok", "preview", "blocked", "future"]),
  package_refs: z.array(z.string()).default([]),
  data_classification: z.literal("public_fixture_only").default("public_fixture_only")
});
export type ControlPlanePanel = z.infer<typeof ControlPlanePanelSchema>;

export const ControlPlaneViewSchema = z.object({
  id: ControlPlaneViewIdSchema,
  title: z.string(),
  description: z.string(),
  panels: z.array(ControlPlanePanelSchema),
  default_action: ControlPlaneActionNameSchema,
  preview_only: z.boolean().default(true),
  read_only: z.boolean().default(true)
});
export type ControlPlaneView = z.infer<typeof ControlPlaneViewSchema>;

export const ControlPlaneNavigationSchema = z.object({
  schema_version: z.literal("stealtheye-control-plane-navigation.v1"),
  default_view: ControlPlaneViewIdSchema,
  views: z.array(ControlPlaneViewSchema),
  safe_settings_view: ControlPlaneViewIdSchema
});
export type ControlPlaneNavigation = z.infer<typeof ControlPlaneNavigationSchema>;

export const ControlPlaneActionSchema = z.object({
  name: ControlPlaneActionNameSchema,
  label: z.string(),
  view: ControlPlaneViewIdSchema,
  panel: z.string(),
  category: ControlPlaneActionCategorySchema,
  fixture_only: z.boolean().default(true),
  preview_only: z.boolean().default(true),
  read_only: z.boolean().default(true),
  productionDeployment: z.boolean().default(false),
  publicAppSubmission: z.boolean().default(false),
  realOAuthClient: z.boolean().default(false),
  realAppId: z.boolean().default(false),
  productionDomain: z.boolean().default(false),
  realPublicEndpoint: z.boolean().default(false),
  unrestrictedLiveWrite: z.boolean().default(false),
  protectedBranchMutation: z.boolean().default(false),
  destructive: z.boolean().default(false),
  productionMutation: z.boolean().default(false),
  customerPrivateData: z.boolean().default(false),
  moneyMovement: z.boolean().default(false),
  materialExternalSend: z.boolean().default(false),
  credentialEntryStorage: z.boolean().default(false),
  guardBoundaryPresent: z.boolean().default(true),
  receiptPreviewRequired: z.boolean().default(true)
});
export type ControlPlaneAction = z.infer<typeof ControlPlaneActionSchema>;

export const SubsystemStatusSchema = z.object({
  package: z.string(),
  status: z.enum(["modeled", "preview", "read_only", "blocked_future"]),
  summary: z.string()
});
export type SubsystemStatus = z.infer<typeof SubsystemStatusSchema>;

export const ControlPlaneStateSnapshotSchema = z.object({
  schema_version: z.literal("stealtheye-control-plane-state-snapshot.v1"),
  current_build: z.literal(17),
  package_inventory: z.array(z.string()),
  mission_os_status: SubsystemStatusSchema,
  guard_status: SubsystemStatusSchema,
  registry_status: SubsystemStatusSchema,
  worker_fleet_status: SubsystemStatusSchema,
  codeops_status: SubsystemStatusSchema,
  browserops_status: SubsystemStatusSchema,
  receipts_replay_status: SubsystemStatusSchema,
  memory_graph_status: SubsystemStatusSchema,
  repo_status_capability: SubsystemStatusSchema,
  mcp_server_status: SubsystemStatusSchema,
  dev_endpoint_readiness: SubsystemStatusSchema,
  chatgpt_developer_mode_readiness: SubsystemStatusSchema,
  known_gaps: z.array(z.string()),
  next_recommended_action: z.string(),
  safety_boundaries: z.array(z.string())
});
export type ControlPlaneStateSnapshot = z.infer<typeof ControlPlaneStateSnapshotSchema>;

export const ControlPlaneSafetyPolicySchema = z.object({
  allowNavigationActions: z.boolean().default(true),
  allowFixturePreviews: z.boolean().default(true),
  allowReadOnlySummaries: z.boolean().default(true),
  allowLocalDevManifestDisplay: z.boolean().default(true),
  allowGeneratedStateDisplay: z.boolean().default(true),
  allowReceiptPreviewGeneration: z.boolean().default(true),
  allowSafeSettingsSummaryDisplay: z.boolean().default(true),
  denyProductionDeployment: z.boolean().default(true),
  denyPublicAppSubmission: z.boolean().default(true),
  denyRealOAuthClientsOrSecrets: z.boolean().default(true),
  denyRealAppIds: z.boolean().default(true),
  denyProductionDomains: z.boolean().default(true),
  denyRealPublicEndpoints: z.boolean().default(true),
  denyUnrestrictedLiveWriteActions: z.boolean().default(true),
  denyProtectedBranchMutationActions: z.boolean().default(true),
  denyDestructiveActions: z.boolean().default(true),
  denyProductionMutationActions: z.boolean().default(true),
  denyCustomerPrivateDataActions: z.boolean().default(true),
  denyMoneyMovementActions: z.boolean().default(true),
  denyMaterialExternalSends: z.boolean().default(true),
  denyCredentialEntryStorage: z.boolean().default(true),
  requireGuardBoundary: z.boolean().default(true),
  requireReceiptPreview: z.boolean().default(true),
  denyUnknownActionCategories: z.boolean().default(true)
});
export type ControlPlaneSafetyPolicy = z.infer<typeof ControlPlaneSafetyPolicySchema>;

export const ControlPlaneSafetyDecisionSchema = z.object({
  allowed: z.boolean(),
  decision: z.enum(["allow", "deny"]),
  findings: z.array(z.string()),
  denied_categories: z.array(z.string()),
  policy: ControlPlaneSafetyPolicySchema
});
export type ControlPlaneSafetyDecision = z.infer<typeof ControlPlaneSafetyDecisionSchema>;

export const ControlPlaneReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-control-plane-receipt-preview.v1"),
  action_name: ControlPlaneActionNameSchema,
  view: ControlPlaneViewIdSchema,
  panel: z.string(),
  input_summary: z.string(),
  output_summary: z.string(),
  safety_decision: z.enum(["allow", "deny"]),
  preview_fixture_readonly_status: z.string(),
  no_secret_statement: z.string(),
  no_production_statement: z.string(),
  no_public_submission_statement: z.string(),
  no_money_statement: z.string(),
  result_status: z.enum(["ok", "blocked"])
});
export type ControlPlaneReceiptPreview = z.infer<typeof ControlPlaneReceiptPreviewSchema>;

export const ControlPlaneFixtureStateSchema = z.object({
  schema_version: z.literal("stealtheye-control-plane-fixture-state.v1"),
  snapshot: ControlPlaneStateSnapshotSchema,
  navigation: ControlPlaneNavigationSchema,
  actions: z.array(ControlPlaneActionSchema)
});
export type ControlPlaneFixtureState = z.infer<typeof ControlPlaneFixtureStateSchema>;

export const ControlPlaneAppSchema = z.object({
  schema_version: z.literal("stealtheye-control-plane-app.v1"),
  app_name: z.string(),
  package_name: z.literal("@stealtheye/control-plane-app"),
  build: z.literal(17),
  navigation: ControlPlaneNavigationSchema,
  actions: z.array(ControlPlaneActionSchema),
  state_snapshot: ControlPlaneStateSnapshotSchema,
  safety_policy: ControlPlaneSafetyPolicySchema,
  receipt_preview_available: z.literal(true),
  model_fixture_preview_only: z.literal(true),
  official_docs_checked: z.array(z.string())
});
export type ControlPlaneApp = z.infer<typeof ControlPlaneAppSchema>;
