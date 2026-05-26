import { z } from "zod";
import { ControlPlaneUiComponentTypeSchema, ControlPlaneUiResourceSchema, ControlPlaneUiTemplateSchema } from "@stealtheye/control-plane-ui";

export const LocalDevUiShellModeSchema = z.enum(["disabled", "static_fixture_preview", "localhost_dev_preview", "hosted_future"]);
export type LocalDevUiShellMode = z.infer<typeof LocalDevUiShellModeSchema>;

const SafeRoutePathSchema = z.string().regex(/^\/$|^\/[a-z0-9-]+$/);
const UiResourceUriSchema = z.string().regex(/^ui:\/\/stealtheye\/control-plane\/[a-z0-9/_-]+$/);
const UiAssetUriSchema = z.string().regex(/^(ui-asset:\/\/stealtheye\/control-plane\/[a-z0-9/_-]+|ui:\/\/stealtheye\/control-plane\/[a-z0-9/_-]+)$/);

export const LocalDevUiRouteSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.route.v1"),
  route_id: z.string().min(1),
  path: SafeRoutePathSchema,
  title: z.string().min(1),
  resource_uri: UiResourceUriSchema,
  component_type: ControlPlaneUiComponentTypeSchema,
  shell_mode: LocalDevUiShellModeSchema,
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  external_side_effects: z.literal(false),
  destructive: z.literal(false),
  production_mutation: z.literal(false),
  customer_private_data: z.literal(false),
  credential_entry: z.literal(false),
  material_external_send: z.literal(false),
  receipt_refs: z.array(z.string().min(1)).min(1)
});
export type LocalDevUiRoute = z.infer<typeof LocalDevUiRouteSchema>;

export const LocalDevUiStaticAssetSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.static-asset.v1"),
  asset_id: z.string().min(1),
  uri: UiAssetUriSchema,
  kind: z.enum(["style", "script", "markup_fragment"]),
  content: z.string().min(1),
  remote: z.literal(false),
  external_cdn: z.literal(false),
  fixture_only: z.literal(true),
  preview_only: z.literal(true)
});
export type LocalDevUiStaticAsset = z.infer<typeof LocalDevUiStaticAssetSchema>;

export const LocalDevUiRenderRequestSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.render-request.v1"),
  route_path: SafeRoutePathSchema.optional(),
  resource_uri: UiResourceUriSchema.optional(),
  shell_mode: LocalDevUiShellModeSchema.default("static_fixture_preview"),
  include_receipt_preview: z.boolean().default(true),
  deterministic: z.literal(true)
}).refine((request) => Boolean(request.route_path || request.resource_uri), "render request requires route_path or resource_uri");
export type LocalDevUiRenderRequest = z.infer<typeof LocalDevUiRenderRequestSchema>;

export const LocalDevUiResourceLoadResultSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.resource-load-result.v1"),
  route: LocalDevUiRouteSchema,
  resource: ControlPlaneUiResourceSchema,
  template: ControlPlaneUiTemplateSchema,
  loaded: z.literal(true),
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  external_side_effects: z.literal(false)
});
export type LocalDevUiResourceLoadResult = z.infer<typeof LocalDevUiResourceLoadResultSchema>;

export const LocalDevUiHydrationResultSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.hydration-result.v1"),
  resource_uri: UiResourceUriSchema,
  hydration_schema_id: z.literal("control-plane-ui.hydration.v1"),
  control_plane_state_snapshot_present: z.literal(true),
  view_count: z.number().int().positive(),
  panel_count: z.number().int().positive(),
  action_count: z.number().int().positive(),
  receipt_preview_count: z.number().int().positive(),
  known_gap_count: z.number().int().positive(),
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true)
});
export type LocalDevUiHydrationResult = z.infer<typeof LocalDevUiHydrationResultSchema>;

export const LocalDevUiSafetyPolicySchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.safety-policy.v1"),
  denies: z.array(z.string().min(1)).min(1),
  allows: z.array(z.string().min(1)).min(1),
  allowed_route_prefix: z.literal("/"),
  allowed_resource_uri_prefix: z.literal("ui://stealtheye/control-plane/"),
  allowed_asset_uri_prefixes: z.tuple([z.literal("ui-asset://stealtheye/control-plane/"), z.literal("ui://stealtheye/control-plane/")])
});
export type LocalDevUiSafetyPolicy = z.infer<typeof LocalDevUiSafetyPolicySchema>;

export const LocalDevUiSafetyDecisionSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.safety-decision.v1"),
  allowed: z.boolean(),
  reasons: z.array(z.string().min(1)).min(1),
  route_id: z.string().optional()
});
export type LocalDevUiSafetyDecision = z.infer<typeof LocalDevUiSafetyDecisionSchema>;

export const LocalDevUiReceiptPreviewSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.receipt-preview.v1"),
  route: SafeRoutePathSchema,
  resource_uri: UiResourceUriSchema,
  component_type: ControlPlaneUiComponentTypeSchema,
  render_mode: LocalDevUiShellModeSchema,
  hydration_summary: LocalDevUiHydrationResultSchema,
  safety_decision: LocalDevUiSafetyDecisionSchema,
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  no_secret_statement: z.string().min(1),
  no_production_statement: z.string().min(1),
  no_public_submission_statement: z.string().min(1),
  no_money_statement: z.string().min(1),
  result_status: z.enum(["ok", "blocked"]),
  replay_receipt_event_preview: z.record(z.unknown()).optional()
});
export type LocalDevUiReceiptPreview = z.infer<typeof LocalDevUiReceiptPreviewSchema>;

export const LocalDevUiRenderResultSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.render-result.v1"),
  route: LocalDevUiRouteSchema,
  resource_uri: UiResourceUriSchema,
  template_uri: z.string().regex(/^ui:\/\/stealtheye\/control-plane\/templates\/[a-z0-9/_-]+$/),
  component_type: ControlPlaneUiComponentTypeSchema,
  render_mode: LocalDevUiShellModeSchema,
  html: z.string().min(1),
  hydration_summary: LocalDevUiHydrationResultSchema,
  safety_decision: LocalDevUiSafetyDecisionSchema,
  receipt_preview: LocalDevUiReceiptPreviewSchema,
  deterministic: z.literal(true),
  read_only: z.literal(true),
  preview_only: z.literal(true),
  fixture_only: z.literal(true),
  external_side_effects: z.literal(false)
});
export type LocalDevUiRenderResult = z.infer<typeof LocalDevUiRenderResultSchema>;

export const LocalDevUiShellSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.shell.v1"),
  shell_id: z.literal("local-dev-ui-shell:stealtheye-control-plane:build-19"),
  package_name: z.literal("@stealtheye/local-dev-ui-shell"),
  build: z.literal(19),
  implemented_modes: z.array(LocalDevUiShellModeSchema),
  modeled_modes: z.array(LocalDevUiShellModeSchema),
  default_mode: z.literal("static_fixture_preview"),
  default_route: z.literal("/"),
  server_binding_default: z.literal(false),
  production_frontend: z.literal(false),
  public_app_submission: z.literal(false),
  remote_assets: z.literal(false),
  routes: z.array(LocalDevUiRouteSchema).min(16),
  assets: z.array(LocalDevUiStaticAssetSchema)
});
export type LocalDevUiShell = z.infer<typeof LocalDevUiShellSchema>;

export const LocalDevUiFixtureBundleSchema = z.object({
  schema_version: z.literal("local-dev-ui-shell.fixture-bundle.v1"),
  shell: LocalDevUiShellSchema,
  routes: z.array(LocalDevUiRouteSchema).min(16),
  assets: z.array(LocalDevUiStaticAssetSchema),
  hydration: LocalDevUiHydrationResultSchema,
  rendered_preview: LocalDevUiRenderResultSchema,
  safety_policy: LocalDevUiSafetyPolicySchema
});
export type LocalDevUiFixtureBundle = z.infer<typeof LocalDevUiFixtureBundleSchema>;
