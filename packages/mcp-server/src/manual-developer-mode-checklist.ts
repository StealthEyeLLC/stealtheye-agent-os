import { z } from "zod";
import { SafeLocalPreviewRunnerReceiptPreviewSchema, createSafeLocalPreviewRunnerManualRunChecklist, createSafeLocalPreviewRunnerReadinessReport, createSafeLocalPreviewRunnerReceiptPreview } from "./safe-local-preview-runner";

const ChecklistItemSchema = z.object({ check_id: z.string().min(1), statement: z.string().min(1), required: z.literal(true), status: z.enum(["satisfied", "manual", "blocked"]) });
export type ManualDeveloperModeConnectionChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const ManualDeveloperModeConnectionChecklistSchema = z.object({
  schema_version: z.literal("stealtheye-manual-developer-mode-connection-checklist.v1"),
  build: z.literal(22),
  connection_mode: z.literal("manual_developer_mode_checklist"),
  current_build21_baseline: z.string().min(1),
  build22_runner_readiness_summary: z.string().min(1),
  manual_local_endpoint_prerequisites: z.array(z.string().min(1)).min(1),
  manual_developer_mode_connection_prerequisites: z.array(z.string().min(1)).min(1),
  checklist_items: z.array(ChecklistItemSchema).min(1),
  expected_manual_verification_steps: z.array(z.string().min(1)).min(1),
  known_gaps: z.array(z.string().min(1)).min(1),
  receipt_preview_refs: z.array(z.string().min(1)).min(1),
  creates_real_chatgpt_app: z.literal(false),
  registers_chatgpt_app: z.literal(false),
  submits_public_app: z.literal(false),
  includes_real_app_id: z.literal(false),
  includes_production_oauth_client: z.literal(false),
  includes_real_public_url: z.literal(false),
  stores_credentials: z.literal(false),
  enables_tunnel: z.literal(false),
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  manual_connection_required: z.literal(true)
});
export type ManualDeveloperModeConnectionChecklist = z.infer<typeof ManualDeveloperModeConnectionChecklistSchema>;

export const ManualDeveloperModeConnectionManifestSchema = z.object({
  schema_version: z.literal("stealtheye-manual-developer-mode-connection-manifest.v1"),
  build: z.literal(22),
  manifest_uri: z.literal("developer-mode-checklist://stealtheye/control-plane/manual-connection"),
  connection_mode: z.literal("manual_developer_mode_checklist"),
  checklist: ManualDeveloperModeConnectionChecklistSchema,
  runner_receipt_preview: SafeLocalPreviewRunnerReceiptPreviewSchema,
  read_only: z.literal(true),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  public_safe: z.literal(true)
});
export type ManualDeveloperModeConnectionManifest = z.infer<typeof ManualDeveloperModeConnectionManifestSchema>;

const checklistIds = ["build21-baseline", "build22-runner-readiness", "manual-local-endpoint-prerequisites", "manual-developer-mode-connection-prerequisites", "no-secret", "no-production", "no-public-submission", "no-real-app-id", "no-production-oauth", "no-tunnel", "no-customer-private-data", "no-unrestricted-write", "no-protected-branch-mutation", "no-destructive-action", "no-money-movement", "no-material-external-send", "no-default-binding", "no-process-start", "no-remote-asset-script-style", "expected-manual-verification", "receipt-preview-references"] as const;

const createChecklistItems = (): ManualDeveloperModeConnectionChecklistItem[] => checklistIds.map((check_id) => ({
  check_id,
  statement: `Build 22 manual developer-mode connection required check: ${check_id}.`,
  required: true,
  status: check_id.includes("prerequisites") || check_id === "expected-manual-verification" ? "manual" : "satisfied"
}));

export const createManualDeveloperModeConnectionChecklist = (): ManualDeveloperModeConnectionChecklist => {
  const readiness = createSafeLocalPreviewRunnerReadinessReport();
  const manualRunChecklist = createSafeLocalPreviewRunnerManualRunChecklist("manual_config_required");
  return ManualDeveloperModeConnectionChecklistSchema.parse({
    schema_version: "stealtheye-manual-developer-mode-connection-checklist.v1",
    build: 22,
    connection_mode: "manual_developer_mode_checklist",
    current_build21_baseline: readiness.current_build21_baseline,
    build22_runner_readiness_summary: "Safe local preview runner metadata is present, read-only, preview-only, fixture-safe, and manually gated.",
    manual_local_endpoint_prerequisites: ["Use only localhost or loopback placeholders.", "Use only config-required or metadata-only port placeholders.", "Keep future local preview manual and outside CI/default mode."],
    manual_developer_mode_connection_prerequisites: ["Developer mode remains a manual checklist step in Build 22.", "No real ChatGPT app creation, app registration, app submission, real app identifier, production OAuth, or public endpoint is performed.", "Receipt preview references must be retained for verifier handoff evidence."],
    checklist_items: createChecklistItems(),
    expected_manual_verification_steps: ["Inspect Build 22 MCP readiness, manual-run checklist, developer-mode checklist, and receipt-preview resources.", "Confirm the checklist contains no-secret, no-production, no-public-submission, no-tunnel, no-default-binding, and no-process-start checks.", "Confirm manual developer-mode connection remains checklist-only and creates no real ChatGPT app."],
    known_gaps: manualRunChecklist.known_gaps,
    receipt_preview_refs: manualRunChecklist.receipt_preview_refs,
    creates_real_chatgpt_app: false,
    registers_chatgpt_app: false,
    submits_public_app: false,
    includes_real_app_id: false,
    includes_production_oauth_client: false,
    includes_real_public_url: false,
    stores_credentials: false,
    enables_tunnel: false,
    read_only: true,
    fixture_only: true,
    preview_only: true,
    manual_connection_required: true
  });
};

export const createManualDeveloperModeConnectionManifest = (): ManualDeveloperModeConnectionManifest => ManualDeveloperModeConnectionManifestSchema.parse({
  schema_version: "stealtheye-manual-developer-mode-connection-manifest.v1",
  build: 22,
  manifest_uri: "developer-mode-checklist://stealtheye/control-plane/manual-connection",
  connection_mode: "manual_developer_mode_checklist",
  checklist: createManualDeveloperModeConnectionChecklist(),
  runner_receipt_preview: createSafeLocalPreviewRunnerReceiptPreview("manual_config_required"),
  read_only: true,
  fixture_only: true,
  preview_only: true,
  public_safe: true
});
