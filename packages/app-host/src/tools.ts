import {
  AgentCardSchema,
  ToolManifestSchema
} from "@stealtheye/agent-registry";
import {
  DEFAULT_HARD_STOP_OUTCOME,
  HARD_STOP_EFFECTS
} from "@stealtheye/guard";
import {
  compileMissionLanguage,
  safeValidateMissionLanguage,
  summarizeMissionStatus
} from "@stealtheye/mission-os";
import { APP_HOST_BOUNDARIES, APP_HOST_METADATA, SUPPORTED_TOOL_FAMILIES } from "./app-metadata";
import {
  APP_HOST_PUBLIC_FIXTURE_NOTICE,
  compileFixtureMission,
  guardPreviewFixture,
  invalidMissionLanguageFixture,
  manifestDiffPreview,
  missionFixture,
  registryFixture,
  registryTrustPreview
} from "./fixtures";
import {
  EmptyInputSchema,
  GenericToolOutputSchema,
  GuardPreviewInputSchema,
  HostCapabilitiesOutputSchema,
  HostHealthOutputSchema,
  MissionInputSchema,
  MissionStatusPreviewInputSchema,
  RegistryDiffInputSchema,
  RegistryTrustInputSchema,
  RegistryValidationInputSchema,
  type AppHostToolName,
  type ToolDescriptor,
  jsonSchema
} from "./tool-schemas";

const previewSafety = {
  readOnly: true,
  destructive: false,
  idempotent: true,
  openWorld: false,
  fixtureOnly: true,
  previewOnly: true,
  live: false
} as const;

function descriptor(input: Omit<ToolDescriptor, "safety" | "mode">): ToolDescriptor {
  return {
    ...input,
    safety: previewSafety,
    mode: "preview_only"
  };
}

export const APP_HOST_TOOL_DESCRIPTORS: ToolDescriptor[] = [
  descriptor({
    name: "host.health",
    family: "host",
    description: "Report app-host status for the non-production foundation shell.",
    input_schema: jsonSchema(EmptyInputSchema, "HostHealthInput"),
    output_schema: jsonSchema(HostHealthOutputSchema, "HostHealthOutput"),
    evidence_expectations: ["app_host_status"],
    receipt_expectations: ["host_health_preview"],
    risk_tier: "low",
    allowed_effects: ["read_status"],
    hard_stops: [],
    limitations: ["does not perform live checks against production systems"]
  }),
  descriptor({
    name: "host.capabilities",
    family: "host",
    description: "List available safe preview-only tool families and explicit boundaries.",
    input_schema: jsonSchema(EmptyInputSchema, "HostCapabilitiesInput"),
    output_schema: jsonSchema(HostCapabilitiesOutputSchema, "HostCapabilitiesOutput"),
    evidence_expectations: ["tool_descriptor_inventory"],
    receipt_expectations: ["capabilities_preview"],
    risk_tier: "low",
    allowed_effects: ["read_status"],
    hard_stops: [],
    limitations: ["all listed tools are read-only or preview-only"]
  }),
  descriptor({
    name: "mission.validate",
    family: "mission",
    description: "Validate StealthEye Mission Language from a fixture or provided payload.",
    input_schema: jsonSchema(MissionInputSchema, "MissionValidateInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "MissionValidateOutput"),
    evidence_expectations: ["mission_language_validation_result"],
    receipt_expectations: ["mission_validation_preview"],
    risk_tier: "low",
    allowed_effects: ["validate_mission_language"],
    hard_stops: [],
    limitations: ["does not execute the mission"]
  }),
  descriptor({
    name: "mission.compile",
    family: "mission",
    description: "Compile Mission Language into normalized Mission OS preview structures.",
    input_schema: jsonSchema(MissionInputSchema, "MissionCompileInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "MissionCompileOutput"),
    evidence_expectations: ["mission_compile_preview"],
    receipt_expectations: ["mission_compile_preview"],
    risk_tier: "medium",
    allowed_effects: ["compile_mission_preview"],
    hard_stops: [],
    limitations: ["does not issue production credentials or run workers"]
  }),
  descriptor({
    name: "mission.preview",
    family: "mission",
    description: "Preview authority envelope, plan, status, receipt expectations, and requested-action templates.",
    input_schema: jsonSchema(MissionInputSchema, "MissionPreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "MissionPreviewOutput"),
    evidence_expectations: ["mission_authority_plan_preview"],
    receipt_expectations: ["mission_preview"],
    risk_tier: "medium",
    allowed_effects: ["preview_mission"],
    hard_stops: ["production_deploy_or_data_mutation", "money_billing_subscriptions", "raw_secrets_credentials"],
    limitations: ["hard-stop previews are illustrative and do not execute"]
  }),
  descriptor({
    name: "mission.status.preview",
    family: "mission",
    description: "Preview Mission OS status, blockers, next actions, and completion readiness.",
    input_schema: jsonSchema(MissionStatusPreviewInputSchema, "MissionStatusPreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "MissionStatusPreviewOutput"),
    evidence_expectations: ["mission_status_snapshot"],
    receipt_expectations: ["mission_status_preview"],
    risk_tier: "low",
    allowed_effects: ["preview_status"],
    hard_stops: [],
    limitations: ["status is computed from fixture/provided input only"]
  }),
  descriptor({
    name: "guard.evaluate.preview",
    family: "guard",
    description: "Preview a Guard decision for a fixture requested action and capability token.",
    input_schema: jsonSchema(GuardPreviewInputSchema, "GuardEvaluatePreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "GuardEvaluatePreviewOutput"),
    evidence_expectations: ["guard_decision_preview"],
    receipt_expectations: ["guard_decision_preview"],
    risk_tier: "medium",
    allowed_effects: ["preview_guard_decision"],
    hard_stops: ["production_deploy_or_data_mutation", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security"],
    limitations: ["does not execute the requested action"]
  }),
  descriptor({
    name: "guard.receipt.preview",
    family: "guard",
    description: "Preview a receipt-friendly Guard decision record for fixture decisions.",
    input_schema: jsonSchema(GuardPreviewInputSchema, "GuardReceiptPreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "GuardReceiptPreviewOutput"),
    evidence_expectations: ["guard_decision_receipt_preview"],
    receipt_expectations: ["guard_receipt_preview"],
    risk_tier: "low",
    allowed_effects: ["preview_receipt"],
    hard_stops: [],
    limitations: ["does not write to a durable receipt ledger"]
  }),
  descriptor({
    name: "registry.agent_card.validate",
    family: "registry",
    description: "Validate signed agent-card shape using fixtures or provided payload.",
    input_schema: jsonSchema(RegistryValidationInputSchema, "RegistryAgentCardValidateInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "RegistryAgentCardValidateOutput"),
    evidence_expectations: ["agent_card_validation_preview"],
    receipt_expectations: ["registry_validation_preview"],
    risk_tier: "low",
    allowed_effects: ["validate_agent_card"],
    hard_stops: [],
    limitations: ["does not fetch remote agent cards"]
  }),
  descriptor({
    name: "registry.tool_manifest.validate",
    family: "registry",
    description: "Validate signed tool-manifest shape using fixtures or provided payload.",
    input_schema: jsonSchema(RegistryValidationInputSchema, "RegistryToolManifestValidateInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "RegistryToolManifestValidateOutput"),
    evidence_expectations: ["tool_manifest_validation_preview"],
    receipt_expectations: ["registry_validation_preview"],
    risk_tier: "low",
    allowed_effects: ["validate_tool_manifest"],
    hard_stops: [],
    limitations: ["does not fetch remote tool manifests"]
  }),
  descriptor({
    name: "registry.manifest.diff.preview",
    family: "registry",
    description: "Preview risk-relevant manifest diffs using public-safe fixtures.",
    input_schema: jsonSchema(RegistryDiffInputSchema, "RegistryManifestDiffPreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "RegistryManifestDiffPreviewOutput"),
    evidence_expectations: ["manifest_diff_preview"],
    receipt_expectations: ["registry_diff_preview"],
    risk_tier: "medium",
    allowed_effects: ["preview_manifest_diff"],
    hard_stops: ["auth_security_critical_change", "production_deploy_or_data_mutation"],
    limitations: ["does not approve or trust remote manifests"]
  }),
  descriptor({
    name: "registry.trust.preview",
    family: "registry",
    description: "Preview fixture-backed registry trust decisions.",
    input_schema: jsonSchema(RegistryTrustInputSchema, "RegistryTrustPreviewInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "RegistryTrustPreviewOutput"),
    evidence_expectations: ["registry_trust_preview"],
    receipt_expectations: ["registry_trust_preview"],
    risk_tier: "medium",
    allowed_effects: ["preview_registry_trust"],
    hard_stops: [],
    limitations: ["fixture-backed only; no remote trust discovery"]
  }),
  descriptor({
    name: "policy.hard_stops",
    family: "policy",
    description: "Return hard-stop categories, mapped effects, and default deny/escalate outcomes.",
    input_schema: jsonSchema(EmptyInputSchema, "PolicyHardStopsInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "PolicyHardStopsOutput"),
    evidence_expectations: ["hard_stop_policy_summary"],
    receipt_expectations: ["policy_preview"],
    risk_tier: "low",
    allowed_effects: ["read_policy"],
    hard_stops: [],
    limitations: ["summary only; Guard remains enforcement layer"]
  }),
  descriptor({
    name: "policy.autonomy.summary",
    family: "policy",
    description: "Summarize high-autonomy policy, approval boundaries, and Build 5 limitations.",
    input_schema: jsonSchema(EmptyInputSchema, "PolicyAutonomySummaryInput"),
    output_schema: jsonSchema(GenericToolOutputSchema, "PolicyAutonomySummaryOutput"),
    evidence_expectations: ["autonomy_policy_summary"],
    receipt_expectations: ["policy_preview"],
    risk_tier: "low",
    allowed_effects: ["read_policy"],
    hard_stops: [],
    limitations: ["summary only; does not grant authority"]
  })
];

function output(result: unknown, warnings: string[] = []) {
  return GenericToolOutputSchema.parse({ ok: warnings.length === 0, preview_only: true, fixture_only: true, result, warnings, evidence_refs: ["app-host://build-5/preview"] });
}

function missionPayload(input: unknown) {
  const parsed = MissionInputSchema.parse(input ?? {});
  if (parsed.mission_language !== undefined) return parsed.mission_language;
  return missionFixture(parsed.fixture ?? "normal_repo_feature");
}

export function handleAppHostTool(name: AppHostToolName, input: unknown = {}) {
  switch (name) {
    case "host.health":
      return HostHealthOutputSchema.parse({ status: "ok", build_stage: "build-5-foundation-shell", production_ready: false, live_write_capabilities: false, message: "App host foundation shell is available with preview-only tools." });
    case "host.capabilities":
      return HostCapabilitiesOutputSchema.parse({ tool_families: SUPPORTED_TOOL_FAMILIES, tools: APP_HOST_TOOL_DESCRIPTORS, boundaries: APP_HOST_BOUNDARIES, production_ready: false });
    case "mission.validate": {
      const payload = missionPayload(input);
      const result = safeValidateMissionLanguage(payload);
      return output(result, result.valid ? [] : result.errors);
    }
    case "mission.compile": {
      return output(compileMissionLanguage(missionPayload(input), { now: "2026-01-01T00:00:00.000Z", issued_to: "agent:mission-os-fixture" }));
    }
    case "mission.preview": {
      const parsed = MissionInputSchema.parse(input ?? {});
      const compiled = parsed.mission_language !== undefined
        ? compileMissionLanguage(parsed.mission_language, { now: "2026-01-01T00:00:00.000Z", issued_to: "agent:mission-os-fixture" })
        : compileFixtureMission(parsed.fixture ?? "normal_repo_feature");
      return output({
        authority_envelope: compiled.authority_envelope,
        plan: compiled.plan,
        status: compiled.status,
        receipt_expectations: compiled.receipt_expectations,
        requested_action_templates: compiled.requested_action_templates,
        hard_stop_preview: compiled.requested_action_templates.some((action) => action.effect.includes("production") || action.effect.includes("money"))
      });
    }
    case "mission.status.preview": {
      const parsed = MissionStatusPreviewInputSchema.parse(input ?? {});
      const compiled = parsed.mission_language !== undefined
        ? compileMissionLanguage(parsed.mission_language, { now: "2026-01-01T00:00:00.000Z", issued_to: "agent:mission-os-fixture" })
        : compileFixtureMission(parsed.fixture ?? "normal_repo_feature");
      return output(summarizeMissionStatus(compiled.mission, compiled.plan));
    }
    case "guard.evaluate.preview": {
      const parsed = GuardPreviewInputSchema.parse(input ?? {});
      return output(guardPreviewFixture(parsed.fixture).decision);
    }
    case "guard.receipt.preview": {
      const parsed = GuardPreviewInputSchema.parse(input ?? {});
      return output(guardPreviewFixture(parsed.fixture).receipt);
    }
    case "registry.agent_card.validate": {
      const parsed = RegistryValidationInputSchema.parse(input ?? {});
      const fixture = registryFixture();
      const payload = parsed.payload ?? (parsed.fixture === "untrusted" ? fixture.untrustedAgentCard : fixture.agentCard);
      const result = AgentCardSchema.safeParse(payload);
      return output(result.success ? { valid: true, agent_id: result.data.agent_id, publisher: result.data.publisher } : { valid: false, errors: result.error.issues });
    }
    case "registry.tool_manifest.validate": {
      const parsed = RegistryValidationInputSchema.parse(input ?? {});
      const fixture = registryFixture();
      const payload = parsed.payload ?? fixture.toolManifest;
      const result = ToolManifestSchema.safeParse(payload);
      return output(result.success ? { valid: true, manifest_id: result.data.manifest_id, publisher: result.data.publisher } : { valid: false, errors: result.error.issues });
    }
    case "registry.manifest.diff.preview":
      RegistryDiffInputSchema.parse(input ?? {});
      return output(manifestDiffPreview());
    case "registry.trust.preview": {
      const parsed = RegistryTrustInputSchema.parse(input ?? {});
      const trust = registryTrustPreview();
      return output(parsed.fixture === "trusted_agent" ? trust.agent_decision : trust.manifest_decision);
    }
    case "policy.hard_stops":
      return output({ categories: Object.keys(HARD_STOP_EFFECTS), effects: HARD_STOP_EFFECTS, default_outcomes: DEFAULT_HARD_STOP_OUTCOME });
    case "policy.autonomy.summary":
      return output({ metadata: APP_HOST_METADATA, boundaries: APP_HOST_BOUNDARIES, fixture_notice: APP_HOST_PUBLIC_FIXTURE_NOTICE });
    default:
      throw new Error(`Unknown app-host tool: ${name satisfies never}`);
  }
}

export function assertNoLiveWriteTools(descriptors = APP_HOST_TOOL_DESCRIPTORS): boolean {
  return descriptors.every((tool) => tool.safety.readOnly && !tool.safety.destructive && !tool.safety.live && (tool.safety.previewOnly || tool.safety.fixtureOnly));
}
