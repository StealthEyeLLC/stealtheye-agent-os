import { ReceiptEventSchema } from "@stealtheye/receipts-replay";
import { z } from "zod";

export const ControlledLocalhostPreviewCommandModeSchema = z.enum([
  "disabled",
  "dry_run_plan",
  "static_fixture_preview",
  "localhost_config_required",
  "localhost_command_future",
  "hosted_future"
]);
export type ControlledLocalhostPreviewCommandMode = z.infer<typeof ControlledLocalhostPreviewCommandModeSchema>;

export const ControlledLocalhostPreviewConfigSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-config.v1"),
  host: z.enum(["localhost", "127.0.0.1"]),
  port: z.union([z.literal("config-required"), z.literal("placeholder")]),
  command: z.union([
    z.literal("config-required"),
    z.literal("pnpm --filter @stealtheye/mcp-server preview:fixture"),
    z.literal("node ./scripts/dev-preview-placeholder.mjs --dry-run")
  ]),
  working_directory: z.literal("repo-root-placeholder"),
  bind_by_default: z.literal(false),
  starts_process: z.literal(false),
  external_network_access: z.literal(false),
  public_url: z.null(),
  tunnel_provider: z.enum(["none", "config-required"]),
  production_mode: z.literal(false),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  read_only: z.literal(true),
  requires_manual_run: z.literal(true),
  receipt_refs: z.array(z.string().min(1)).min(1)
});
export type ControlledLocalhostPreviewConfig = z.infer<typeof ControlledLocalhostPreviewConfigSchema>;

export const ControlledLocalhostPreviewSafetyPolicySchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-safety-policy.v1"),
  denies: z.array(z.string().min(1)).min(1),
  allows: z.array(z.string().min(1)).min(1),
  allowed_hosts: z.tuple([z.literal("localhost"), z.literal("127.0.0.1")]),
  allowed_command_modes: z.array(ControlledLocalhostPreviewCommandModeSchema).min(1)
});
export type ControlledLocalhostPreviewSafetyPolicy = z.infer<typeof ControlledLocalhostPreviewSafetyPolicySchema>;

export const ControlledLocalhostPreviewSafetyDecisionSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-safety-decision.v1"),
  allowed: z.boolean(),
  command_mode: z.string().min(1),
  reasons: z.array(z.string().min(1)).min(1)
});
export type ControlledLocalhostPreviewSafetyDecision = z.infer<typeof ControlledLocalhostPreviewSafetyDecisionSchema>;

export const ControlledLocalhostPreviewReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-receipt-preview.v1"),
  command_mode: ControlledLocalhostPreviewCommandModeSchema,
  config_summary: z.record(z.unknown()),
  resource_inventory_summary: z.record(z.unknown()),
  developer_mode_connection_stage: z.string().min(1),
  safety_decision: ControlledLocalhostPreviewSafetyDecisionSchema,
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  no_secret_statement: z.string().min(1),
  no_production_statement: z.string().min(1),
  no_public_submission_statement: z.string().min(1),
  no_money_statement: z.string().min(1),
  result_status: z.enum(["ok", "blocked"]),
  replay_receipt_event_preview: z.record(z.unknown())
});
export type ControlledLocalhostPreviewReceiptPreview = z.infer<typeof ControlledLocalhostPreviewReceiptPreviewSchema>;

export const ControlledLocalhostPreviewCommandSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-command.v1"),
  command_id: z.string().min(1),
  mode: ControlledLocalhostPreviewCommandModeSchema,
  config: ControlledLocalhostPreviewConfigSchema,
  requested_by: z.literal("developer-mode-resource-connection"),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true)
});
export type ControlledLocalhostPreviewCommand = z.infer<typeof ControlledLocalhostPreviewCommandSchema>;

export const ControlledLocalhostPreviewPlanSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-plan.v1"),
  command: ControlledLocalhostPreviewCommandSchema,
  implemented: z.boolean(),
  blocked: z.boolean(),
  manual_steps: z.array(z.string().min(1)),
  future_steps: z.array(z.string().min(1)),
  safety_decision: ControlledLocalhostPreviewSafetyDecisionSchema,
  receipt_preview: ControlledLocalhostPreviewReceiptPreviewSchema
});
export type ControlledLocalhostPreviewPlan = z.infer<typeof ControlledLocalhostPreviewPlanSchema>;

export const ControlledLocalhostPreviewReadinessReportSchema = z.object({
  schema_version: z.literal("stealtheye-controlled-localhost-preview-readiness-report.v1"),
  build: z.literal(21),
  command_modes_implemented: z.tuple([
    z.literal("disabled"),
    z.literal("dry_run_plan"),
    z.literal("static_fixture_preview"),
    z.literal("localhost_config_required")
  ]),
  command_modes_blocked: z.tuple([z.literal("localhost_command_future"), z.literal("hosted_future")]),
  bind_by_default: z.literal(false),
  starts_process: z.literal(false),
  external_network_access: z.literal(false),
  production_mode: z.literal(false),
  public_url: z.null(),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  safety_policy: ControlledLocalhostPreviewSafetyPolicySchema,
  plans: z.array(ControlledLocalhostPreviewPlanSchema).min(1)
});
export type ControlledLocalhostPreviewReadinessReport = z.infer<typeof ControlledLocalhostPreviewReadinessReportSchema>;

type SafetyInput = Partial<ControlledLocalhostPreviewConfig> & {
  command_mode?: string;
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
  unsafeCommandString?: boolean;
  unsafeWorkingDirectory?: boolean;
  unsafeHost?: boolean;
  unsafePort?: boolean;
  unsafeResourceUriScheme?: boolean;
  remoteAsset?: boolean;
  serverBindingByDefault?: boolean;
  startsProcessInDefaultOrCi?: boolean;
  externalNetworkAccess?: boolean;
  tunnelProviderLiveEnablement?: boolean;
  hostedPublicMode?: boolean;
};

const implementedModes = ["disabled", "dry_run_plan", "static_fixture_preview", "localhost_config_required"];
const blockedModes = ["localhost_command_future", "hosted_future"];

export const createControlledLocalhostPreviewSafetyPolicy = (): ControlledLocalhostPreviewSafetyPolicy => ControlledLocalhostPreviewSafetyPolicySchema.parse({
  schema_version: "stealtheye-controlled-localhost-preview-safety-policy.v1",
  allowed_hosts: ["localhost", "127.0.0.1"],
  allowed_command_modes: ["disabled", "dry_run_plan", "static_fixture_preview", "localhost_config_required"],
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
    "unsafe_command_strings",
    "unsafe_working_directories",
    "unsafe_host",
    "unsafe_port",
    "unsafe_resource_uri_schemes",
    "remote_scripts_styles_assets",
    "server_binding_by_default",
    "starts_process_in_ci_or_default_mode",
    "external_network_access",
    "tunnel_provider_live_enablement",
    "hosted_public_mode",
    "missing_read_only_preview_fixture_flags",
    "missing_receipt_references",
    "unknown_command_or_connection_mode"
  ],
  allows: [
    "dry_run_command_plan",
    "fixture_preview_plan",
    "static_fixture_resource_reading",
    "local_app_safe_ui_render_resource_uris",
    "localhost_config_required_metadata",
    "developer_mode_manual_connection_checklist",
    "receipt_preview_display",
    "safe_settings_summary_display"
  ]
});

export const createControlledLocalhostPreviewConfig = (mode: ControlledLocalhostPreviewCommandMode = "disabled"): ControlledLocalhostPreviewConfig => ControlledLocalhostPreviewConfigSchema.parse({
  schema_version: "stealtheye-controlled-localhost-preview-config.v1",
  host: mode === "disabled" ? "localhost" : "127.0.0.1",
  port: mode === "localhost_config_required" ? "config-required" : "placeholder",
  command: mode === "static_fixture_preview" ? "pnpm --filter @stealtheye/mcp-server preview:fixture" : mode === "dry_run_plan" ? "node ./scripts/dev-preview-placeholder.mjs --dry-run" : "config-required",
  working_directory: "repo-root-placeholder",
  bind_by_default: false,
  starts_process: false,
  external_network_access: false,
  public_url: null,
  tunnel_provider: mode === "localhost_config_required" ? "config-required" : "none",
  production_mode: false,
  fixture_only: true,
  preview_only: true,
  read_only: true,
  requires_manual_run: true,
  receipt_refs: [`receipt.build21.controlled_localhost_preview.${mode}`]
});

export const decideControlledLocalhostPreviewSafety = (input: SafetyInput): ControlledLocalhostPreviewSafetyDecision => {
  const mode = input.command_mode ?? "disabled";
  const reasons: string[] = [];
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
  if (input.unsafeCommandString || (input.command !== undefined && !["config-required", "pnpm --filter @stealtheye/mcp-server preview:fixture", "node ./scripts/dev-preview-placeholder.mjs --dry-run"].includes(String(input.command)))) reasons.push("unsafe command string denied");
  if (input.unsafeWorkingDirectory || (input.working_directory !== undefined && input.working_directory !== "repo-root-placeholder")) reasons.push("unsafe working directory denied");
  if (input.unsafeHost || (input.host !== undefined && !["localhost", "127.0.0.1"].includes(String(input.host)))) reasons.push("unsafe host denied");
  if (input.unsafePort || (input.port !== undefined && !["config-required", "placeholder"].includes(String(input.port)))) reasons.push("unsafe port denied");
  if (input.unsafeResourceUriScheme) reasons.push("unsafe resource URI scheme denied");
  if (input.remoteAsset) reasons.push("remote asset/script/style denied");
  if (input.serverBindingByDefault || input.bind_by_default === true) reasons.push("server binding by default denied");
  if (input.startsProcessInDefaultOrCi || input.starts_process === true) reasons.push("starts process in CI/default mode denied");
  if (input.externalNetworkAccess || input.external_network_access === true) reasons.push("external network access denied");
  if (input.tunnelProviderLiveEnablement || ![undefined, "none", "config-required"].includes(input.tunnel_provider)) reasons.push("tunnel provider live enablement denied");
  if (input.hostedPublicMode || mode === "hosted_future") reasons.push("hosted/public mode denied");
  if (mode === "localhost_command_future") reasons.push("localhost command future blocked");
  if (input.read_only !== undefined && input.read_only !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (input.preview_only !== undefined && input.preview_only !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (input.fixture_only !== undefined && input.fixture_only !== true) reasons.push("missing read-only/preview/fixture flags denied");
  if (input.receipt_refs !== undefined && input.receipt_refs.length === 0) reasons.push("missing receipt refs denied");
  if (!implementedModes.includes(mode) && !blockedModes.includes(mode)) reasons.push("unknown command/connection mode denied");
  return ControlledLocalhostPreviewSafetyDecisionSchema.parse({
    schema_version: "stealtheye-controlled-localhost-preview-safety-decision.v1",
    allowed: reasons.length === 0,
    command_mode: mode,
    reasons: reasons.length === 0 ? ["controlled localhost preview command metadata allowed"] : reasons
  });
};

export const createControlledLocalhostPreviewCommand = (mode: ControlledLocalhostPreviewCommandMode = "disabled"): ControlledLocalhostPreviewCommand => {
  const config = createControlledLocalhostPreviewConfig(mode);
  return ControlledLocalhostPreviewCommandSchema.parse({
    schema_version: "stealtheye-controlled-localhost-preview-command.v1",
    command_id: `build21-controlled-localhost-preview-${mode.replace(/_/g, "-")}`,
    mode,
    config,
    requested_by: "developer-mode-resource-connection",
    read_only: true,
    fixture_only: true,
    preview_only: true
  });
};

const createReceiptPreview = (command: ControlledLocalhostPreviewCommand, safetyDecision: ControlledLocalhostPreviewSafetyDecision): ControlledLocalhostPreviewReceiptPreview => {
  const replayEvent = ReceiptEventSchema.parse({
    schema_version: "receipts-replay-event.v1",
    event_id: `build21-controlled-localhost-preview-${command.mode}`,
    mission_id: "build-021-controlled-localhost-preview-command",
    source_subsystem: "app_host",
    event_type: "artifact_recorded",
    actor_id: "@stealtheye/mcp-server",
    subject_id: command.command_id,
    action_id: "controlled_localhost_preview_command_plan",
    timestamp: "2026-01-01T00:00:00.000Z",
    status_before: null,
    status_after: safetyDecision.allowed ? "planned" : "blocked",
    summary: `Controlled localhost preview command plan for ${command.mode}.",
    reason_codes: safetyDecision.reasons,
    evidence_refs: [],
    artifact_refs: ["receipt://fixture/build-021/controlled-localhost-preview-command"],
    receipt_refs: command.config.receipt_refs,
    related_event_ids: [],
    public_private_boundary: "public_safe",
    sensitivity: "public",
    retention_hint: "generated Build 21 fixture receipt preview"
  });
  return ControlledLocalhostPreviewReceiptPreviewSchema.parse({
    schema_version: "stealtheye-controlled-localhost-preview-receipt-preview.v1",
    command_mode: command.mode,
    config_summary: {
      host: command.config.host,
      port: command.config.port,
      command: command.config.command,
      bind_by_default: false,
      starts_process: false,
      external_network_access: false,
      public_url: null,
      tunnel_provider: command.config.tunnel_provider
    },
    resource_inventory_summary: {
      mcp_server_package: "@stealtheye/mcp-server",
      ui_resources: "available as static fixture resource metadata",
      render_resources: "available as deterministic fixture render metadata",
      localhost_preview: command.mode
    },
    developer_mode_connection_stage: command.mode === "localhost_config_required" ? "manual local endpoint configuration required" : "fixture metadata only",
    safety_decision: safetyDecision,
    read_only: true,
    fixture_only: true,
    preview_only: true,
    no_secret_statement: "No secrets, credentials, tokens, private keys, OAuth secrets, tunnel tokens, or credential material are required or stored.",
    no_production_statement: "No production frontend, production deployment, production mutation, production endpoint, or production domain is created.",
    no_public_submission_statement: "No public app submission, real app ID, production OAuth client, or hosted public mode is added.",
    no_money_statement: "No money movement, billing mutation, purchase, subscription, or refund occurs.",
    result_status: safetyDecision.allowed ? "ok" : "blocked",
    replay_receipt_event_preview: replayEvent
  });
};

export const createControlledLocalhostPreviewPlan = (mode: ControlledLocalhostPreviewCommandMode = "disabled"): ControlledLocalhostPreviewPlan => {
  const command = createControlledLocalhostPreviewCommand(mode);
  const safetyDecision = decideControlledLocalhostPreviewSafety({ command_mode: mode, ...command.config });
  const blocked = !safetyDecision.allowed;
  return ControlledLocalhostPreviewPlanSchema.parse({
    schema_version: "stealtheye-controlled-localhost-preview-plan.v1",
    command,
    implemented: implementedModes.includes(mode),
    blocked,
    manual_steps: mode === "localhost_config_required" ? ["Choose an explicit safe localhost host and port in a future build.", "Manually run only a safe local preview runner after explicit configuration exists."] : ["Review the dry-run or fixture preview metadata."],
    future_steps: blocked ? ["Keep live command execution and hosted preview modes blocked until a future safe runner build."] : ["Build 22 may add a controlled local preview runner without default binding."],
    safety_decision: safetyDecision,
    receipt_preview: createReceiptPreview(command, safetyDecision)
  });
};

export const createControlledLocalhostPreviewReadinessReport = (): ControlledLocalhostPreviewReadinessReport => ControlledLocalhostPreviewReadinessReportSchema.parse({
  schema_version: "stealtheye-controlled-localhost-preview-readiness-report.v1",
  build: 21,
  command_modes_implemented: ["disabled", "dry_run_plan", "static_fixture_preview", "localhost_config_required"],
  command_modes_blocked: ["localhost_command_future", "hosted_future"],
  bind_by_default: false,
  starts_process: false,
  external_network_access: false,
  production_mode: false,
  public_url: null,
  read_only: true,
  fixture_only: true,
  preview_only: true,
  safety_policy: createControlledLocalhostPreviewSafetyPolicy(),
  plans: [
    createControlledLocalhostPreviewPlan("disabled"),
    createControlledLocalhostPreviewPlan("dry_run_plan"),
    createControlledLocalhostPreviewPlan("static_fixture_preview"),
    createControlledLocalhostPreviewPlan("localhost_config_required"),
    createControlledLocalhostPreviewPlan("localhost_command_future"),
    createControlledLocalhostPreviewPlan("hosted_future")
  ]
});
