import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const GuardSchemaVersion = {
  CapabilityToken: "capability-token.v1",
  RequestedAction: "requested-action.v1",
  GuardDecision: "guard-decision.v1",
  GuardDecisionReceipt: "guard-decision-receipt.v1"
} as const;

export const DigestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const SubjectTypeSchema = z.enum(["agent", "worker", "user", "service"]);
export const AuthorityOriginSchema = z.enum(["user_chat", "repo_policy", "system_policy", "verifier"]);
export const CapabilityTokenStatusSchema = z.enum(["active", "expired", "revoked", "exhausted", "suspended"]);
export const GuardDecisionResultSchema = z.enum(["allow", "deny", "escalate", "warn"]);
export const TrustStatusRequirementSchema = z.enum(["trusted", "approved", "trusted_and_approved"]);
export const RegistryTrustStatusSchema = z.enum(["trusted", "untrusted", "revoked", "needs_review", "missing"]);
export const RegistryReviewStatusSchema = z.enum(["unreviewed", "reviewed", "approved", "rejected", "missing"]);

export const EffectSchema = z.enum([
  "read_repo",
  "read_logs",
  "write_branch_files",
  "commit_branch",
  "open_pr",
  "read_ci",
  "rerun_failed_jobs",
  "browser_observe",
  "write_receipt",
  "generate_final_report",
  "production_deploy",
  "production_data_mutation",
  "money_movement",
  "raw_secret_access",
  "protected_branch_mutation",
  "force_push",
  "history_rewrite",
  "weaken_ci",
  "delete_test_to_pass",
  "database_migration",
  "auth_security_change",
  "external_send",
  "legal_commitment",
  "destructive_delete",
  "platform_required_confirmation"
]);

export const HardStopCategorySchema = z.enum([
  "deletion_destruction",
  "raw_secrets_credentials",
  "money_billing_subscriptions",
  "production_deploy_or_data_mutation",
  "production_impacting_migration",
  "auth_security_critical_change",
  "protected_branch_mutation",
  "force_push_history_rewrite",
  "weaken_ci_tests_security",
  "material_external_send",
  "legal_commitment",
  "platform_required_confirmation"
]);

export const TargetConstraintsSchema = z.object({
  repositories: z.array(z.string()).default([]),
  branches: z.array(z.string()).default([]),
  branch_prefixes: z.array(z.string()).default([]),
  paths: z.array(z.string()).default([]),
  systems: z.array(z.string()).default([]),
  environments: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  accounts: z.array(z.string()).default([])
});

export const ToolManifestConstraintsSchema = z.object({
  allowed_agent_ids: z.array(z.string()).default([]),
  allowed_manifest_ids: z.array(z.string()).default([]),
  pinned_digests: z.array(DigestSchema).default([]),
  required_trust_status: TrustStatusRequirementSchema.optional()
});

export const UsageConstraintsSchema = z.object({
  max_uses: z.number().int().positive().optional(),
  max_attempts: z.number().int().positive().optional(),
  max_commits: z.number().int().positive().optional(),
  max_cost_cents: z.number().int().nonnegative().optional(),
  uses: z.number().int().nonnegative().default(0),
  attempts: z.number().int().nonnegative().default(0),
  commits: z.number().int().nonnegative().default(0),
  cost_cents: z.number().int().nonnegative().default(0)
});

export const CapabilityTokenSchema = z.object({
  schema_version: z.literal(GuardSchemaVersion.CapabilityToken),
  token_id: z.string().min(1),
  mission_id: z.string().min(1),
  issued_to: z.string().min(1),
  issued_by: z.string().min(1),
  subject_type: SubjectTypeSchema,
  authority_origin: AuthorityOriginSchema,
  allowed_effects: z.array(EffectSchema).default([]),
  denied_effects: z.array(EffectSchema).default([]),
  forbidden_effects: z.array(EffectSchema).default([]),
  hard_stops: z.array(HardStopCategorySchema).default([]),
  target_constraints: TargetConstraintsSchema.default({}),
  tool_manifest_constraints: ToolManifestConstraintsSchema.default({}),
  issued_at: z.string().datetime(),
  valid_until: z.string().datetime(),
  usage_constraints: UsageConstraintsSchema.default({}),
  evidence_requirements: z.array(z.string()).default([]),
  receipt_requirements: z.array(z.string()).default([]),
  escalation_requirements: z.array(z.string()).default([]),
  digest: DigestSchema.optional(),
  signature_refs: z.array(z.string()).default([]),
  status: CapabilityTokenStatusSchema
});

export const RequestedTargetSchema = z.object({
  repo: z.string().optional(),
  branch: z.string().optional(),
  path: z.string().optional(),
  environment: z.string().optional(),
  domain: z.string().optional(),
  account: z.string().optional(),
  system: z.string().optional(),
  resource_id: z.string().optional()
});

export const RequestedActionSchema = z.object({
  schema_version: z.literal(GuardSchemaVersion.RequestedAction),
  action_id: z.string().min(1),
  mission_id: z.string().min(1),
  actor_id: z.string().min(1),
  subject_type: SubjectTypeSchema,
  effect: EffectSchema,
  target: RequestedTargetSchema.default({}),
  agent_id: z.string().optional(),
  manifest_id: z.string().optional(),
  manifest_digest: DigestSchema.optional(),
  key_id: z.string().optional(),
  risk_indicators: z.array(z.string()).default([]),
  side_effects: z.array(z.string()).default([]),
  requested_at: z.string().datetime(),
  idempotency_key: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
  evidence_refs: z.array(z.string()).default([])
});

export const RegistryTrustSummarySchema = z.object({
  trusted: z.boolean(),
  valid: z.boolean(),
  trust_status: RegistryTrustStatusSchema,
  review_status: RegistryReviewStatusSchema,
  digest: DigestSchema.optional(),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  revoked: z.boolean().default(false)
});

export const PolicyCheckSchema = z.object({
  check_id: z.string().min(1),
  passed: z.boolean(),
  reason_codes: z.array(z.string()).default([]),
  summary: z.string().min(1)
});

export const GuardDecisionSchema = z.object({
  schema_version: z.literal(GuardSchemaVersion.GuardDecision),
  decision_id: z.string().min(1),
  action_id: z.string().min(1),
  mission_id: z.string().min(1),
  actor_id: z.string().min(1),
  decision: GuardDecisionResultSchema,
  reason_codes: z.array(z.string()).default([]),
  summary: z.string().min(1),
  matched_capability_token_ids: z.array(z.string()).default([]),
  matched_hard_stops: z.array(HardStopCategorySchema).default([]),
  registry_trust_result: RegistryTrustSummarySchema.optional(),
  policy_checks: z.array(PolicyCheckSchema).default([]),
  evidence_required: z.array(z.string()).default([]),
  receipt_required: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  expires_at: z.string().datetime().optional()
});

export const GuardDecisionReceiptSchema = z.object({
  schema_version: z.literal(GuardSchemaVersion.GuardDecisionReceipt),
  receipt_id: z.string().min(1),
  decision_id: z.string().min(1),
  mission_id: z.string().min(1),
  action_id: z.string().min(1),
  actor_id: z.string().min(1),
  requested_effect: EffectSchema,
  target_summary: z.record(z.string()).default({}),
  capability_token_ids_considered: z.array(z.string()).default([]),
  capability_token_ids_matched: z.array(z.string()).default([]),
  policy_checks: z.array(PolicyCheckSchema).default([]),
  hard_stops_matched: z.array(HardStopCategorySchema).default([]),
  registry_trust_summary: RegistryTrustSummarySchema.optional(),
  decision_result: GuardDecisionResultSchema,
  reason_codes: z.array(z.string()).default([]),
  timestamp: z.string().datetime(),
  evidence_refs: z.array(z.string()).default([])
});

export type Effect = z.infer<typeof EffectSchema>;
export type HardStopCategory = z.infer<typeof HardStopCategorySchema>;
export type CapabilityToken = z.infer<typeof CapabilityTokenSchema>;
export type RequestedAction = z.infer<typeof RequestedActionSchema>;
export type RegistryTrustSummary = z.infer<typeof RegistryTrustSummarySchema>;
export type PolicyCheck = z.infer<typeof PolicyCheckSchema>;
export type GuardDecision = z.infer<typeof GuardDecisionSchema>;
export type GuardDecisionReceipt = z.infer<typeof GuardDecisionReceiptSchema>;

export const GuardJsonSchemas = {
  capabilityToken: zodToJsonSchema(CapabilityTokenSchema, "CapabilityToken"),
  requestedAction: zodToJsonSchema(RequestedActionSchema, "RequestedAction"),
  guardDecision: zodToJsonSchema(GuardDecisionSchema, "GuardDecision"),
  guardDecisionReceipt: zodToJsonSchema(GuardDecisionReceiptSchema, "GuardDecisionReceipt")
};
