import {
  InMemoryTrustRegistry,
  diffSignedPayloads,
  riskyEscalatedToolManifest,
  trustedFixtureRegistryRecord,
  trustedSignedAgentCard,
  trustedSignedToolManifest,
  untrustedAgentCard
} from "@stealtheye/agent-registry";
import {
  createGuardDecisionReceipt,
  evaluateGuardDecision,
  type CapabilityToken,
  type GuardDecision,
  type GuardDecisionReceipt,
  type RequestedAction
} from "@stealtheye/guard";
import {
  compileMissionLanguage,
  hardStopMoneyMovementMission,
  hardStopProductionDeployMission,
  invalidTargetConstraintsMission,
  missingVerificationPlanMission,
  normalRepoFeatureMission,
  browserQaMission,
  ciRepairMission,
  productionDeployPlanStep,
  repoWritePlanStep,
  type MissionLanguage
} from "@stealtheye/mission-os";
import type { FixtureNameSchema, GuardFixtureSchema } from "./tool-schemas";
import type { z } from "zod";

export const APP_HOST_PUBLIC_FIXTURE_NOTICE = "Public-safe app-host fixtures only. No real secrets, credentials, production endpoints, customer data, private OAuth clients, cloud account identifiers, production tokens, live deployments, money movement, or sensitive runbooks.";

export type MissionFixtureName = z.infer<typeof FixtureNameSchema>;
export type GuardFixtureName = z.infer<typeof GuardFixtureSchema>;

export const invalidMissionLanguageFixture = {
  schema_version: "stealtheye-mission-language.v1",
  mission: {
    title: "Invalid fixture missing required fields"
  }
};

export function missionFixture(name: MissionFixtureName = "normal_repo_feature"): MissionLanguage {
  switch (name) {
    case "ci_repair": return ciRepairMission;
    case "browser_qa": return browserQaMission;
    case "hard_stop_production_deploy": return hardStopProductionDeployMission;
    case "hard_stop_money_movement": return hardStopMoneyMovementMission;
    case "invalid_target_constraints": return invalidTargetConstraintsMission;
    case "missing_verification_plan": return missingVerificationPlanMission;
    case "normal_repo_feature":
    default: return normalRepoFeatureMission;
  }
}

export function compileFixtureMission(name: MissionFixtureName = "normal_repo_feature") {
  const plan_steps = name === "hard_stop_production_deploy" ? [productionDeployPlanStep] : [repoWritePlanStep];
  return compileMissionLanguage(missionFixture(name), {
    now: "2026-01-01T00:00:00.000Z",
    issued_to: "agent:mission-os-fixture",
    plan_steps
  });
}

export function registryFixture() {
  const agentCard = trustedSignedAgentCard();
  const toolManifest = trustedSignedToolManifest();
  const registry = new InMemoryTrustRegistry();
  registry.trustPublisher(trustedFixtureRegistryRecord(agentCard, toolManifest));
  return {
    registry,
    agentCard,
    toolManifest,
    untrustedAgentCard: untrustedAgentCard(),
    riskyToolManifest: riskyEscalatedToolManifest()
  };
}

export function registryTrustPreview() {
  const fixture = registryFixture();
  return {
    agent_decision: fixture.registry.verifyAgentCard(fixture.agentCard),
    manifest_decision: fixture.registry.verifyToolManifest(fixture.toolManifest)
  };
}

export function manifestDiffPreview() {
  const fixture = registryFixture();
  return diffSignedPayloads(fixture.toolManifest, fixture.riskyToolManifest);
}

export interface GuardPreviewFixture {
  action: RequestedAction;
  capability_token: CapabilityToken;
  decision: GuardDecision;
  receipt: GuardDecisionReceipt;
}

export function guardPreviewFixture(name: GuardFixtureName = "safe_repo_write"): GuardPreviewFixture {
  const missionName: MissionFixtureName = name === "hard_stop_production_deploy" ? "hard_stop_production_deploy" : "normal_repo_feature";
  const compiled = compileFixtureMission(missionName);
  const action = compiled.requested_action_templates[0];
  if (!action) throw new Error(`No requested action template for fixture: ${name}`);
  const registryTrust = { trusted: true, valid: true, trust_status: "trusted" as const, review_status: "approved" as const, errors: [], warnings: [], revoked: false };
  const decision = evaluateGuardDecision(action, [compiled.capability_token_template], { now: new Date("2026-01-01T00:01:00.000Z"), registryTrust });
  const receipt = createGuardDecisionReceipt(decision, action, [compiled.capability_token_template.token_id]);
  return { action, capability_token: compiled.capability_token_template, decision, receipt };
}
