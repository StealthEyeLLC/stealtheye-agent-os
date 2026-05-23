import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { EffectSchema, HardStopCategorySchema, TargetConstraintsSchema, ToolManifestConstraintsSchema, UsageConstraintsSchema, RequestedActionSchema, CapabilityTokenSchema } from "@stealtheye/guard";

export const MissionOsSchemaVersion = {
  MissionLanguage: "stealtheye-mission-language.v1",
  Mission: "stealtheye-mission.v1",
  AuthorityEnvelope: "authority-envelope.v1",
  MissionPlan: "mission-plan.v1",
  MissionStatus: "mission-status.v1",
  ReceiptRefs: "mission-receipt-refs.v1"
} as const;

export const MissionStatusValueSchema = z.enum(["draft", "planned", "awaiting_authority", "authorized", "running", "blocked", "completed", "failed", "canceled"]);
export const MissionPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);
export const AutonomyLevelSchema = z.enum(["assistive", "supervised", "delegated", "high_autonomy"]);
export const RiskTierSchema = z.enum(["low", "medium", "high", "blocked"]);
export const StepStatusSchema = z.enum(["pending", "ready", "running", "blocked", "completed", "failed", "skipped", "canceled"]);

export const MissionTargetsSchema = z.object({
  systems: z.array(z.string()).default([]),
  repositories: z.array(z.string()).default([]),
  branch_prefixes: z.array(z.string()).default([]),
  branches: z.array(z.string()).default([]),
  paths: z.array(z.string()).default([]),
  environments: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  accounts: z.array(z.string()).default([])
});

export const VerificationPlanSchema = z.object({
  commands: z.array(z.string()).default([]),
  required_checks: z.array(z.string()).default([]),
  browser_flows: z.array(z.string()).default([]),
  evidence_requirements: z.array(z.string()).default([]),
  success_criteria: z.array(z.string()).default([])
});

export const FinalReportExpectationsSchema = z.object({
  required: z.boolean().default(true),
  sections: z.array(z.string()).default([]),
  include_ci_status: z.boolean().default(true),
  include_file_list: z.boolean().default(true),
  include_known_gaps: z.boolean().default(true),
  include_next_target: z.boolean().default(true)
});

export const ReceiptReferenceSchema = z.object({
  ref_id: z.string().min(1),
  kind: z.enum(["guard_decision", "registry_decision", "pull_request", "ci_run", "artifact", "final_report", "mission_status"]),
  uri: z.string().optional(),
  summary: z.string().optional(),
  created_at: z.string().datetime()
});

export const ArtifactReferenceSchema = z.object({
  artifact_id: z.string().min(1),
  kind: z.string().min(1),
  uri: z.string().optional(),
  summary: z.string().optional()
});

export const MissionLanguageAuthoritySchema = z.object({
  allowed_effects: z.array(EffectSchema).default([]),
  denied_effects: z.array(EffectSchema).default([]),
  forbidden_effects: z.array(EffectSchema).default([]),
  hard_stops: z.array(HardStopCategorySchema).default([]),
  tool_manifest_constraints: ToolManifestConstraintsSchema.default({}),
  usage_constraints: UsageConstraintsSchema.default({}),
  evidence_requirements: z.array(z.string()).default([]),
  receipt_requirements: z.array(z.string()).default([]),
  escalation_requirements: z.array(z.string()).default([]),
  validity_minutes: z.number().int().positive().default(1440)
});

export const MissionLanguageSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.MissionLanguage),
  mission: z.object({
    mission_id: z.string().optional(),
    title: z.string().min(1),
    goal: z.string().min(1),
    requester: z.string().min(1),
    priority: MissionPrioritySchema.default("normal"),
    autonomy_level: AutonomyLevelSchema.default("delegated"),
    risk_tier: RiskTierSchema.default("medium"),
    targets: MissionTargetsSchema.default({}),
    constraints: z.array(z.string()).default([]),
    authority: MissionLanguageAuthoritySchema,
    verification: VerificationPlanSchema,
    browser_flows: z.array(z.string()).default([]),
    evidence_requirements: z.array(z.string()).default([]),
    receipt_requirements: z.array(z.string()).default([]),
    execution_constraints: z.array(z.string()).default([]),
    stop_conditions: z.array(z.string()).default([]),
    final_report: FinalReportExpectationsSchema.default({})
  })
});

export const AuthorityEnvelopeSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.AuthorityEnvelope),
  envelope_id: z.string().min(1),
  mission_id: z.string().min(1),
  issued_by: z.string().min(1),
  issued_to: z.string().min(1),
  subject_type: z.enum(["agent", "worker", "user", "service"]),
  authority_origin: z.enum(["user_chat", "repo_policy", "system_policy", "verifier"]),
  autonomy_level: AutonomyLevelSchema,
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
  escalation_requirements: z.array(z.string()).default([])
});

export const MissionPlanStepSchema = z.object({
  step_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  depends_on: z.array(z.string()).default([]),
  status: StepStatusSchema.default("pending"),
  expected_effects: z.array(EffectSchema).default([]),
  target_summary: z.record(z.string()).default({}),
  verification_refs: z.array(z.string()).default([]),
  receipt_refs: z.array(z.string()).default([]),
  risk_indicators: z.array(z.string()).default([])
});

export const MissionPlanSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.MissionPlan),
  plan_id: z.string().min(1),
  mission_id: z.string().min(1),
  steps: z.array(MissionPlanStepSchema).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const MissionSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.Mission),
  mission_id: z.string().min(1),
  title: z.string().min(1),
  goal: z.string().min(1),
  requester: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: MissionStatusValueSchema,
  priority: MissionPrioritySchema,
  autonomy_level: AutonomyLevelSchema,
  target_systems: z.array(z.string()).default([]),
  target_repositories: z.array(z.string()).default([]),
  target_environments: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  allowed_effects: z.array(EffectSchema).default([]),
  hard_stops: z.array(HardStopCategorySchema).default([]),
  authority_envelope: AuthorityEnvelopeSchema.optional(),
  authority_envelope_ref: z.string().optional(),
  planning_refs: z.array(z.string()).default([]),
  task_refs: z.array(z.string()).default([]),
  receipt_refs: z.array(ReceiptReferenceSchema).default([]),
  artifact_refs: z.array(ArtifactReferenceSchema).default([]),
  risk_classification: RiskTierSchema,
  success_criteria: z.array(z.string()).default([]),
  verification_plan: VerificationPlanSchema,
  escalation_requirements: z.array(z.string()).default([]),
  final_report_expectations: FinalReportExpectationsSchema
});

export const MissionStatusSnapshotSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.MissionStatus),
  mission_id: z.string().min(1),
  status: MissionStatusValueSchema,
  blockers: z.array(z.string()).default([]),
  next_actions: z.array(z.string()).default([]),
  completion_ready: z.boolean(),
  updated_at: z.string().datetime(),
  summary: z.string().min(1)
});

export const MissionReceiptRefsSchema = z.object({
  schema_version: z.literal(MissionOsSchemaVersion.ReceiptRefs),
  mission_id: z.string().min(1),
  guard_decision_refs: z.array(ReceiptReferenceSchema).default([]),
  registry_decision_refs: z.array(ReceiptReferenceSchema).default([]),
  pull_request_refs: z.array(ReceiptReferenceSchema).default([]),
  ci_run_refs: z.array(ReceiptReferenceSchema).default([]),
  artifact_refs: z.array(ArtifactReferenceSchema).default([]),
  final_report_ref: ReceiptReferenceSchema.optional()
});

export const MissionCompileResultSchema = z.object({
  mission: MissionSchema,
  authority_envelope: AuthorityEnvelopeSchema,
  plan: MissionPlanSchema,
  status: MissionStatusSnapshotSchema,
  receipt_expectations: MissionReceiptRefsSchema,
  capability_token_template: CapabilityTokenSchema,
  requested_action_templates: z.array(RequestedActionSchema).default([])
});

export type MissionLanguage = z.infer<typeof MissionLanguageSchema>;
export type Mission = z.infer<typeof MissionSchema>;
export type AuthorityEnvelope = z.infer<typeof AuthorityEnvelopeSchema>;
export type MissionPlan = z.infer<typeof MissionPlanSchema>;
export type MissionPlanStep = z.infer<typeof MissionPlanStepSchema>;
export type MissionStatusValue = z.infer<typeof MissionStatusValueSchema>;
export type MissionStatusSnapshot = z.infer<typeof MissionStatusSnapshotSchema>;
export type MissionReceiptRefs = z.infer<typeof MissionReceiptRefsSchema>;
export type ReceiptReference = z.infer<typeof ReceiptReferenceSchema>;
export type ArtifactReference = z.infer<typeof ArtifactReferenceSchema>;
export type MissionCompileResult = z.infer<typeof MissionCompileResultSchema>;

export const MissionOsJsonSchemas = {
  missionLanguage: zodToJsonSchema(MissionLanguageSchema, "MissionLanguage"),
  mission: zodToJsonSchema(MissionSchema, "Mission"),
  authorityEnvelope: zodToJsonSchema(AuthorityEnvelopeSchema, "AuthorityEnvelope"),
  missionPlan: zodToJsonSchema(MissionPlanSchema, "MissionPlan"),
  missionStatus: zodToJsonSchema(MissionStatusSnapshotSchema, "MissionStatusSnapshot"),
  receiptRefs: zodToJsonSchema(MissionReceiptRefsSchema, "MissionReceiptRefs")
};
