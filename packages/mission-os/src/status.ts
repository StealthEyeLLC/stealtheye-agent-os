import { MissionOsSchemaVersion, type Mission, type MissionPlan, type MissionStatusSnapshot, type MissionStatusValue } from "./schemas";
import { blockedSteps, readySteps } from "./planning";

const allowedTransitions: Record<MissionStatusValue, MissionStatusValue[]> = {
  draft: ["planned", "canceled"],
  planned: ["awaiting_authority", "authorized", "blocked", "canceled"],
  awaiting_authority: ["authorized", "blocked", "canceled"],
  authorized: ["running", "blocked", "canceled"],
  running: ["blocked", "completed", "failed", "canceled"],
  blocked: ["awaiting_authority", "authorized", "running", "failed", "canceled"],
  completed: [],
  failed: [],
  canceled: []
};

export function canTransitionMissionStatus(from: MissionStatusValue, to: MissionStatusValue): boolean {
  return allowedTransitions[from].includes(to);
}

export function transitionMissionStatus(mission: Mission, to: MissionStatusValue, updatedAt = new Date().toISOString()): Mission {
  if (!canTransitionMissionStatus(mission.status, to)) throw new Error(`Invalid mission status transition: ${mission.status} -> ${to}`);
  return { ...mission, status: to, updated_at: updatedAt };
}

export function createInitialStatus(mission: Mission, plan?: MissionPlan): MissionStatusSnapshot {
  return summarizeMissionStatus(mission, plan);
}

export function identifyBlockers(mission: Mission, plan?: MissionPlan): string[] {
  const blockers: string[] = [];
  if (mission.status === "awaiting_authority") blockers.push("mission is awaiting authority");
  if (mission.status === "blocked") blockers.push("mission status is blocked");
  if (mission.verification_plan.commands.length === 0 && mission.verification_plan.required_checks.length === 0 && mission.verification_plan.browser_flows.length === 0) blockers.push("verification plan is missing executable checks");
  if (plan) blockers.push(...blockedSteps(plan).map((step) => `blocked step: ${step.step_id}`));
  return blockers;
}

export function identifyNextActions(mission: Mission, plan?: MissionPlan): string[] {
  if (mission.status === "draft") return ["compile mission language", "create mission plan"];
  if (mission.status === "planned") return ["request mission authority"];
  if (mission.status === "awaiting_authority") return ["obtain explicit authority"];
  if (mission.status === "authorized" && plan) return readySteps(plan).map((step) => `run ${step.step_id}`);
  if (mission.status === "authorized") return ["start mission execution"];
  if (mission.status === "running" && plan) return readySteps(plan).map((step) => `continue ${step.step_id}`);
  if (mission.status === "blocked") return ["resolve blockers or escalate"];
  return [];
}

export function completionReadiness(mission: Mission, plan?: MissionPlan): boolean {
  const planComplete = !plan || plan.steps.every((step) => step.status === "completed" || step.status === "skipped");
  const hasRequiredReceipts = mission.receipt_refs.length > 0 || mission.final_report_expectations.required;
  return planComplete && hasRequiredReceipts && identifyBlockers(mission, plan).length === 0;
}

export function summarizeMissionStatus(mission: Mission, plan?: MissionPlan): MissionStatusSnapshot {
  const blockers = identifyBlockers(mission, plan);
  const nextActions = identifyNextActions(mission, plan);
  const completion_ready = completionReadiness(mission, plan);
  const summary = blockers.length > 0
    ? `Mission ${mission.mission_id} is ${mission.status} with ${blockers.length} blocker(s).`
    : completion_ready
      ? `Mission ${mission.mission_id} is ready for completion reporting.`
      : `Mission ${mission.mission_id} is ${mission.status}; next actions: ${nextActions.join(", ") || "none"}.`;
  return {
    schema_version: MissionOsSchemaVersion.MissionStatus,
    mission_id: mission.mission_id,
    status: mission.status,
    blockers,
    next_actions: nextActions,
    completion_ready,
    updated_at: mission.updated_at,
    summary
  };
}
