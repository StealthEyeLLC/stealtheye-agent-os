import { z } from "zod";

export const ControlPlaneUiComponentTypeSchema = z.enum([
  "overview_dashboard",
  "mission_list",
  "mission_detail",
  "agent_registry",
  "tool_inventory",
  "guard_decisions",
  "receipt_timeline",
  "replay_report",
  "memory_context",
  "repo_status",
  "codeops_panel",
  "browserops_panel",
  "worker_fleet",
  "mcp_server_status",
  "dev_endpoint_status",
  "chatgpt_developer_mode_status",
  "safe_settings"
]);

const IdSchema = z.string().min(1);
const UiResourceUriSchema = z.string().regex(/^ui:\/\/stealtheye\/control-plane\/[a-z0-9/_-]+$/);
const TemplateUriSchema = z.string().regex(/^ui:\/\/stealtheye\/control-plane\/templates\/[a-z0-9/_-]+$/);

export const ControlPlaneUiComponentSchema = z.object({
  schema_version: z.literal("control-plane-ui.component.v1"),
  component_id: IdSchema,
  component_type: ControlPlaneUiComponentTypeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  resource_uri: UiResourceUriSchema,
  template_uri: TemplateUriSchema,
  view_id: IdSchema,
  panel_ids: z.array(IdSchema).min(1),
  required_data_refs: z.array(IdSchema).min(1),
  hydration_schema_id: IdSchema,
  safety_classification: z.literal("public_fixture_preview_only"),
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  external_side_effects: z.literal(false),
  destructive: z.literal(false),
  production_mutation: z.literal(false),
  customer_private_data: z.literal(false),
  credential_entry: z.literal(false),
  material_external_send: z.literal(false),
  allowed_actions: z.array(IdSchema),
  blocked_actions: z.array(IdSchema).min(1),
  receipt_refs: z.array(IdSchema).min(1)
});

export const ControlPlaneUiResourceSchema = z.object({
  schema_version: z.literal("control-plane-ui.resource.v1"),
  resource_id: IdSchema,
  uri: UiResourceUriSchema,
  mime_type: z.literal("application/vnd.stealtheye.control-plane-ui+json"),
  component_id: IdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  external_side_effects: z.literal(false),
  production_mutation: z.literal(false),
  customer_private_data: z.literal(false),
  receipt_refs: z.array(IdSchema).min(1)
});

export const ControlPlaneUiTemplateSchema = z.object({
  schema_version: z.literal("control-plane-ui.template.v1"),
  template_id: IdSchema,
  template_uri: TemplateUriSchema,
  component_type: ControlPlaneUiComponentTypeSchema,
  static_layout: z.object({
    regions: z.array(IdSchema).min(1),
    empty_state: z.string().min(1)
  }),
  allowed_slots: z.array(IdSchema).min(1),
  fixture_only: z.literal(true),
  preview_only: z.literal(true)
});

export const ControlPlaneUiMetadataSchema = z.object({
  schema_version: z.literal("control-plane-ui.metadata.v1"),
  app_sdk_alignment: z.object({
    official_docs_checked: z.array(z.string()).min(3),
    resource_descriptor_model: z.literal("static_apps_sdk_style_resource_descriptor"),
    tool_metadata_model: z.literal("read_only_output_template_metadata")
  }),
  build: z.literal(18),
  package_name: z.literal("@stealtheye/control-plane-ui"),
  production_frontend: z.literal(false),
  public_app_submission: z.literal(false),
  production_oauth: z.literal(false),
  real_app_ids: z.literal(false),
  production_domains: z.literal(false),
  unrestricted_live_write_tools: z.literal(false),
  customer_private_data_workflows: z.literal(false)
});

export const ControlPlaneUiHydrationPayloadSchema = z.object({
  schema_version: z.literal("control-plane-ui.hydration.v1"),
  control_plane_state_snapshot: z.record(z.unknown()),
  navigation: z.record(z.unknown()),
  views: z.array(z.record(z.unknown())).min(1),
  panels: z.array(z.record(z.unknown())).min(1),
  actions: z.array(z.record(z.unknown())).min(1),
  safety_inventory: z.array(z.string()).min(1),
  receipt_previews: z.array(z.record(z.unknown())).min(1),
  known_gaps: z.array(z.string()).min(1),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  read_only: z.literal(true)
});

export const ControlPlaneUiSafetyPolicySchema = z.object({
  schema_version: z.literal("control-plane-ui.safety-policy.v1"),
  denies: z.array(z.string()).min(1),
  allows: z.array(z.string()).min(1),
  allowed_uri_prefix: z.literal("ui://stealtheye/control-plane/")
});

export const ControlPlaneUiSafetyDecisionSchema = z.object({
  schema_version: z.literal("control-plane-ui.safety-decision.v1"),
  allowed: z.boolean(),
  reasons: z.array(z.string()).min(1),
  component_id: z.string().optional()
});

export const ControlPlaneUiFixtureBundleSchema = z.object({
  schema_version: z.literal("control-plane-ui.fixture-bundle.v1"),
  components: z.array(ControlPlaneUiComponentSchema).min(17),
  resources: z.array(ControlPlaneUiResourceSchema).min(17),
  templates: z.array(ControlPlaneUiTemplateSchema).min(17),
  metadata: ControlPlaneUiMetadataSchema,
  hydration: ControlPlaneUiHydrationPayloadSchema,
  safety_policy: ControlPlaneUiSafetyPolicySchema
});

export type ControlPlaneUiComponentType = z.infer<typeof ControlPlaneUiComponentTypeSchema>;
export type ControlPlaneUiComponent = z.infer<typeof ControlPlaneUiComponentSchema>;
export type ControlPlaneUiResource = z.infer<typeof ControlPlaneUiResourceSchema>;
export type ControlPlaneUiTemplate = z.infer<typeof ControlPlaneUiTemplateSchema>;
export type ControlPlaneUiMetadata = z.infer<typeof ControlPlaneUiMetadataSchema>;
export type ControlPlaneUiHydrationPayload = z.infer<typeof ControlPlaneUiHydrationPayloadSchema>;
export type ControlPlaneUiSafetyPolicy = z.infer<typeof ControlPlaneUiSafetyPolicySchema>;
export type ControlPlaneUiSafetyDecision = z.infer<typeof ControlPlaneUiSafetyDecisionSchema>;
export type ControlPlaneUiFixtureBundle = z.infer<typeof ControlPlaneUiFixtureBundleSchema>;
