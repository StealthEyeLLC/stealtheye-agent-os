import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const AppHostBuildStage = "build-5-foundation-shell" as const;

export const ToolModeSchema = z.enum(["fixture_only", "preview_only", "read_only"]);
export const ToolRiskTierSchema = z.enum(["low", "medium", "high", "blocked"]);

export const ToolSafetyHintsSchema = z.object({
  readOnly: z.boolean(),
  destructive: z.boolean(),
  idempotent: z.boolean(),
  openWorld: z.boolean(),
  fixtureOnly: z.boolean(),
  previewOnly: z.boolean(),
  live: z.boolean()
});

export const AppHostToolNameSchema = z.enum([
  "host.health",
  "host.capabilities",
  "mission.validate",
  "mission.compile",
  "mission.preview",
  "mission.status.preview",
  "guard.evaluate.preview",
  "guard.receipt.preview",
  "registry.agent_card.validate",
  "registry.tool_manifest.validate",
  "registry.manifest.diff.preview",
  "registry.trust.preview",
  "policy.hard_stops",
  "policy.autonomy.summary"
]);

export const ToolDescriptorSchema = z.object({
  name: AppHostToolNameSchema,
  description: z.string().min(1),
  family: z.enum(["host", "mission", "guard", "registry", "policy"]),
  input_schema: z.record(z.unknown()),
  output_schema: z.record(z.unknown()),
  safety: ToolSafetyHintsSchema,
  evidence_expectations: z.array(z.string()).default([]),
  receipt_expectations: z.array(z.string()).default([]),
  risk_tier: ToolRiskTierSchema,
  allowed_effects: z.array(z.string()).default([]),
  hard_stops: z.array(z.string()).default([]),
  mode: ToolModeSchema,
  limitations: z.array(z.string()).default([])
});

export const EmptyInputSchema = z.object({}).default({});
export const FixtureNameSchema = z.enum([
  "normal_repo_feature",
  "ci_repair",
  "browser_qa",
  "hard_stop_production_deploy",
  "hard_stop_money_movement",
  "invalid_target_constraints",
  "missing_verification_plan"
]);

export const MissionInputSchema = z.object({
  fixture: FixtureNameSchema.optional(),
  mission_language: z.unknown().optional()
}).default({});

export const MissionStatusPreviewInputSchema = z.object({
  fixture: FixtureNameSchema.optional(),
  mission_language: z.unknown().optional()
}).default({});

export const GuardFixtureSchema = z.enum(["safe_repo_write", "hard_stop_production_deploy"]);
export const GuardPreviewInputSchema = z.object({
  fixture: GuardFixtureSchema.default("safe_repo_write")
}).default({ fixture: "safe_repo_write" });

export const RegistryValidationInputSchema = z.object({
  fixture: z.enum(["trusted", "untrusted"]).default("trusted"),
  payload: z.unknown().optional()
}).default({ fixture: "trusted" });

export const RegistryDiffInputSchema = z.object({
  fixture: z.enum(["risky_escalation"]).default("risky_escalation")
}).default({ fixture: "risky_escalation" });

export const RegistryTrustInputSchema = z.object({
  fixture: z.enum(["trusted_agent", "trusted_manifest"]).default("trusted_manifest")
}).default({ fixture: "trusted_manifest" });

export const HostHealthOutputSchema = z.object({
  status: z.literal("ok"),
  build_stage: z.literal(AppHostBuildStage),
  production_ready: z.literal(false),
  live_write_capabilities: z.literal(false),
  message: z.string()
});

export const HostCapabilitiesOutputSchema = z.object({
  tool_families: z.array(z.string()),
  tools: z.array(ToolDescriptorSchema),
  boundaries: z.array(z.string()),
  production_ready: z.literal(false)
});

export const GenericToolOutputSchema = z.object({
  ok: z.boolean(),
  preview_only: z.boolean(),
  fixture_only: z.boolean(),
  result: z.unknown(),
  warnings: z.array(z.string()).default([]),
  evidence_refs: z.array(z.string()).default([])
});

export type AppHostToolName = z.infer<typeof AppHostToolNameSchema>;
export type ToolDescriptor = z.infer<typeof ToolDescriptorSchema>;
export type ToolSafetyHints = z.infer<typeof ToolSafetyHintsSchema>;
export type MissionInput = z.infer<typeof MissionInputSchema>;
export type GuardPreviewInput = z.infer<typeof GuardPreviewInputSchema>;
export type RegistryValidationInput = z.infer<typeof RegistryValidationInputSchema>;
export type RegistryDiffInput = z.infer<typeof RegistryDiffInputSchema>;
export type RegistryTrustInput = z.infer<typeof RegistryTrustInputSchema>;

export function jsonSchema(schema: z.ZodTypeAny, name: string): Record<string, unknown> {
  return zodToJsonSchema(schema, name) as Record<string, unknown>;
}

export const AppHostJsonSchemas = {
  toolDescriptor: jsonSchema(ToolDescriptorSchema, "ToolDescriptor"),
  healthOutput: jsonSchema(HostHealthOutputSchema, "HostHealthOutput"),
  capabilitiesOutput: jsonSchema(HostCapabilitiesOutputSchema, "HostCapabilitiesOutput"),
  genericToolOutput: jsonSchema(GenericToolOutputSchema, "GenericToolOutput")
};
