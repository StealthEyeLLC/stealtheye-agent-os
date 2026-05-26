import { ControlPlaneUiComponentTypeSchema, type ControlPlaneUiComponent, type ControlPlaneUiResource, type ControlPlaneUiSafetyDecision, type ControlPlaneUiSafetyPolicy } from "./schemas";

export const createControlPlaneUiSafetyPolicy = (): ControlPlaneUiSafetyPolicy => ({
  schema_version: "control-plane-ui.safety-policy.v1",
  allowed_uri_prefix: "ui://stealtheye/control-plane/",
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
    "missing_read_only_preview_fixture_flags",
    "missing_receipt_references",
    "unknown_component_or_resource_types"
  ],
  allows: [
    "static_resource_descriptors",
    "fixture_only_hydration_payloads",
    "read_only_component_views",
    "preview_only_panels",
    "public_safe_generated_state_display",
    "receipt_preview_display",
    "safe_settings_summary_display"
  ]
});

export type ControlPlaneUiSafetyInput = Partial<ControlPlaneUiComponent> & Partial<ControlPlaneUiResource> & {
  productionDeployment?: boolean;
  publicAppSubmission?: boolean;
  realOAuthClient?: boolean;
  realAppId?: boolean;
  productionDomain?: boolean;
  realPublicEndpoint?: boolean;
  unrestrictedLiveWrite?: boolean;
  protectedBranchMutation?: boolean;
  moneyMovement?: boolean;
  credentialEntryStorage?: boolean;
  unsafeResourceUri?: boolean;
  unknownComponentType?: boolean;
};

export const decideControlPlaneUiSafety = (input: ControlPlaneUiSafetyInput): ControlPlaneUiSafetyDecision => {
  const reasons: string[] = [];
  const uri = input.resource_uri ?? input.uri ?? "";
  if (input.productionDeployment) reasons.push("production deployment denied");
  if (input.publicAppSubmission) reasons.push("public app submission denied");
  if (input.realOAuthClient) reasons.push("real OAuth client denied");
  if (input.realAppId) reasons.push("real app ID denied");
  if (input.productionDomain) reasons.push("production domain denied");
  if (input.realPublicEndpoint) reasons.push("real public endpoint denied");
  if (input.unrestrictedLiveWrite) reasons.push("unrestricted live write denied");
  if (input.protectedBranchMutation) reasons.push("protected branch mutation denied");
  if (input.destructive) reasons.push("destructive action denied");
  if (input.production_mutation) reasons.push("production mutation denied");
  if (input.customer_private_data) reasons.push("customer/private data denied");
  if (input.moneyMovement) reasons.push("money movement denied");
  if (input.material_external_send) reasons.push("material external send denied");
  if (input.credential_entry || input.credentialEntryStorage) reasons.push("credential entry/storage denied");
  if (input.external_side_effects) reasons.push("external side effects denied");
  if (input.unsafeResourceUri || !uri.startsWith(createControlPlaneUiSafetyPolicy().allowed_uri_prefix)) reasons.push("unsafe resource URI scheme denied");
  if (input.read_only !== true || input.preview_only !== true || input.fixture_only !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (!input.receipt_refs || input.receipt_refs.length === 0) reasons.push("missing receipt refs denied");
  if (input.unknownComponentType || (input.component_type && !ControlPlaneUiComponentTypeSchema.safeParse(input.component_type).success)) reasons.push("unknown component/resource type denied");
  return { schema_version: "control-plane-ui.safety-decision.v1", allowed: reasons.length === 0, reasons: reasons.length === 0 ? ["fixture/read-only component allowed"] : reasons, component_id: input.component_id };
};

export const assertNoControlPlaneUiLiveMaterial = (value: unknown): boolean => {
  const serialized = JSON.stringify(value);
  const forbidden = [
    /https?:\/\//i,
    /client_secret/i,
    /private_key/i,
    /tunnel_token/i,
    /cloud_account/i,
    /customer[_ -]?private/i,
    /production[_ -]?domain/i,
    /real[_ -]?app[_ -]?id/i
  ];
  return forbidden.every((pattern) => !pattern.test(serialized));
};
