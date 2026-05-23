import { type MissionLanguage, MissionOsSchemaVersion, type MissionPlanStep } from "./schemas";

export const PUBLIC_MISSION_OS_FIXTURE_NOTICE = "Public-safe Mission OS fixtures only. No real secrets, credentials, production endpoints, customer data, OAuth clients, cloud account identifiers, production tokens, money movement, or sensitive runbooks.";

const baseAuthority: MissionLanguage["mission"]["authority"] = {
  allowed_effects: ["read_repo", "write_branch_files", "commit_branch", "open_pr", "read_ci", "write_receipt", "generate_final_report"],
  denied_effects: [],
  forbidden_effects: ["raw_secret_access", "money_movement", "production_deploy", "production_data_mutation", "force_push", "history_rewrite", "weaken_ci", "delete_test_to_pass"],
  hard_stops: ["raw_secrets_credentials", "money_billing_subscriptions", "production_deploy_or_data_mutation", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "platform_required_confirmation"],
  tool_manifest_constraints: {
    allowed_agent_ids: ["agent:mission-os-fixture"],
    allowed_manifest_ids: ["tool-manifest:codeops-fixture"],
    pinned_digests: [],
    required_trust_status: "trusted_and_approved"
  },
  usage_constraints: { max_uses: 100, max_attempts: 100, max_commits: 20, max_cost_cents: 0, uses: 0, attempts: 0, commits: 0, cost_cents: 0 },
  evidence_requirements: ["diff", "tests", "ci_status"],
  receipt_requirements: ["guard_decision", "mission_status", "final_report"],
  escalation_requirements: ["hard_stop", "outside_scope", "untrusted_manifest"],
  validity_minutes: 1440
};

export const normalRepoFeatureMission: MissionLanguage = {
  schema_version: MissionOsSchemaVersion.MissionLanguage,
  mission: {
    mission_id: "mission:fixture:repo-feature",
    title: "Normal repo feature mission",
    goal: "Implement a package-level repository feature on a scoped branch.",
    requester: "user:jamie-fixture",
    priority: "normal",
    autonomy_level: "delegated",
    risk_tier: "medium",
    targets: {
      systems: ["github"],
      repositories: ["StealthEyeLLC/stealtheye-agent-os"],
      branch_prefixes: ["agent/"],
      branches: [],
      paths: ["packages/mission-os/", "docs/", "README.md"],
      environments: ["development", "test"],
      domains: [],
      accounts: ["StealthEyeLLC"]
    },
    constraints: [PUBLIC_MISSION_OS_FIXTURE_NOTICE],
    authority: baseAuthority,
    verification: {
      commands: ["pnpm typecheck", "pnpm test"],
      required_checks: ["CI"],
      browser_flows: [],
      evidence_requirements: ["diff", "ci_status"],
      success_criteria: ["package typechecks", "tests pass", "PR opened"]
    },
    browser_flows: [],
    evidence_requirements: ["diff", "ci_status"],
    receipt_requirements: ["guard_decision", "final_report"],
    execution_constraints: ["do not mutate protected branches", "do not weaken CI"],
    stop_conditions: ["hard stop reached", "authority missing"],
    final_report: { required: true, sections: ["summary", "verification", "known_gaps", "next_target"], include_ci_status: true, include_file_list: true, include_known_gaps: true, include_next_target: true }
  }
};

export const ciRepairMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:ci-repair",
    title: "CI repair mission",
    goal: "Diagnose and repair failing CI without weakening checks.",
    authority: { ...baseAuthority, allowed_effects: ["read_repo", "read_ci", "write_branch_files", "commit_branch", "rerun_failed_jobs", "write_receipt", "generate_final_report"] },
    verification: { commands: ["pnpm typecheck", "pnpm test"], required_checks: ["CI"], browser_flows: [], evidence_requirements: ["ci_logs", "diff", "rerun_status"], success_criteria: ["failure diagnosed", "tests pass", "CI rerun green"] }
  }
};

export const browserQaMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:browser-qa",
    title: "Browser QA mission",
    goal: "Observe a public-safe browser flow and collect QA evidence.",
    authority: { ...baseAuthority, allowed_effects: ["browser_observe", "write_receipt", "generate_final_report"] },
    browser_flows: ["fixture://browser/public-preview-smoke"],
    verification: { commands: [], required_checks: [], browser_flows: ["fixture://browser/public-preview-smoke"], evidence_requirements: ["screenshot", "console_log_summary"], success_criteria: ["browser flow observed", "receipt recorded"] }
  }
};

export const hardStopProductionDeployMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:production-deploy-hard-stop",
    title: "Hard-stop production deploy mission",
    goal: "Demonstrate that production deploy requires escalation.",
    risk_tier: "high",
    targets: { ...normalRepoFeatureMission.mission.targets, environments: ["production"] },
    authority: { ...baseAuthority, allowed_effects: ["production_deploy", "write_receipt"], hard_stops: ["production_deploy_or_data_mutation", "platform_required_confirmation"] }
  }
};

export const hardStopMoneyMovementMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:money-hard-stop",
    title: "Hard-stop money movement mission",
    goal: "Demonstrate that money movement requires escalation.",
    risk_tier: "high",
    authority: { ...baseAuthority, allowed_effects: ["money_movement", "write_receipt"], hard_stops: ["money_billing_subscriptions", "platform_required_confirmation"] }
  }
};

export const invalidTargetConstraintsMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:invalid-targets",
    title: "Invalid target constraints mission",
    targets: { ...normalRepoFeatureMission.mission.targets, repositories: [] }
  }
};

export const missingVerificationPlanMission: MissionLanguage = {
  ...normalRepoFeatureMission,
  mission: {
    ...normalRepoFeatureMission.mission,
    mission_id: "mission:fixture:missing-verification",
    title: "Mission with missing verification plan",
    verification: { commands: [], required_checks: [], browser_flows: [], evidence_requirements: [], success_criteria: [] }
  }
};

export const repoWritePlanStep: MissionPlanStep = {
  step_id: "plan-step:fixture-repo-write",
  title: "Write fixture repo files",
  description: "Write scoped fixture files on a branch.",
  depends_on: [],
  status: "pending",
  expected_effects: ["write_branch_files"],
  target_summary: {
    repo: "StealthEyeLLC/stealtheye-agent-os",
    branch: "agent/mission-os-language",
    path: "packages/mission-os/src/index.ts",
    environment: "development",
    system: "github",
    manifest_id: "tool-manifest:codeops-fixture"
  },
  verification_refs: ["verification:pnpm-typecheck", "verification:pnpm-test"],
  receipt_refs: ["receipt:guard-decision"],
  risk_indicators: []
};

export const productionDeployPlanStep: MissionPlanStep = {
  ...repoWritePlanStep,
  step_id: "plan-step:fixture-prod-deploy",
  title: "Attempt production deploy fixture",
  expected_effects: ["production_deploy"],
  target_summary: { environment: "production", system: "github", resource_id: "fixture-production-deploy" },
  risk_indicators: ["production deploy"]
};
