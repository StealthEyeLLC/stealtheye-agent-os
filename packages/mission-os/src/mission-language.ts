import { MissionLanguageSchema, MissionOsSchemaVersion, MissionSchema, type Mission, type MissionLanguage } from "./schemas";

function slug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 64) || "mission";
}

export function missionIdFromLanguage(language: MissionLanguage): string {
  return language.mission.mission_id ?? `mission:${slug(language.mission.title)}`;
}

export function validateMissionLanguage(input: unknown): MissionLanguage {
  return MissionLanguageSchema.parse(input);
}

export function safeValidateMissionLanguage(input: unknown): { valid: true; value: MissionLanguage } | { valid: false; errors: string[] } {
  const parsed = MissionLanguageSchema.safeParse(input);
  if (parsed.success) return { valid: true, value: parsed.data };
  return { valid: false, errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) };
}

export interface NormalizeMissionOptions {
  now?: string;
  status?: Mission["status"];
}

export function normalizeMissionLanguage(input: unknown): MissionLanguage {
  const parsed = validateMissionLanguage(input);
  return {
    ...parsed,
    mission: {
      ...parsed.mission,
      mission_id: missionIdFromLanguage(parsed),
      evidence_requirements: [...new Set([...parsed.mission.evidence_requirements, ...parsed.mission.authority.evidence_requirements, ...parsed.mission.verification.evidence_requirements])],
      receipt_requirements: [...new Set([...parsed.mission.receipt_requirements, ...parsed.mission.authority.receipt_requirements])]
    }
  };
}

export function missionLanguageToMission(input: unknown, options: NormalizeMissionOptions = {}): Mission {
  const language = normalizeMissionLanguage(input);
  const now = options.now ?? new Date().toISOString();
  const mission = language.mission;
  return MissionSchema.parse({
    schema_version: MissionOsSchemaVersion.Mission,
    mission_id: mission.mission_id,
    title: mission.title,
    goal: mission.goal,
    requester: mission.requester,
    created_at: now,
    updated_at: now,
    status: options.status ?? "planned",
    priority: mission.priority,
    autonomy_level: mission.autonomy_level,
    target_systems: mission.targets.systems,
    target_repositories: mission.targets.repositories,
    target_environments: mission.targets.environments,
    constraints: [...mission.constraints, ...mission.execution_constraints, ...mission.stop_conditions],
    allowed_effects: mission.authority.allowed_effects,
    hard_stops: mission.authority.hard_stops,
    planning_refs: [`plan:${mission.mission_id}`],
    task_refs: [],
    receipt_refs: [],
    artifact_refs: [],
    risk_classification: mission.risk_tier,
    success_criteria: mission.verification.success_criteria,
    verification_plan: {
      ...mission.verification,
      browser_flows: [...new Set([...mission.verification.browser_flows, ...mission.browser_flows])],
      evidence_requirements: mission.evidence_requirements
    },
    escalation_requirements: mission.authority.escalation_requirements,
    final_report_expectations: mission.final_report
  });
}
