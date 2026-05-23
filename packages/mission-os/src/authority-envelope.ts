import { GuardSchemaVersion, type CapabilityToken, type RequestedAction, type TargetConstraintsSchema } from "@stealtheye/guard";
import { z } from "zod";
import { AuthorityEnvelopeSchema, MissionOsSchemaVersion, type AuthorityEnvelope, type Mission, type MissionPlanStep } from "./schemas";

type TargetConstraints = z.infer<typeof TargetConstraintsSchema>;

export interface AuthorityEnvelopeInput {
  mission: Mission;
  issued_to: string;
  issued_by?: string;
  subject_type?: AuthorityEnvelope["subject_type"];
  authority_origin?: AuthorityEnvelope["authority_origin"];
  issued_at?: string;
  valid_until?: string;
  target_constraints?: TargetConstraints;
}

export function createAuthorityEnvelope(input: AuthorityEnvelopeInput): AuthorityEnvelope {
  const issuedAt = input.issued_at ?? input.mission.created_at;
  const validUntil = input.valid_until ?? new Date(new Date(issuedAt).getTime() + 24 * 60 * 60 * 1000).toISOString();
  return AuthorityEnvelopeSchema.parse({
    schema_version: MissionOsSchemaVersion.AuthorityEnvelope,
    envelope_id: `authority-envelope:${input.mission.mission_id}`,
    mission_id: input.mission.mission_id,
    issued_by: input.issued_by ?? input.mission.requester,
    issued_to: input.issued_to,
    subject_type: input.subject_type ?? "agent",
    authority_origin: input.authority_origin ?? "user_chat",
    autonomy_level: input.mission.autonomy_level,
    allowed_effects: input.mission.allowed_effects,
    denied_effects: [],
    forbidden_effects: [],
    hard_stops: input.mission.hard_stops,
    target_constraints: input.target_constraints ?? input.mission.authority_envelope?.target_constraints ?? {
      repositories: input.mission.target_repositories,
      branches: [],
      branch_prefixes: [],
      paths: [],
      systems: input.mission.target_systems,
      environments: input.mission.target_environments,
      domains: [],
      accounts: []
    },
    tool_manifest_constraints: input.mission.authority_envelope?.tool_manifest_constraints ?? {},
    issued_at: issuedAt,
    valid_until: validUntil,
    usage_constraints: input.mission.authority_envelope?.usage_constraints ?? {},
    evidence_requirements: input.mission.verification_plan.evidence_requirements,
    receipt_requirements: ["mission_status", "guard_decision", "final_report"],
    escalation_requirements: input.mission.escalation_requirements
  });
}

export function authorityEnvelopeToCapabilityTokenTemplate(envelope: AuthorityEnvelope): CapabilityToken {
  return {
    schema_version: GuardSchemaVersion.CapabilityToken,
    token_id: `cap-token-template:${envelope.mission_id}`,
    mission_id: envelope.mission_id,
    issued_to: envelope.issued_to,
    issued_by: envelope.issued_by,
    subject_type: envelope.subject_type,
    authority_origin: envelope.authority_origin,
    allowed_effects: envelope.allowed_effects,
    denied_effects: envelope.denied_effects,
    forbidden_effects: envelope.forbidden_effects,
    hard_stops: envelope.hard_stops,
    target_constraints: envelope.target_constraints,
    tool_manifest_constraints: envelope.tool_manifest_constraints,
    issued_at: envelope.issued_at,
    valid_until: envelope.valid_until,
    usage_constraints: envelope.usage_constraints,
    evidence_requirements: envelope.evidence_requirements,
    receipt_requirements: envelope.receipt_requirements,
    escalation_requirements: envelope.escalation_requirements,
    signature_refs: ["template-only:not-production-auth"],
    status: "active"
  };
}

export function requestedActionFromPlanStep(mission: Mission, step: MissionPlanStep, actorId: string, effect = step.expected_effects[0]): RequestedAction {
  if (!effect) throw new Error(`Plan step has no expected effect: ${step.step_id}`);
  return {
    schema_version: GuardSchemaVersion.RequestedAction,
    action_id: `action:${mission.mission_id}:${step.step_id}:${effect}`,
    mission_id: mission.mission_id,
    actor_id: actorId,
    subject_type: "agent",
    effect,
    target: {
      repo: step.target_summary.repo ?? mission.target_repositories[0],
      branch: step.target_summary.branch,
      path: step.target_summary.path,
      environment: step.target_summary.environment ?? mission.target_environments[0],
      domain: step.target_summary.domain,
      account: step.target_summary.account,
      system: step.target_summary.system ?? mission.target_systems[0],
      resource_id: step.target_summary.resource_id
    },
    agent_id: actorId,
    manifest_id: step.target_summary.manifest_id,
    manifest_digest: step.target_summary.manifest_digest,
    requested_at: mission.updated_at,
    idempotency_key: `idem:${mission.mission_id}:${step.step_id}:${effect}`,
    metadata: { plan_step_id: step.step_id, mission_title: mission.title },
    risk_indicators: step.risk_indicators,
    side_effects: step.expected_effects,
    evidence_refs: step.receipt_refs
  };
}
