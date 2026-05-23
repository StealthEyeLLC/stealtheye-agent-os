import { MissionOsSchemaVersion, MissionPlanSchema, type Mission, type MissionPlan, type MissionPlanStep } from "./schemas";

export function createMissionPlan(mission: Mission, steps: MissionPlanStep[], now = mission.created_at): MissionPlan {
  return MissionPlanSchema.parse({
    schema_version: MissionOsSchemaVersion.MissionPlan,
    plan_id: `plan:${mission.mission_id}`,
    mission_id: mission.mission_id,
    steps,
    created_at: now,
    updated_at: now
  });
}

export function validatePlanDependencies(plan: MissionPlan): string[] {
  const stepIds = new Set(plan.steps.map((step) => step.step_id));
  return plan.steps.flatMap((step) => step.depends_on.filter((dependency) => !stepIds.has(dependency)).map((dependency) => `missing dependency ${dependency} for ${step.step_id}`));
}

export function readySteps(plan: MissionPlan): MissionPlanStep[] {
  const completed = new Set(plan.steps.filter((step) => step.status === "completed").map((step) => step.step_id));
  return plan.steps.filter((step) => step.status === "pending" && step.depends_on.every((dependency) => completed.has(dependency)));
}

export function blockedSteps(plan: MissionPlan): MissionPlanStep[] {
  return plan.steps.filter((step) => step.status === "blocked");
}

export function defaultPlanSteps(mission: Mission): MissionPlanStep[] {
  const repo = mission.target_repositories[0] ?? "StealthEyeLLC/stealtheye-agent-os";
  const branch = mission.authority_envelope?.target_constraints.branch_prefixes[0] ? `${mission.authority_envelope.target_constraints.branch_prefixes[0]}mission-os-language` : "agent/mission-os-language";
  const environment = mission.target_environments[0] ?? "development";
  const system = mission.target_systems[0] ?? "github";

  return [
    {
      step_id: "plan-step:read-context",
      title: "Read mission context",
      description: "Inspect repository and mission context before changing files.",
      depends_on: [],
      status: "pending",
      expected_effects: ["read_repo"],
      target_summary: { repo, branch, environment, system },
      verification_refs: [],
      receipt_refs: ["receipt:mission-context"],
      risk_indicators: []
    },
    {
      step_id: "plan-step:write-branch-files",
      title: "Write scoped branch files",
      description: "Apply scoped repository changes on the mission branch.",
      depends_on: ["plan-step:read-context"],
      status: "pending",
      expected_effects: ["write_branch_files"],
      target_summary: { repo, branch, path: "packages/mission-os/", environment, system },
      verification_refs: ["verification:pnpm-typecheck", "verification:pnpm-test"],
      receipt_refs: ["receipt:diff"],
      risk_indicators: []
    },
    {
      step_id: "plan-step:open-pr",
      title: "Open pull request",
      description: "Open a pull request with implementation summary and verification expectations.",
      depends_on: ["plan-step:write-branch-files"],
      status: "pending",
      expected_effects: ["open_pr"],
      target_summary: { repo, branch, environment, system },
      verification_refs: ["verification:ci"],
      receipt_refs: ["receipt:pull-request"],
      risk_indicators: []
    }
  ];
}
