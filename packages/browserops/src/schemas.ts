import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const BrowserOpsSchemaVersion = {
  BrowserSession: "browserops-browser-session.v1",
  PageObservation: "browserops-page-observation.v1",
  BrowserEvidenceRef: "browserops-evidence-ref.v1",
  BrowserAction: "browserops-action.v1",
  BrowserActionPlan: "browserops-action-plan.v1",
  BrowserPreflightSummary: "browserops-preflight-summary.v1"
} as const;

export const DigestRefSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const BrowserSensitivitySchema = z.enum(["public", "internal", "confidential", "restricted"]);
export const BrowserRiskTierSchema = z.enum(["low", "medium", "high", "blocked"]);
export const EvidenceRefSchema = z.string().min(1);
export const ReceiptRefSchema = z.string().min(1);

export const IsolationModeSchema = z.enum(["fixture_only", "isolated_ephemeral", "persistent_profile_future", "remote_browser_future"]);
export const CredentialModeSchema = z.enum(["none", "user_supplied_future", "brokered_secret_future"]);
export const BrowserSessionStatusSchema = z.enum(["planned", "active", "blocked", "completed", "expired", "failed"]);
export const BrowserActionCategorySchema = z.enum(["observation", "navigation", "form_input", "extraction", "artifact_capture", "external_send", "money", "auth", "destructive", "production_mutation"]);
export const BrowserActionKindSchema = z.enum(["observe_page", "navigate", "wait_for_selector", "screenshot", "extract_text", "click", "fill_form", "select_option", "download_file_metadata", "upload_file_future", "external_send", "purchase_or_payment", "auth_submit", "destructive_confirm", "production_mutation"]);
export const BrowserActionPlanStatusSchema = z.enum(["draft", "ready_for_preflight", "preflight_failed", "approved_for_observation", "approved_for_preview", "blocked", "completed_in_fixture", "failed"]);
export const BrowserEvidenceKindSchema = z.enum(["screenshot", "dom_snapshot", "accessibility_tree", "console_log", "network_log", "trace", "har", "video", "downloaded_file_metadata"]);

export const PublicSafeBrowserUriSchema = z.string().min(1).refine((uri) => {
  const normalized = uri.toLowerCase();
  return normalized.startsWith("test://")
    || normalized.startsWith("artifact://fixture/")
    || normalized === "example.test"
    || normalized.startsWith("example.test/")
    || normalized.startsWith("https://example.test/")
    || normalized.startsWith("http://example.test/");
}, "BrowserOps fixtures and evidence references must use public-safe fixture URIs only.");

export const BrowserEvidenceRefSchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.BrowserEvidenceRef),
  evidence_id: z.string().min(1),
  session_id: z.string().min(1),
  task_id: z.string().min(1),
  kind: BrowserEvidenceKindSchema,
  uri: PublicSafeBrowserUriSchema,
  digest: DigestRefSchema.optional(),
  summary: z.string().min(1),
  sensitivity: BrowserSensitivitySchema,
  created_at: z.string().datetime(),
  retention_hint: z.string().min(1)
});

export const BrowserSessionSchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.BrowserSession),
  session_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  worker_id: z.string().min(1),
  browser_context_id: z.string().min(1),
  isolation_mode: IsolationModeSchema,
  allowed_domains: z.array(z.string().min(1)).default([]),
  denied_domains: z.array(z.string().min(1)).default([]),
  allowed_actions: z.array(BrowserActionKindSchema.or(BrowserActionCategorySchema)).default([]),
  denied_actions: z.array(BrowserActionKindSchema.or(BrowserActionCategorySchema)).default([]),
  credential_mode: CredentialModeSchema,
  storage_state_ref: z.string().min(1).nullable(),
  network_policy_ref: z.string().min(1).nullable(),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([]),
  created_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  status: BrowserSessionStatusSchema
});

export const DetectedFormSchema = z.object({
  form_id: z.string().min(1),
  purpose: z.string().min(1),
  field_names: z.array(z.string().min(1)).default([]),
  sensitivity: BrowserSensitivitySchema,
  external_send_risk: z.boolean().default(false)
});

export const DetectedBrowserControlSchema = z.object({
  control_id: z.string().min(1),
  label: z.string().min(1),
  selector_ref: z.string().min(1).optional(),
  reason: z.string().min(1),
  sensitivity: BrowserSensitivitySchema
});

export const PageObservationSchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.PageObservation),
  page_state_id: z.string().min(1),
  session_id: z.string().min(1),
  url: PublicSafeBrowserUriSchema,
  domain: z.string().min(1),
  title: z.string().min(1),
  dom_snapshot_ref: z.string().min(1).nullable(),
  screenshot_ref: z.string().min(1).nullable(),
  accessibility_tree_ref: z.string().min(1).nullable(),
  console_log_refs: z.array(EvidenceRefSchema).default([]),
  network_log_refs: z.array(EvidenceRefSchema).default([]),
  storage_refs: z.array(EvidenceRefSchema).default([]),
  detected_forms: z.array(DetectedFormSchema).default([]),
  detected_external_send_controls: z.array(DetectedBrowserControlSchema).default([]),
  detected_payment_controls: z.array(DetectedBrowserControlSchema).default([]),
  detected_auth_controls: z.array(DetectedBrowserControlSchema).default([]),
  detected_destructive_controls: z.array(DetectedBrowserControlSchema).default([]),
  detected_production_controls: z.array(DetectedBrowserControlSchema).default([]),
  observed_at: z.string().datetime(),
  sensitivity: BrowserSensitivitySchema,
  evidence_refs: z.array(EvidenceRefSchema).default([])
});

export const BrowserActionSchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.BrowserAction),
  action_id: z.string().min(1),
  kind: BrowserActionKindSchema,
  category: BrowserActionCategorySchema,
  domain: z.string().min(1),
  url: PublicSafeBrowserUriSchema.optional(),
  target_ref: z.string().min(1).optional(),
  selector_ref: z.string().min(1).optional(),
  value_ref: z.string().min(1).optional(),
  preview_only: z.boolean().default(true),
  requires_guard_preflight: z.boolean().default(true),
  expected_evidence_refs: z.array(EvidenceRefSchema).default([]),
  metadata: z.record(z.unknown()).default({})
});

export const BrowserActionPlanSchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.BrowserActionPlan),
  action_plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  session_id: z.string().min(1),
  page_state_ref: z.string().min(1),
  actions: z.array(BrowserActionSchema).default([]),
  expected_effects: z.array(z.string().min(1)).default([]),
  risk_tier: BrowserRiskTierSchema,
  evidence_requirements: z.array(z.string().min(1)).default([]),
  receipt_requirements: z.array(z.string().min(1)).default([]),
  status: BrowserActionPlanStatusSchema,
  created_at: z.string().datetime()
});

export const BrowserPolicyDecisionSchema = z.object({
  action_id: z.string().min(1),
  decision: z.enum(["allow", "deny", "escalate"]),
  reason_codes: z.array(z.string().min(1)).default([]),
  summary: z.string().min(1)
});

export const BrowserPreflightSummarySchema = z.object({
  schema_version: z.literal(BrowserOpsSchemaVersion.BrowserPreflightSummary),
  preflight_id: z.string().min(1),
  action_plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  allowed: z.boolean(),
  blocked: z.boolean(),
  escalated: z.boolean(),
  reason_codes: z.array(z.string().min(1)).default([]),
  browser_policy_decisions: z.array(BrowserPolicyDecisionSchema).default([]),
  guard_decision_refs: z.array(z.string().min(1)).default([]),
  worker_task_refs: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([]),
  created_at: z.string().datetime()
});

export type BrowserSensitivity = z.infer<typeof BrowserSensitivitySchema>;
export type BrowserRiskTier = z.infer<typeof BrowserRiskTierSchema>;
export type IsolationMode = z.infer<typeof IsolationModeSchema>;
export type CredentialMode = z.infer<typeof CredentialModeSchema>;
export type BrowserSessionStatus = z.infer<typeof BrowserSessionStatusSchema>;
export type BrowserActionCategory = z.infer<typeof BrowserActionCategorySchema>;
export type BrowserActionKind = z.infer<typeof BrowserActionKindSchema>;
export type BrowserActionPlanStatus = z.infer<typeof BrowserActionPlanStatusSchema>;
export type BrowserEvidenceKind = z.infer<typeof BrowserEvidenceKindSchema>;
export type BrowserEvidenceRef = z.infer<typeof BrowserEvidenceRefSchema>;
export type BrowserSession = z.infer<typeof BrowserSessionSchema>;
export type DetectedForm = z.infer<typeof DetectedFormSchema>;
export type DetectedBrowserControl = z.infer<typeof DetectedBrowserControlSchema>;
export type PageObservation = z.infer<typeof PageObservationSchema>;
export type BrowserAction = z.infer<typeof BrowserActionSchema>;
export type BrowserActionPlan = z.infer<typeof BrowserActionPlanSchema>;
export type BrowserPolicyDecision = z.infer<typeof BrowserPolicyDecisionSchema>;
export type BrowserPreflightSummary = z.infer<typeof BrowserPreflightSummarySchema>;

export const BrowserOpsJsonSchemas = {
  browserSession: zodToJsonSchema(BrowserSessionSchema, "BrowserSession"),
  pageObservation: zodToJsonSchema(PageObservationSchema, "PageObservation"),
  browserEvidenceRef: zodToJsonSchema(BrowserEvidenceRefSchema, "BrowserEvidenceRef"),
  browserAction: zodToJsonSchema(BrowserActionSchema, "BrowserAction"),
  browserActionPlan: zodToJsonSchema(BrowserActionPlanSchema, "BrowserActionPlan"),
  browserPreflightSummary: zodToJsonSchema(BrowserPreflightSummarySchema, "BrowserPreflightSummary")
};
