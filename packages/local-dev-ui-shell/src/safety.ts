import { ControlPlaneUiComponentTypeSchema } from "@stealtheye/control-plane-ui";
import type { LocalDevUiRoute, LocalDevUiSafetyDecision, LocalDevUiSafetyPolicy, LocalDevUiStaticAsset } from "./schemas";

export const createLocalDevUiSafetyPolicy = (): LocalDevUiSafetyPolicy => ({
  schema_version: "local-dev-ui-shell.safety-policy.v1",
  allowed_route_prefix: "/",
  allowed_resource_uri_prefix: "ui://stealtheye/control-plane/",
  allowed_asset_uri_prefixes: ["ui-asset://stealtheye/control-plane/", "ui://stealtheye/control-plane/"],
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
    "unsafe_route_paths",
    "unsafe_resource_uri_schemes",
    "remote_scripts_styles_assets",
    "server_binding_by_default",
    "missing_read_only_preview_fixture_flags",
    "missing_receipt_references",
    "unknown_route_component_resource_types"
  ],
  allows: [
    "static_fixture_rendering",
    "read_only_route_previews",
    "fixture_only_hydration",
    "local_app_safe_resource_loading",
    "no_external_side_effects",
    "public_safe_generated_state_display",
    "receipt_preview_display",
    "safe_settings_summary_display"
  ]
});

type RouteSafetyFields = Omit<Partial<LocalDevUiRoute>, "schema_version">;
type AssetSafetyFields = Omit<Partial<LocalDevUiStaticAsset>, "schema_version">;
export type LocalDevUiSafetyInput = RouteSafetyFields & AssetSafetyFields & {
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
  unsafeRoutePath?: boolean;
  unsafeResourceUri?: boolean;
  remoteAsset?: boolean;
  serverBindingByDefault?: boolean;
  unknownRouteComponentResourceType?: boolean;
};

export const decideLocalDevUiSafety = (input: LocalDevUiSafetyInput): LocalDevUiSafetyDecision => {
  const reasons: string[] = [];
  const routePath = input.path ?? "/";
  const uri = input.resource_uri ?? input.uri ?? "";
  const policy = createLocalDevUiSafetyPolicy();
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
  if (input.unsafeRoutePath || !(/^\/$|^\/[a-z0-9-]+$/).test(routePath)) reasons.push("unsafe route path denied");
  if (input.unsafeResourceUri || (uri !== "" && !uri.startsWith(policy.allowed_resource_uri_prefix) && !uri.startsWith(policy.allowed_asset_uri_prefixes[0]))) reasons.push("unsafe resource URI scheme denied");
  if (input.remoteAsset || input.remote || input.external_cdn) reasons.push("remote asset/script/style denied");
  if (input.serverBindingByDefault) reasons.push("server binding by default denied");
  if (input.read_only !== true || input.preview_only !== true || input.fixture_only !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (!input.receipt_refs || input.receipt_refs.length === 0) reasons.push("missing receipt refs denied");
  if (input.unknownRouteComponentResourceType || (input.component_type && !ControlPlaneUiComponentTypeSchema.safeParse(input.component_type).success)) reasons.push("unknown route/component/resource type denied");
  const decision = { schema_version: "local-dev-ui-shell.safety-decision.v1" as const, allowed: reasons.length === 0, reasons: reasons.length === 0 ? ["static fixture rendering allowed"] : reasons };
  return input.route_id ? { ...decision, route_id: input.route_id } : decision;
};

export const assertNoLocalDevUiLiveMaterial = (value: unknown): boolean => {
  const serialized = JSON.stringify(value);
  const forbidden = [
    /https?:\/\//i,
    /client_secret\s*[:=]/i,
    /private_key\s*[:=]/i,
    /tunnel_token\s*[:=]/i,
    /cloud_account\s*[:=]/i,
    /customer[_ -]?(?:ssn|card|record|email|address)/i,
    /cdn\./i,
    /<script\s+src=/i,
    /<link\s+[^>]*href=/i
  ];
  return forbidden.every((pattern) => !pattern.test(serialized));
};
