import { readControlPlaneUiResource, listControlPlaneUiResourceUris } from "@stealtheye/control-plane-ui";
import { renderLocalDevUiResource, createLocalDevUiRoutes } from "@stealtheye/local-dev-ui-shell";
import { ReceiptEventSchema } from "@stealtheye/receipts-replay";
import { z } from "zod";
import { McpServerResourceDescriptorSchema, McpServerSchemaVersion } from "./schemas";
import { createLocalhostPreviewManifest, listLocalhostPreviewManifests, type LocalhostPreviewMode } from "./localhost-preview";

const UiOrRenderResourceUriSchema = z.string().regex(/^(ui|ui-render):\/\/stealtheye\/control-plane\/[a-z0-9/_-]+$/);
const LocalhostPreviewUriSchema = z.string().regex(/^localhost-preview:\/\/stealtheye\/control-plane\/[a-z0-9-]+$/);

export const McpUiResourceSafetyPolicySchema = z.object({
  schema_version: z.literal("stealtheye-mcp-ui-resource-safety-policy.v1"),
  denies: z.array(z.string().min(1)).min(1),
  allows: z.array(z.string().min(1)).min(1),
  allowed_uri_prefixes: z.tuple([
    z.literal("ui://stealtheye/control-plane/"),
    z.literal("ui-render://stealtheye/control-plane/"),
    z.literal("localhost-preview://stealtheye/control-plane/")
  ])
});
export type McpUiResourceSafetyPolicy = z.infer<typeof McpUiResourceSafetyPolicySchema>;

export const McpUiResourceSafetyDecisionSchema = z.object({
  schema_version: z.literal("stealtheye-mcp-ui-resource-safety-decision.v1"),
  allowed: z.boolean(),
  reasons: z.array(z.string().min(1)).min(1),
  resource_uri: z.string().optional(),
  preview_mode: z.string().optional()
});
export type McpUiResourceSafetyDecision = z.infer<typeof McpUiResourceSafetyDecisionSchema>;

export const McpUiResourceReadReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-mcp-ui-resource-read-receipt-preview.v1"),
  resource_uri: z.string().min(1),
  resource_type: z.enum(["control_plane_ui_resource", "local_dev_shell_render", "localhost_preview_manifest"]),
  preview_mode: z.string().min(1),
  server_package: z.literal("@stealtheye/mcp-server"),
  shell_package: z.literal("@stealtheye/local-dev-ui-shell"),
  safety_decision: McpUiResourceSafetyDecisionSchema,
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  no_secret_statement: z.string().min(1),
  no_production_statement: z.string().min(1),
  no_public_submission_statement: z.string().min(1),
  no_money_statement: z.string().min(1),
  result_status: z.enum(["ok", "blocked"]),
  replay_receipt_event_preview: z.record(z.unknown()).optional()
});
export type McpUiResourceReadReceiptPreview = z.infer<typeof McpUiResourceReadReceiptPreviewSchema>;

export const McpUiResourceReadResultSchema = z.object({
  schema_version: z.literal("stealtheye-mcp-ui-resource-read-result.v1"),
  uri: z.string().min(1),
  mimeType: z.literal("application/json"),
  contents: z.unknown(),
  readOnly: z.literal(true),
  fixtureOnly: z.literal(true),
  previewOnly: z.literal(true),
  public_safe: z.literal(true),
  receipt_preview: McpUiResourceReadReceiptPreviewSchema
});
export type McpUiResourceReadResult = z.infer<typeof McpUiResourceReadResultSchema>;

export const createMcpUiResourceSafetyPolicy = (): McpUiResourceSafetyPolicy => McpUiResourceSafetyPolicySchema.parse({
  schema_version: "stealtheye-mcp-ui-resource-safety-policy.v1",
  allowed_uri_prefixes: ["ui://stealtheye/control-plane/", "ui-render://stealtheye/control-plane/", "localhost-preview://stealtheye/control-plane/"],
  denies: [
    "production_deployment",
    "public_app_submission",
    "real_oauth_clients_or_secrets",
    "real_app_ids",
    "production_domains",
    "real_public_endpoints",
    "unrestricted_live_write_actions",
    "protected_branch_mutation_actions",
    "destructive_actions",
    "production_mutation_actions",
    "customer_private_data_actions",
    "money_movement_actions",
    "material_external_sends",
    "credential_entry_or_storage",
    "external_side_effects",
    "unsafe_resource_uri_schemes",
    "remote_scripts_styles_assets",
    "server_binding_by_default",
    "external_network_access",
    "tunnel_provider_live_enablement",
    "hosted_public_mode",
    "missing_read_only_preview_fixture_flags",
    "missing_receipt_references",
    "unknown_resource_preview_mode"
  ],
  allows: [
    "static_fixture_resource_listing",
    "static_fixture_resource_reading",
    "local_app_safe_ui_resource_uris",
    "deterministic_render_resource_preview",
    "disabled_localhost_preview_metadata",
    "localhost_config_required_metadata",
    "receipt_preview_display",
    "safe_settings_summary_display"
  ]
});

type McpUiResourceSafetyInput = {
  resource_uri?: string;
  preview_mode?: LocalhostPreviewMode | string;
  readOnly?: boolean;
  fixtureOnly?: boolean;
  previewOnly?: boolean;
  receipt_refs?: string[];
  productionDeployment?: boolean;
  publicAppSubmission?: boolean;
  realOAuthClient?: boolean;
  realAppId?: boolean;
  productionDomain?: boolean;
  realPublicEndpoint?: boolean;
  unrestrictedLiveWrite?: boolean;
  protectedBranchMutation?: boolean;
  destructive?: boolean;
  productionMutation?: boolean;
  customerPrivateData?: boolean;
  moneyMovement?: boolean;
  materialExternalSend?: boolean;
  credentialEntryStorage?: boolean;
  externalSideEffects?: boolean;
  unsafeResourceUri?: boolean;
  remoteAsset?: boolean;
  serverBindingByDefault?: boolean;
  externalNetworkAccess?: boolean;
  tunnelProviderLiveEnablement?: boolean;
  hostedPublicMode?: boolean;
  unknownResourcePreviewMode?: boolean;
};

export const decideMcpUiResourceSafety = (input: McpUiResourceSafetyInput): McpUiResourceSafetyDecision => {
  const policy = createMcpUiResourceSafetyPolicy();
  const reasons: string[] = [];
  const uri = input.resource_uri ?? "";
  const previewMode = input.preview_mode ?? "static_fixture_preview";
  if (input.productionDeployment) reasons.push("production deployment denied");
  if (input.publicAppSubmission) reasons.push("public app submission denied");
  if (input.realOAuthClient) reasons.push("real OAuth client denied");
  if (input.realAppId) reasons.push("real app ID denied");
  if (input.productionDomain) reasons.push("production domain denied");
  if (input.realPublicEndpoint) reasons.push("real public endpoint denied");
  if (input.unrestrictedLiveWrite) reasons.push("unrestricted live write denied");
  if (input.protectedBranchMutation) reasons.push("protected branch mutation denied");
  if (input.destructive) reasons.push("destructive action denied");
  if (input.productionMutation) reasons.push("production mutation denied");
  if (input.customerPrivateData) reasons.push("customer/private data denied");
  if (input.moneyMovement) reasons.push("money movement denied");
  if (input.materialExternalSend) reasons.push("material external send denied");
  if (input.credentialEntryStorage) reasons.push("credential entry/storage denied");
  if (input.externalSideEffects) reasons.push("external side effects denied");
  if (input.unsafeResourceUri || (uri !== "" && !policy.allowed_uri_prefixes.some((prefix) => uri.startsWith(prefix)))) reasons.push("unsafe resource URI scheme denied");
  if (input.remoteAsset) reasons.push("remote asset/script/style denied");
  if (input.serverBindingByDefault) reasons.push("server binding by default denied");
  if (input.externalNetworkAccess) reasons.push("external network access denied");
  if (input.tunnelProviderLiveEnablement) reasons.push("tunnel provider live enablement denied");
  if (input.hostedPublicMode || previewMode === "hosted_future" || previewMode === "localhost_bound_future") reasons.push(`${previewMode} blocked`);
  if (input.readOnly !== true || input.fixtureOnly !== true || input.previewOnly !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (!input.receipt_refs || input.receipt_refs.length === 0) reasons.push("missing receipt refs denied");
  if (input.unknownResourcePreviewMode || !["disabled", "static_fixture_preview", "localhost_config_required", "localhost_bound_future", "hosted_future"].includes(String(previewMode))) reasons.push("unknown resource/preview mode denied");
  return McpUiResourceSafetyDecisionSchema.parse({
    schema_version: "stealtheye-mcp-ui-resource-safety-decision.v1",
    allowed: reasons.length === 0,
    reasons: reasons.length === 0 ? ["static fixture MCP UI resource access allowed"] : reasons,
    resource_uri: uri || undefined,
    preview_mode: String(previewMode)
  });
};

const routeSlugFromResourceUri = (uri: string): string => uri.replace("ui://stealtheye/control-plane/", "");
const renderUriFromUiUri = (uri: string): string => `ui-render://stealtheye/control-plane/${routeSlugFromResourceUri(uri)}`;
const uiUriFromRenderUri = (uri: string): string => `ui://stealtheye/control-plane/${uri.replace("ui-render://stealtheye/control-plane/", "")}`;

export const listMcpUiResourceDescriptors = () => {
  const uiResources = listControlPlaneUiResourceUris().map((uri) => {
    const resource = readControlPlaneUiResource(uri);
    return McpServerResourceDescriptorSchema.parse({
      schema_version: McpServerSchemaVersion.ResourceDescriptor,
      uri,
      name: resource?.title ?? `Control Plane UI Resource ${uri}`,
      description: resource?.description ?? "Static Control Plane UI resource.",
      mimeType: "application/json",
      readOnly: true,
      fixtureOnly: true,
      public_safe: true,
      sourcePackage: "@stealtheye/control-plane-ui"
    });
  });
  const renderResources = listControlPlaneUiResourceUris().map((uri) => {
    const resource = readControlPlaneUiResource(uri);
    return McpServerResourceDescriptorSchema.parse({
      schema_version: McpServerSchemaVersion.ResourceDescriptor,
      uri: renderUriFromUiUri(uri),
      name: `${resource?.title ?? "Control Plane UI"} Render Preview`,
      description: "Deterministic static HTML render preview from @stealtheye/local-dev-ui-shell.",
      mimeType: "application/json",
      readOnly: true,
      fixtureOnly: true,
      public_safe: true,
      sourcePackage: "@stealtheye/local-dev-ui-shell"
    });
  });
  const previewResources = listLocalhostPreviewManifests().map((manifest) => McpServerResourceDescriptorSchema.parse({
    schema_version: McpServerSchemaVersion.ResourceDescriptor,
    uri: manifest.uri,
    name: `Localhost Preview ${manifest.mode}`,
    description: "Controlled localhost-preview metadata; no server binding occurs by default.",
    mimeType: "application/json",
    readOnly: true,
    fixtureOnly: true,
    public_safe: true,
    sourcePackage: "@stealtheye/mcp-server"
  }));
  return [...uiResources, ...renderResources, ...previewResources];
};

export const isMcpUiResourceUri = (uri: string): boolean => UiOrRenderResourceUriSchema.safeParse(uri).success || LocalhostPreviewUriSchema.safeParse(uri).success;

const createReadReceiptPreview = (args: { resource_uri: string; resource_type: "control_plane_ui_resource" | "local_dev_shell_render" | "localhost_preview_manifest"; preview_mode: string; safety_decision: McpUiResourceSafetyDecision; receipt_refs: string[] }): McpUiResourceReadReceiptPreview => {
  const replayEvent = ReceiptEventSchema.parse({
    schema_version: "receipts-replay-event.v1",
    event_id: `build20-read-${args.resource_type}-${args.resource_uri.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
    mission_id: "build-020-mcp-resource-wiring-localhost-preview",
    source_subsystem: "app_host",
    event_type: "artifact_recorded",
    actor_id: "@stealtheye/mcp-server",
    subject_id: args.resource_uri,
    action_id: "mcp_resource_read_preview",
    timestamp: "2026-01-01T00:00:00.000Z",
    status_before: null,
    status_after: args.safety_decision.allowed ? "read_fixture_resource" : "blocked",
    summary: `MCP resource read preview for ${args.resource_uri}.`,
    reason_codes: args.safety_decision.reasons,
    evidence_refs: [],
    artifact_refs: [`receipt://fixture/build-020/${args.resource_type}`],
    receipt_refs: args.receipt_refs,
    related_event_ids: [],
    public_private_boundary: "public_safe",
    sensitivity: "public",
    retention_hint: "generated Build 20 fixture receipt preview"
  });
  return McpUiResourceReadReceiptPreviewSchema.parse({
    schema_version: "stealtheye-mcp-ui-resource-read-receipt-preview.v1",
    resource_uri: args.resource_uri,
    resource_type: args.resource_type,
    preview_mode: args.preview_mode,
    server_package: "@stealtheye/mcp-server",
    shell_package: "@stealtheye/local-dev-ui-shell",
    safety_decision: args.safety_decision,
    read_only: true,
    fixture_only: true,
    preview_only: true,
    no_secret_statement: "No secrets, credentials, tokens, private keys, OAuth secrets, tunnel tokens, or credential material were requested, read, rendered, or stored.",
    no_production_statement: "No production frontend, production endpoint, production deployment, production mutation, or production domain was created.",
    no_public_submission_statement: "No public app submission, real app ID, production OAuth client, or hosted public mode was added.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund occurred.",
    result_status: args.safety_decision.allowed ? "ok" : "blocked",
    replay_receipt_event_preview: replayEvent
  });
};

export const readMcpUiResource = (uri: string): McpUiResourceReadResult => {
  if (!isMcpUiResourceUri(uri)) throw new Error(`Unknown MCP UI resource URI: ${uri}`);
  let contents: unknown;
  let resourceType: "control_plane_ui_resource" | "local_dev_shell_render" | "localhost_preview_manifest";
  let previewMode = "static_fixture_preview";
  let receiptRefs = [`receipt.build20.resource.${uri.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`];
  if (uri.startsWith("ui://")) {
    const resource = readControlPlaneUiResource(uri);
    if (!resource) throw new Error(`Unknown Control Plane UI resource URI: ${uri}`);
    contents = resource;
    resourceType = "control_plane_ui_resource";
    receiptRefs = resource.receipt_refs;
  } else if (uri.startsWith("ui-render://")) {
    const uiUri = uiUriFromRenderUri(uri);
    const route = createLocalDevUiRoutes().find((candidate) => candidate.resource_uri === uiUri);
    if (!route) throw new Error(`Unknown rendered shell resource URI: ${uri}`);
    const render = renderLocalDevUiResource({ schema_version: "local-dev-ui-shell.render-request.v1", resource_uri: uiUri, shell_mode: "static_fixture_preview", include_receipt_preview: true, deterministic: true });
    contents = render;
    resourceType = "local_dev_shell_render";
    receiptRefs = route.receipt_refs;
  } else {
    const manifest = listLocalhostPreviewManifests().find((candidate) => candidate.uri === uri) ?? createLocalhostPreviewManifest("disabled");
    contents = manifest;
    resourceType = "localhost_preview_manifest";
    previewMode = manifest.mode;
    receiptRefs = manifest.receipt_refs;
  }
  const safetyDecision = decideMcpUiResourceSafety({ resource_uri: uri, preview_mode: previewMode, readOnly: true, fixtureOnly: true, previewOnly: true, receipt_refs: receiptRefs });
  return McpUiResourceReadResultSchema.parse({
    schema_version: "stealtheye-mcp-ui-resource-read-result.v1",
    uri,
    mimeType: "application/json",
    contents,
    readOnly: true,
    fixtureOnly: true,
    previewOnly: true,
    public_safe: true,
    receipt_preview: createReadReceiptPreview({ resource_uri: uri, resource_type: resourceType, preview_mode: previewMode, safety_decision: safetyDecision, receipt_refs: receiptRefs })
  });
};

export const createMcpUiResourceReadinessReport = () => ({
  schema_version: "stealtheye-mcp-ui-resource-readiness-report.v1",
  build: 20,
  ui_resource_count: listControlPlaneUiResourceUris().length,
  render_resource_count: listControlPlaneUiResourceUris().length,
  localhost_preview_resource_count: listLocalhostPreviewManifests().length,
  resource_uri_schemes: ["ui://stealtheye/control-plane/", "ui-render://stealtheye/control-plane/", "localhost-preview://stealtheye/control-plane/"],
  server_binding_default: false,
  external_network_access: false,
  remote_assets: false,
  production_deployment: false,
  public_app_submission: false,
  safety_policy: createMcpUiResourceSafetyPolicy()
});
