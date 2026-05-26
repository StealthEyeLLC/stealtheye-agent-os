import { ReceiptEventSchema } from "@stealtheye/receipts-replay";
import { z } from "zod";

export const SafeLocalPreviewRunnerModeSchema = z.enum(["disabled", "dry_run_only", "manual_config_required", "fixture_preview_only", "manual_localhost_ready", "auto_start_future", "hosted_public_future", "tunnel_future", "production_future"]);
export type SafeLocalPreviewRunnerMode = z.infer<typeof SafeLocalPreviewRunnerModeSchema>;
export const safeLocalPreviewRunnerAllowedModes = ["disabled", "dry_run_only", "manual_config_required", "fixture_preview_only", "manual_localhost_ready"] as const;
export const safeLocalPreviewRunnerBlockedFutureModes = ["auto_start_future", "hosted_public_future", "tunnel_future", "production_future"] as const;

export const SafeLocalPreviewRunnerCommandSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-command.v1"),
  command_id: z.string().min(1),
  command_kind: z.enum(["inert", "config-required", "fixture-metadata"]),
  command_label: z.enum(["config-required", "inert-dry-run-command-plan", "fixture-preview-metadata-only"]),
  working_directory: z.literal("repo-root-placeholder"),
  starts_process: z.literal(false),
  binds_port: z.literal(false),
  external_network_access: z.literal(false),
  manual_run_required: z.literal(true),
  receipt_refs: z.array(z.string().min(1)).min(1)
});
export type SafeLocalPreviewRunnerCommand = z.infer<typeof SafeLocalPreviewRunnerCommandSchema>;

export const SafeLocalPreviewRunnerConfigSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-config.v1"),
  mode: SafeLocalPreviewRunnerModeSchema,
  host: z.enum(["localhost", "127.0.0.1"]),
  port: z.union([z.literal("config-required"), z.literal("placeholder"), z.literal("metadata-port-placeholder")]),
  command: SafeLocalPreviewRunnerCommandSchema,
  working_directory: z.literal("repo-root-placeholder"),
  bind_by_default: z.literal(false),
  starts_process: z.literal(false),
  starts_process_in_ci_or_default_mode: z.literal(false),
  external_network_access: z.literal(false),
  public_url: z.null(),
  tunnel_provider: z.enum(["none", "config-required"]),
  production_mode: z.literal(false),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  read_only: z.literal(true),
  manual_run_required: z.literal(true),
  receipt_refs: z.array(z.string().min(1)).min(1)
});
export type SafeLocalPreviewRunnerConfig = z.infer<typeof SafeLocalPreviewRunnerConfigSchema>;

export const SafeLocalPreviewRunnerSafetyPolicySchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-safety-policy.v1"),
  denies: z.array(z.string().min(1)).min(1),
  allows: z.array(z.string().min(1)).min(1),
  allowed_hosts: z.tuple([z.literal("localhost"), z.literal("127.0.0.1")]),
  allowed_runner_modes: z.array(SafeLocalPreviewRunnerModeSchema).min(1),
  blocked_future_modes: z.array(SafeLocalPreviewRunnerModeSchema).min(1)
});
export type SafeLocalPreviewRunnerSafetyPolicy = z.infer<typeof SafeLocalPreviewRunnerSafetyPolicySchema>;

export const SafeLocalPreviewRunnerSafetyDecisionSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-safety-decision.v1"),
  allowed: z.boolean(),
  runner_mode: z.string().min(1),
  connection_mode: z.string().min(1),
  summary: z.string().min(1),
  reasons: z.array(z.string().min(1)).min(1)
});
export type SafeLocalPreviewRunnerSafetyDecision = z.infer<typeof SafeLocalPreviewRunnerSafetyDecisionSchema>;

const ChecklistItemSchema = z.object({ check_id: z.string().min(1), statement: z.string().min(1), required: z.literal(true), status: z.enum(["satisfied", "manual", "blocked"]) });
export type SafeLocalPreviewRunnerChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const SafeLocalPreviewRunnerManualRunChecklistSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-manual-run-checklist.v1"),
  build: z.literal(22),
  runner_mode: SafeLocalPreviewRunnerModeSchema,
  command_plan: SafeLocalPreviewRunnerCommandSchema,
  checklist_items: z.array(ChecklistItemSchema).min(1),
  expected_manual_verification_steps: z.array(z.string().min(1)).min(1),
  known_gaps: z.array(z.string().min(1)).min(1),
  receipt_preview_refs: z.array(z.string().min(1)).min(1),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  manual_run_required: z.literal(true)
});
export type SafeLocalPreviewRunnerManualRunChecklist = z.infer<typeof SafeLocalPreviewRunnerManualRunChecklistSchema>;

export const SafeLocalPreviewRunnerReceiptPreviewSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-receipt-preview.v1"),
  build: z.literal(22),
  branch: z.literal("agent/safe-local-preview-runner"),
  target_title: z.literal("Safe Local Preview Runner / Manual Developer-Mode Connection Checklist"),
  runner_mode: SafeLocalPreviewRunnerModeSchema,
  result_status: z.enum(["ready", "blocked"]),
  safety_decision_summary: z.string().min(1),
  manual_gating_summary: z.string().min(1),
  read_only_preview_fixture_status: z.string().min(1),
  no_secret_statement: z.string().min(1),
  no_production_statement: z.string().min(1),
  no_public_submission_statement: z.string().min(1),
  no_money_statement: z.string().min(1),
  no_default_binding_statement: z.string().min(1),
  no_process_start_statement: z.string().min(1),
  no_tunnel_statement: z.string().min(1),
  no_public_endpoint_statement: z.string().min(1),
  public_private_boundary_statement: z.string().min(1),
  safety_decision: SafeLocalPreviewRunnerSafetyDecisionSchema,
  receipt_refs: z.array(z.string().min(1)).min(1),
  replay_receipt_event_preview: z.record(z.unknown())
});
export type SafeLocalPreviewRunnerReceiptPreview = z.infer<typeof SafeLocalPreviewRunnerReceiptPreviewSchema>;

export const SafeLocalPreviewRunnerReadinessReportSchema = z.object({
  schema_version: z.literal("stealtheye-safe-local-preview-runner-readiness-report.v1"),
  build: z.literal(22),
  current_build21_baseline: z.string().min(1),
  runner_modes_allowed: z.tuple([z.literal("disabled"), z.literal("dry_run_only"), z.literal("manual_config_required"), z.literal("fixture_preview_only"), z.literal("manual_localhost_ready")]),
  runner_modes_blocked: z.tuple([z.literal("auto_start_future"), z.literal("hosted_public_future"), z.literal("tunnel_future"), z.literal("production_future")]),
  configs: z.array(SafeLocalPreviewRunnerConfigSchema).min(1),
  manual_run_checklist: SafeLocalPreviewRunnerManualRunChecklistSchema,
  safety_policy: SafeLocalPreviewRunnerSafetyPolicySchema,
  safety_decision: SafeLocalPreviewRunnerSafetyDecisionSchema,
  receipt_preview: SafeLocalPreviewRunnerReceiptPreviewSchema,
  bind_by_default: z.literal(false),
  starts_process: z.literal(false),
  starts_process_in_ci_or_default_mode: z.literal(false),
  external_network_access: z.literal(false),
  production_mode: z.literal(false),
  public_url: z.null(),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  manual_run_required: z.literal(true)
});
export type SafeLocalPreviewRunnerReadinessReport = z.infer<typeof SafeLocalPreviewRunnerReadinessReportSchema>;

type SafetyInput = Omit<Partial<SafeLocalPreviewRunnerConfig>, "bind_by_default" | "starts_process" | "starts_process_in_ci_or_default_mode" | "external_network_access" | "production_mode" | "read_only" | "fixture_only" | "preview_only" | "manual_run_required"> & {
  runner_mode?: string;
  connection_mode?: string;
  bind_by_default?: boolean;
  starts_process?: boolean;
  starts_process_in_ci_or_default_mode?: boolean;
  external_network_access?: boolean;
  production_mode?: boolean;
  read_only?: boolean;
  fixture_only?: boolean;
  preview_only?: boolean;
  manual_run_required?: boolean;
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
  productionMode?: boolean;
  autoStartMode?: boolean;
};

export const createSafeLocalPreviewRunnerSafetyPolicy = (): SafeLocalPreviewRunnerSafetyPolicy => SafeLocalPreviewRunnerSafetyPolicySchema.parse({
  schema_version: "stealtheye-safe-local-preview-runner-safety-policy.v1",
  allowed_hosts: ["localhost", "127.0.0.1"],
  allowed_runner_modes: [...safeLocalPreviewRunnerAllowedModes],
  blocked_future_modes: [...safeLocalPreviewRunnerBlockedFutureModes],
  denies: ["credentials_tokens_passwords_private_keys_oauth_secrets", "production_deployment", "public_app_submission", "real_domains", "real_app_ids", "production_oauth_clients", "real_public_endpoints", "customer_private_data_workflows", "unrestricted_live_writes", "protected_branch_mutation", "destructive_actions", "production_mutations", "money_movement", "material_external_sends", "credential_entry_or_storage", "external_side_effects", "unsafe_command_strings", "unsafe_working_directories", "unsafe_host", "unsafe_port", "unsafe_resource_uri_schemes", "remote_scripts_styles_assets", "server_binding_by_default", "process_start_in_ci_default_mode", "external_network_access", "tunnel_provider_live_enablement", "hosted_public_mode", "production_mode", "auto_start_mode", "missing_read_only_preview_manual_gating_flags", "missing_receipt_references", "unknown_runner_or_connection_modes"],
  allows: ["dry_run_command_planning", "fixture_preview_metadata", "read_only_mcp_resource_metadata", "manual_local_preview_checklist_metadata", "manual_developer_mode_connection_checklist_metadata", "localhost_config_required_metadata", "safe_settings_summaries", "receipt_preview_display", "deterministic_local_only_instructions_that_do_not_execute_in_default_mode"]
});

export const createSafeLocalPreviewRunnerCommand = (mode: SafeLocalPreviewRunnerMode = "disabled"): SafeLocalPreviewRunnerCommand => {
  const kind = mode === "manual_config_required" || mode === "manual_localhost_ready" ? "config-required" : mode === "fixture_preview_only" ? "fixture-metadata" : "inert";
  return SafeLocalPreviewRunnerCommandSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-command.v1", command_id: `build22-safe-local-preview-runner-${mode.replace(/_/g, "-")}`, command_kind: kind, command_label: kind === "config-required" ? "config-required" : kind === "fixture-metadata" ? "fixture-preview-metadata-only" : "inert-dry-run-command-plan", working_directory: "repo-root-placeholder", starts_process: false, binds_port: false, external_network_access: false, manual_run_required: true, receipt_refs: [`receipt.build22.safe_local_preview_runner.${mode}`] });
};

export const createSafeLocalPreviewRunnerConfig = (mode: SafeLocalPreviewRunnerMode = "disabled"): SafeLocalPreviewRunnerConfig => {
  const command = createSafeLocalPreviewRunnerCommand(mode);
  return SafeLocalPreviewRunnerConfigSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-config.v1", mode, host: mode === "disabled" ? "localhost" : "127.0.0.1", port: mode === "manual_config_required" ? "config-required" : mode === "manual_localhost_ready" ? "metadata-port-placeholder" : "placeholder", command, working_directory: "repo-root-placeholder", bind_by_default: false, starts_process: false, starts_process_in_ci_or_default_mode: false, external_network_access: false, public_url: null, tunnel_provider: mode === "manual_config_required" ? "config-required" : "none", production_mode: false, fixture_only: true, preview_only: true, read_only: true, manual_run_required: true, receipt_refs: command.receipt_refs });
};

export const decideSafeLocalPreviewRunnerSafety = (input: SafetyInput): SafeLocalPreviewRunnerSafetyDecision => {
  const mode = input.runner_mode ?? input.mode ?? "disabled";
  const connectionMode = input.connection_mode ?? "manual_developer_mode_checklist";
  const reasons: string[] = [];
  const deny = (flag: unknown, reason: string) => { if (flag) reasons.push(reason); };
  deny(input.productionDeployment, "production deployment denied"); deny(input.publicAppSubmission, "public app submission denied"); deny(input.realOAuthClient, "real OAuth client denied"); deny(input.realAppId, "real app ID denied"); deny(input.productionDomain, "production domain denied"); deny(input.realPublicEndpoint, "real public endpoint denied"); deny(input.unrestrictedLiveWrite, "unrestricted live write denied"); deny(input.protectedBranchMutation, "protected branch mutation denied"); deny(input.destructive, "destructive action denied"); deny(input.productionMutation, "production mutation denied"); deny(input.customerPrivateData, "customer/private data denied"); deny(input.moneyMovement, "money movement denied"); deny(input.materialExternalSend, "material external send denied"); deny(input.credentialEntryStorage, "credential entry/storage denied"); deny(input.externalSideEffects, "external side effects denied");
  if (input.unsafeCommandString || (input.command?.command_label !== undefined && !["config-required", "inert-dry-run-command-plan", "fixture-preview-metadata-only"].includes(String(input.command.command_label)))) reasons.push("unsafe command string denied");
  if (input.unsafeWorkingDirectory || (input.working_directory !== undefined && input.working_directory !== "repo-root-placeholder")) reasons.push("unsafe working directory denied");
  if (input.unsafeHost || (input.host !== undefined && !["localhost", "127.0.0.1"].includes(String(input.host)))) reasons.push("unsafe host denied");
  if (input.unsafePort || (input.port !== undefined && !["config-required", "placeholder", "metadata-port-placeholder"].includes(String(input.port)))) reasons.push("unsafe port denied");
  deny(input.unsafeResourceUriScheme, "unsafe resource URI scheme denied"); deny(input.remoteAsset, "remote asset/script/style denied");
  if (input.serverBindingByDefault || input.bind_by_default === true) reasons.push("server binding by default denied");
  if (input.startsProcessInDefaultOrCi || input.starts_process === true || input.starts_process_in_ci_or_default_mode === true) reasons.push("process start in CI/default mode denied");
  if (input.externalNetworkAccess || input.external_network_access === true) reasons.push("external network access denied");
  if (input.tunnelProviderLiveEnablement || ![undefined, "none", "config-required"].includes(input.tunnel_provider)) reasons.push("tunnel provider live enablement denied");
  if (input.hostedPublicMode || mode === "hosted_public_future") reasons.push("hosted/public mode denied");
  if (input.autoStartMode || mode === "auto_start_future") reasons.push("auto-start mode denied");
  if (input.productionMode || input.production_mode === true || mode === "production_future") reasons.push("production mode denied");
  if (mode === "tunnel_future") reasons.push("tunnel future mode denied");
  if (input.read_only !== undefined && input.read_only !== true) reasons.push("missing read-only/preview/manual-gating flags denied");
  if (input.preview_only !== undefined && input.preview_only !== true) reasons.push("missing read-only/preview/manual-gating flags denied");
  if (input.fixture_only !== undefined && input.fixture_only !== true) reasons.push("missing read-only/preview/manual-gating flags denied");
  if (input.manual_run_required !== undefined && input.manual_run_required !== true) reasons.push("missing read-only/preview/manual-gating flags denied");
  if (input.receipt_refs !== undefined && input.receipt_refs.length === 0) reasons.push("missing receipt refs denied");
  if (!safeLocalPreviewRunnerAllowedModes.includes(mode as (typeof safeLocalPreviewRunnerAllowedModes)[number]) && !safeLocalPreviewRunnerBlockedFutureModes.includes(mode as (typeof safeLocalPreviewRunnerBlockedFutureModes)[number])) reasons.push("unknown runner or connection mode denied");
  if (!["manual_developer_mode_checklist", "metadata_only_config_required"].includes(connectionMode)) reasons.push("unknown runner or connection mode denied");
  return SafeLocalPreviewRunnerSafetyDecisionSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-safety-decision.v1", allowed: reasons.length === 0, runner_mode: String(mode), connection_mode: connectionMode, summary: reasons.length === 0 ? "Safe local preview runner metadata allowed; no server binding or process start occurs in default mode." : "Safe local preview runner request blocked by Build 22 safety policy.", reasons: reasons.length === 0 ? ["safe local preview runner metadata allowed"] : reasons });
};

const baseManualRunChecks = (): SafeLocalPreviewRunnerChecklistItem[] => ["build21-baseline", "build22-runner-readiness", "manual-local-endpoint-prerequisites", "no-secret", "no-production", "no-public-submission", "no-real-app-id", "no-production-oauth", "no-tunnel", "no-customer-private-data", "no-unrestricted-write", "no-protected-branch-mutation", "no-destructive-action", "no-money-movement", "no-material-external-send", "no-default-binding", "no-process-start", "no-remote-asset-script-style", "receipt-preview-references"].map((check_id) => ({ check_id, statement: `Build 22 required check: ${check_id}.`, required: true as const, status: check_id.includes("prerequisites") ? "manual" as const : "satisfied" as const }));

export const createSafeLocalPreviewRunnerManualRunChecklist = (mode: SafeLocalPreviewRunnerMode = "manual_config_required"): SafeLocalPreviewRunnerManualRunChecklist => {
  const commandPlan = createSafeLocalPreviewRunnerCommand(mode);
  return SafeLocalPreviewRunnerManualRunChecklistSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-manual-run-checklist.v1", build: 22, runner_mode: mode, command_plan: commandPlan, checklist_items: baseManualRunChecks(), expected_manual_verification_steps: ["Review Build 22 readiness metadata from MCP resources.", "Verify localhost-only config-required settings before future manual preview.", "Verify no public endpoint, tunnel, production OAuth, real app identifier, credential flow, or customer/private data appears.", "Record only the public-safe receipt preview as handoff evidence."], known_gaps: ["Manual local preview execution remains gated and config-required.", "No real ChatGPT app is created or submitted.", "No durable live preview ledger exists beyond public-safe receipt preview metadata."], receipt_preview_refs: commandPlan.receipt_refs, read_only: true, fixture_only: true, preview_only: true, manual_run_required: true });
};

export const createSafeLocalPreviewRunnerReceiptPreview = (mode: SafeLocalPreviewRunnerMode = "manual_config_required"): SafeLocalPreviewRunnerReceiptPreview => {
  const config = createSafeLocalPreviewRunnerConfig(mode);
  const safetyDecision = decideSafeLocalPreviewRunnerSafety({ runner_mode: mode, connection_mode: "manual_developer_mode_checklist", ...config });
  const replayEvent = ReceiptEventSchema.parse({ schema_version: "receipts-replay-event.v1", event_id: `build22-safe-local-preview-runner-${mode}`, mission_id: "build-022-safe-local-preview-runner", source_subsystem: "app_host", event_type: "artifact_recorded", actor_id: "@stealtheye/mcp-server", subject_id: config.command.command_id, action_id: "safe_local_preview_runner_receipt_preview", timestamp: "2026-01-01T00:00:00.000Z", status_before: null, status_after: safetyDecision.allowed ? "ready" : "blocked", summary: `Safe local preview runner receipt preview for ${mode}.`, reason_codes: safetyDecision.reasons, evidence_refs: [], artifact_refs: ["receipt://fixture/build-022/safe-local-preview-runner"], receipt_refs: config.receipt_refs, related_event_ids: [], public_private_boundary: "public_safe", sensitivity: "public", retention_hint: "generated Build 22 fixture receipt preview" });
  return SafeLocalPreviewRunnerReceiptPreviewSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-receipt-preview.v1", build: 22, branch: "agent/safe-local-preview-runner", target_title: "Safe Local Preview Runner / Manual Developer-Mode Connection Checklist", runner_mode: mode, result_status: safetyDecision.allowed ? "ready" : "blocked", safety_decision_summary: safetyDecision.summary, manual_gating_summary: "Manual run is required; Build 22 never starts a process or binds a server in default mode.", read_only_preview_fixture_status: "Read-only by default, preview-only, fixture-safe, and public-safe.", no_secret_statement: "No credentials, tokens, passwords, private keys, OAuth secrets, tunnel tokens, or credential entry/storage flows are included.", no_production_statement: "No production deployment, production OAuth, production mutation, production domain, or hosted production mode is included.", no_public_submission_statement: "No real ChatGPT app is created, registered, submitted, published, or assigned a real app identifier.", no_money_statement: "No billing, purchase, subscription, refund, or money movement behavior is included.", no_default_binding_statement: "No server binds by default; host and port remain localhost/config-required metadata only.", no_process_start_statement: "No process starts in CI or default mode; command plans are inert metadata only.", no_tunnel_statement: "No tunnel is enabled and no tunnel credential is accepted or stored.", no_public_endpoint_statement: "No public endpoint or real public URL is produced.", public_private_boundary_statement: "Committed artifacts contain deterministic public-safe placeholders and no private/customer/production material.", safety_decision: safetyDecision, receipt_refs: config.receipt_refs, replay_receipt_event_preview: replayEvent });
};

export const createSafeLocalPreviewRunnerReadinessReport = (): SafeLocalPreviewRunnerReadinessReport => SafeLocalPreviewRunnerReadinessReportSchema.parse({ schema_version: "stealtheye-safe-local-preview-runner-readiness-report.v1", build: 22, current_build21_baseline: "Build 21 controlled localhost preview command/readiness metadata is the merged baseline for Build 22.", runner_modes_allowed: [...safeLocalPreviewRunnerAllowedModes], runner_modes_blocked: [...safeLocalPreviewRunnerBlockedFutureModes], configs: safeLocalPreviewRunnerAllowedModes.map((mode) => createSafeLocalPreviewRunnerConfig(mode)), manual_run_checklist: createSafeLocalPreviewRunnerManualRunChecklist("manual_config_required"), safety_policy: createSafeLocalPreviewRunnerSafetyPolicy(), safety_decision: decideSafeLocalPreviewRunnerSafety({ runner_mode: "manual_config_required", ...createSafeLocalPreviewRunnerConfig("manual_config_required") }), receipt_preview: createSafeLocalPreviewRunnerReceiptPreview("manual_config_required"), bind_by_default: false, starts_process: false, starts_process_in_ci_or_default_mode: false, external_network_access: false, production_mode: false, public_url: null, read_only: true, fixture_only: true, preview_only: true, manual_run_required: true });
