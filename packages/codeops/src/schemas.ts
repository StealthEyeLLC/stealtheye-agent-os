import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const CodeOpsSchemaVersion = {
  RepoTarget: "codeops-repo-target.v1",
  FileChangeContract: "codeops-file-change-contract.v1",
  VerificationPlan: "codeops-verification-plan.v1",
  PatchPlan: "codeops-patch-plan.v1",
  CiLogSummary: "codeops-ci-log-summary.v1",
  CiRepairPlan: "codeops-ci-repair-plan.v1",
  PrEvidencePacket: "codeops-pr-evidence-packet.v1",
  PreflightSummary: "codeops-preflight-summary.v1"
} as const;

export const DigestRefSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const EvidenceRefSchema = z.string().min(1);
export const ReceiptRefSchema = z.string().min(1);
export const RiskTierSchema = z.enum(["low", "medium", "high", "blocked"]);

export const RepoTargetSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.RepoTarget),
  repo_full_name: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  base_branch: z.string().min(1),
  working_branch: z.string().min(1),
  allowed_branch_prefixes: z.array(z.string().min(1)).default([]),
  protected_branches: z.array(z.string().min(1)).default(["main", "master"]),
  allowed_paths: z.array(z.string().min(1)).default([]),
  denied_paths: z.array(z.string().min(1)).default([]),
  required_status_checks: z.array(z.string().min(1)).default([]),
  required_verification_commands: z.array(z.string().min(1)).default([]),
  public_private_boundary_notes: z.array(z.string().min(1)).default([]),
  authority_refs: z.array(z.string().min(1)).default([]),
  capability_token_refs: z.array(z.string().min(1)).default([]),
  manifest_tool_refs: z.array(z.string().min(1)).default([]),
  evidence_requirements: z.array(z.string().min(1)).default([]),
  receipt_requirements: z.array(z.string().min(1)).default([])
});

export const FileChangeOperationSchema = z.enum(["read", "create", "update", "delete", "rename"]);

export const FileChangeContractSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.FileChangeContract),
  path: z.string().min(1),
  operation: FileChangeOperationSchema,
  previous_path: z.string().min(1).optional(),
  before_digest_ref: DigestRefSchema.or(z.string().min(1)).optional(),
  after_digest_ref: DigestRefSchema.or(z.string().min(1)).optional(),
  summary: z.string().min(1),
  risk_indicators: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([])
});

export const VerificationCommandSchema = z.object({
  command: z.string().min(1),
  required: z.boolean().default(true),
  reason: z.string().min(1)
});

export const VerificationPlanSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.VerificationPlan),
  verification_plan_id: z.string().min(1),
  commands: z.array(VerificationCommandSchema).default([]),
  ci_checks: z.array(z.string().min(1)).default([]),
  required_artifacts: z.array(z.string().min(1)).default([]),
  expected_logs: z.array(z.string().min(1)).default([]),
  success_criteria: z.array(z.string().min(1)).default([]),
  failure_classification_hints: z.array(z.string().min(1)).default([]),
  timeout_hints: z.array(z.string().min(1)).default([]),
  retry_policy_refs: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([])
});

export const PatchPlanStatusSchema = z.enum([
  "draft",
  "ready_for_preflight",
  "preflight_failed",
  "approved_for_branch_work",
  "applied_in_fixture",
  "verification_pending",
  "verified",
  "failed",
  "blocked"
]);

export const PatchPlanSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.PatchPlan),
  patch_plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  repo_target: RepoTargetSchema,
  files_to_read: z.array(FileChangeContractSchema).default([]),
  files_to_modify: z.array(FileChangeContractSchema).default([]),
  files_to_create: z.array(FileChangeContractSchema).default([]),
  files_to_delete_or_deprecate: z.array(FileChangeContractSchema).default([]),
  expected_effects: z.array(z.string().min(1)).default([]),
  risk_tier: RiskTierSchema,
  verification_plan: VerificationPlanSchema,
  rollback_notes: z.string().min(1),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([]),
  status: PatchPlanStatusSchema
});

export const CiProviderSchema = z.enum(["github_actions", "other"]);
export const CiStatusSchema = z.enum(["queued", "in_progress", "completed", "unknown"]);
export const CiConclusionSchema = z.enum(["success", "failure", "cancelled", "skipped", "timed_out", "unknown"]);

export const FailureCategorySchema = z.enum([
  "typecheck_failure",
  "test_failure",
  "lint_failure",
  "formatting_failure",
  "dependency_install_failure",
  "missing_file_failure",
  "secret_guard_failure",
  "workflow_syntax_failure",
  "timeout",
  "flaky_failure",
  "infrastructure_failure",
  "unknown_failure"
]);

export const CiLogExcerptSchema = z.object({
  label: z.string().min(1),
  text: z.string().min(1).max(2000),
  public_safe: z.boolean().default(true)
});

export const CiLogSummarySchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.CiLogSummary),
  provider: CiProviderSchema,
  workflow_name: z.string().min(1),
  run_id: z.string().min(1),
  job_id: z.string().min(1),
  check_name: z.string().min(1),
  status: CiStatusSchema,
  conclusion: CiConclusionSchema,
  failed_step: z.string().min(1).optional(),
  relevant_log_excerpts: z.array(CiLogExcerptSchema).default([]),
  detected_failure_categories: z.array(FailureCategorySchema).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  fetched_at: z.string().datetime()
});

export const RerunEligibilitySchema = z.object({
  eligible: z.boolean(),
  mode: z.enum(["rerun_only", "after_patch", "not_allowed"]),
  reason_codes: z.array(z.string().min(1)).default([]),
  summary: z.string().min(1),
  required_evidence_refs: z.array(EvidenceRefSchema).default([]),
  required_receipt_refs: z.array(ReceiptRefSchema).default([])
});

export const CiRepairStatusSchema = z.enum([
  "draft",
  "ready_for_preflight",
  "blocked",
  "patch_needed",
  "rerun_only",
  "verification_pending",
  "verified",
  "failed"
]);

export const CiRepairPlanSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.CiRepairPlan),
  repair_plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  task_id: z.string().min(1),
  ci_summary_ref: z.string().min(1),
  failure_categories: z.array(FailureCategorySchema).default([]),
  suspected_files: z.array(z.string().min(1)).default([]),
  proposed_patch_plans: z.array(PatchPlanSchema).default([]),
  verification_commands: z.array(VerificationCommandSchema).default([]),
  rerun_eligibility: RerunEligibilitySchema,
  non_retryable_reasons: z.array(z.string().min(1)).default([]),
  risk_tier: RiskTierSchema,
  status: CiRepairStatusSchema,
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([])
});

export const PrEvidencePacketSchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.PrEvidencePacket),
  evidence_packet_id: z.string().min(1),
  repo_full_name: z.string().min(1),
  base_branch: z.string().min(1),
  working_branch: z.string().min(1),
  pr_number: z.number().int().positive().optional(),
  pr_url: z.string().url().optional(),
  commit_sha: z.string().min(7).optional(),
  changed_files: z.array(FileChangeContractSchema).default([]),
  patch_plan_fingerprint: DigestRefSchema,
  checks: z.array(CiLogSummarySchema).default([]),
  verification_plan: VerificationPlanSchema,
  receipt_refs: z.array(ReceiptRefSchema).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  public_private_boundary_notes: z.array(z.string().min(1)).default([]),
  created_at: z.string().datetime()
});

export const CodeOpsPreflightSummarySchema = z.object({
  schema_version: z.literal(CodeOpsSchemaVersion.PreflightSummary),
  preflight_id: z.string().min(1),
  patch_plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  allowed: z.boolean(),
  blocked: z.boolean(),
  escalated: z.boolean(),
  reason_codes: z.array(z.string().min(1)).default([]),
  guard_decision_refs: z.array(z.string().min(1)).default([]),
  worker_task_refs: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(EvidenceRefSchema).default([]),
  receipt_refs: z.array(ReceiptRefSchema).default([]),
  created_at: z.string().datetime()
});

export type RepoTarget = z.infer<typeof RepoTargetSchema>;
export type FileChangeOperation = z.infer<typeof FileChangeOperationSchema>;
export type FileChangeContract = z.infer<typeof FileChangeContractSchema>;
export type VerificationCommand = z.infer<typeof VerificationCommandSchema>;
export type VerificationPlan = z.infer<typeof VerificationPlanSchema>;
export type PatchPlanStatus = z.infer<typeof PatchPlanStatusSchema>;
export type PatchPlan = z.infer<typeof PatchPlanSchema>;
export type FailureCategory = z.infer<typeof FailureCategorySchema>;
export type CiLogSummary = z.infer<typeof CiLogSummarySchema>;
export type RerunEligibility = z.infer<typeof RerunEligibilitySchema>;
export type CiRepairPlan = z.infer<typeof CiRepairPlanSchema>;
export type PrEvidencePacket = z.infer<typeof PrEvidencePacketSchema>;
export type CodeOpsPreflightSummary = z.infer<typeof CodeOpsPreflightSummarySchema>;

export const CodeOpsJsonSchemas = {
  repoTarget: zodToJsonSchema(RepoTargetSchema, "RepoTarget"),
  fileChangeContract: zodToJsonSchema(FileChangeContractSchema, "FileChangeContract"),
  verificationPlan: zodToJsonSchema(VerificationPlanSchema, "VerificationPlan"),
  patchPlan: zodToJsonSchema(PatchPlanSchema, "PatchPlan"),
  ciLogSummary: zodToJsonSchema(CiLogSummarySchema, "CiLogSummary"),
  ciRepairPlan: zodToJsonSchema(CiRepairPlanSchema, "CiRepairPlan"),
  prEvidencePacket: zodToJsonSchema(PrEvidencePacketSchema, "PrEvidencePacket"),
  preflightSummary: zodToJsonSchema(CodeOpsPreflightSummarySchema, "CodeOpsPreflightSummary")
};
