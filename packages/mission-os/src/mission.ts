import { type RequestedAction } from "@stealtheye/guard";
import { createAuthorityEnvelope, authorityEnvelopeToCapabilityTokenTemplate, requestedActionFromPlanStep } from "./authority-envelope";
import { missionLanguageToMission, normalizeMissionLanguage } from "./mission-language";
import { createMissionPlan, defaultPlanSteps } from "./planning";
import { createMissionReceiptRefs } from "./receipts";
import { summarizeMissionStatus } from "./status";
import { MissionCompileResultSchema, type MissionCompileResult, type MissionLanguage, type MissionPlanStep } from "./schemas";

export interface CompileMissionOptions {
  now?: string;
  issued_to?: string;
  issued_by?: string;
  plan_steps?: MissionPlanStep[];
}

export function compileMissionLanguage(input: MissionLanguage | unknown, options: CompileMissionOptions = {}): MissionCompileResult {
  const language = normalizeMissionLanguage(input);
  let mission = missionLanguageToMission(language, { now: options.now, status: "planned" });
  const issuedTo = options.issued_to ?? "agent:mission-os-fixture";
  const authorityEnvelope = createAuthorityEnvelope({
    mission,
    issued_to: issuedTo,
    issued_by: options.issued_by ?? mission.requester,
    issued_at: mission.created_at,
    valid_until: new Date(new Date(mission.created_at).getTime() + language.mission.authority.validity_minutes * 60 * 1000).toISOString()
  });
  mission = { ...mission, authority_envelope: authorityEnvelope, authority_envelope_ref: authorityEnvelope.envelope_id };
  const plan = createMissionPlan(mission, options.plan_steps ?? defaultPlanSteps(mission), mission.created_at);
  const requestedActionTemplates: RequestedAction[] = plan.steps.flatMap((step) => step.expected_effects.map((effect) => requestedActionFromPlanStep(mission, step, issuedTo, effect)));

  return MissionCompileResultSchema.parse({
    mission,
    authority_envelope: authorityEnvelope,
    plan,
    status: summarizeMissionStatus(mission, plan),
    receipt_expectations: createMissionReceiptRefs(mission),
    capability_token_template: authorityEnvelopeToCapabilityTokenTemplate(authorityEnvelope),
    requested_action_templates: requestedActionTemplates
  });
}

export function compileMissionToGuardInputs(input: MissionLanguage | unknown, options: CompileMissionOptions = {}) {
  const compiled = compileMissionLanguage(input, options);
  return {
    mission: compiled.mission,
    authority_envelope: compiled.authority_envelope,
    capability_token_template: compiled.capability_token_template,
    requested_action_templates: compiled.requested_action_templates
  };
}
