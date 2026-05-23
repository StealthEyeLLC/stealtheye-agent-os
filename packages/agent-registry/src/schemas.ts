import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const SchemaVersion = {
  AgentCard: "agent-card.v1",
  ToolManifest: "tool-manifest.v1",
  TrustRegistry: "trust-registry.v1"
} as const;

export const ProtocolSchema = z.enum(["mcp", "a2a", "internal"]);
export const RiskTierSchema = z.enum(["low", "medium", "high", "blocked"]);
export const AllowedEffectSchema = z.enum([
  "read_repo",
  "read_logs",
  "write_branch_files",
  "commit_branch",
  "open_pr",
  "read_ci",
  "rerun_failed_jobs",
  "browser_observe",
  "write_receipt",
  "generate_final_report"
]);
export const HardStopSchema = z.enum([
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

export const AuthRequirementSchema = z.object({
  mode: z.enum(["none", "user_oauth", "github_app", "service_token", "brokered_secret"]),
  scopes: z.array(z.string()).default([]),
  audience: z.string().optional(),
  notes: z.string().optional()
});

export const ReceiptRequirementSchema = z.object({
  required: z.boolean(),
  fields: z.array(z.string()).default([]),
  artifact_policy: z.enum(["none", "optional", "required"]).default("optional")
});

export const VerificationKeySchema = z.object({
  key_id: z.string().min(1),
  alg: z.literal("Ed25519"),
  encoding: z.literal("pem-spki"),
  public_key: z.string().min(1),
  created_at: z.string().datetime(),
  expires_at: z.string().datetime().optional()
});

export const SignatureSchema = z.object({
  key_id: z.string().min(1),
  alg: z.literal("Ed25519"),
  digest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  value: z.string().min(1),
  signed_at: z.string().datetime()
});

export const RevocationRefSchema = z.object({
  ref: z.string().min(1),
  kind: z.enum(["agent_id", "manifest_id", "key_id", "digest"])
});

export const AgentCardSchema = z.object({
  schema_version: z.literal(SchemaVersion.AgentCard),
  agent_id: z.string().min(1),
  name: z.string().min(1),
  publisher: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  protocols: z.array(ProtocolSchema).min(1),
  public_keys: z.array(VerificationKeySchema).min(1),
  capabilities: z.array(z.string()).default([]),
  risk_tier: RiskTierSchema,
  allowed_effects: z.array(AllowedEffectSchema).default([]),
  hard_stops: z.array(HardStopSchema).default([]),
  auth_requirements: z.array(AuthRequirementSchema).default([]),
  receipt_requirements: ReceiptRequirementSchema,
  linked_tool_manifests: z.array(z.object({ manifest_id: z.string(), digest: z.string().regex(/^sha256:[a-f0-9]{64}$/) })).default([]),
  manifest_digest: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
  created_at: z.string().datetime(),
  valid_until: z.string().datetime(),
  revocation_refs: z.array(RevocationRefSchema).default([]),
  signatures: z.array(SignatureSchema).default([])
});

export const ToolSideEffectsSchema = z.object({
  read: z.boolean(),
  write: z.boolean(),
  destructive: z.boolean(),
  open_world: z.boolean(),
  idempotent: z.boolean()
});

export const ToolFamilySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  input_schema: z.record(z.unknown()).optional(),
  output_schema: z.record(z.unknown()).optional(),
  scopes: z.array(z.string()).default([]),
  side_effects: ToolSideEffectsSchema
});

export const ToolManifestSchema = z.object({
  schema_version: z.literal(SchemaVersion.ToolManifest),
  manifest_id: z.string().min(1),
  name: z.string().min(1),
  publisher: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  tools: z.array(ToolFamilySchema).min(1),
  auth_requirements: z.array(AuthRequirementSchema).default([]),
  scopes: z.array(z.string()).default([]),
  side_effects: ToolSideEffectsSchema,
  allowed_effects: z.array(AllowedEffectSchema).default([]),
  hard_stop_categories: z.array(HardStopSchema).default([]),
  receipt_requirements: ReceiptRequirementSchema,
  risk_tier: RiskTierSchema,
  public_keys: z.array(VerificationKeySchema).min(1),
  created_at: z.string().datetime(),
  valid_until: z.string().datetime(),
  revocation_refs: z.array(RevocationRefSchema).default([]),
  signatures: z.array(SignatureSchema).default([])
});

export const TrustRegistryRecordSchema = z.object({
  publisher: z.string(),
  key_ids: z.array(z.string()).default([]),
  pinned_digests: z.array(z.string()).default([]),
  allowed_agents: z.array(z.string()).default([]),
  allowed_tool_manifests: z.array(z.string()).default([]),
  trust_status: z.enum(["trusted", "untrusted", "revoked", "needs_review"]),
  review_status: z.enum(["unreviewed", "reviewed", "approved", "rejected"]),
  notes: z.string().optional(),
  evidence_refs: z.array(z.string()).default([])
});

export const TrustRegistrySchema = z.object({
  schema_version: z.literal(SchemaVersion.TrustRegistry),
  records: z.array(TrustRegistryRecordSchema).default([]),
  revoked_agents: z.array(z.string()).default([]),
  revoked_manifests: z.array(z.string()).default([]),
  revoked_keys: z.array(z.string()).default([]),
  revoked_digests: z.array(z.string()).default([])
});

export type AgentCard = z.infer<typeof AgentCardSchema>;
export type ToolManifest = z.infer<typeof ToolManifestSchema>;
export type Signature = z.infer<typeof SignatureSchema>;
export type VerificationKey = z.infer<typeof VerificationKeySchema>;
export type TrustRegistryRecord = z.infer<typeof TrustRegistryRecordSchema>;
export type TrustRegistrySnapshot = z.infer<typeof TrustRegistrySchema>;
export type SignedPayload = AgentCard | ToolManifest;

export const JsonSchemas = {
  agentCard: zodToJsonSchema(AgentCardSchema, "AgentCard"),
  toolManifest: zodToJsonSchema(ToolManifestSchema, "ToolManifest"),
  trustRegistry: zodToJsonSchema(TrustRegistrySchema, "TrustRegistry")
};
