import { describe, expect, it } from "vitest";
import { evaluateGuardDecision } from "@stealtheye/guard";
import {
  addMissionArtifactRef,
  addMissionReceiptRef,
  compileMissionLanguage,
  compileMissionToGuardInputs,
  createMissionPlan,
  createMissionReceiptRefs,
  hardStopProductionDeployMission,
  invalidTargetConstraintsMission,
  missingVerificationPlanMission,
  normalRepoFeatureMission,
  productionDeployPlanStep,
  PUBLIC_MISSION_OS_FIXTURE_NOTICE,
  repoWritePlanStep,
  requestedActionFromPlanStep,
  safeValidateMissionLanguage,
  summarizeMissionStatus,
  transitionMissionStatus,
  validateMissionLanguage
} from "../src";

const now = "2026-01-01T00:00:00.000Z";
const guardNow = new Date("2026-01-01T00:01:00.000Z");
const registryTrust = { trusted: true, valid: true, trust_status: "trusted" as const, review_status: "approved" as const, errors: [], warnings: [], revoked: false };

describe("Mission OS + StealthEye Mission Language", () => {
  it("validates a valid Mission Language object", () => {
    const value = validateMissionLanguage(normalRepoFeatureMission);
    expect(value.mission.goal).toContain("repository feature");
  });

  it("rejects an invalid Mission Language object", () => {
    const result = safeValidateMissionLanguage({ schema_version: "stealtheye-mission-language.v1", mission: { title: "bad" } });
    expect(result.valid).toBe(false);
  });

  it("compiles Mission Language to a normalized mission", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    expect(compiled.mission.schema_version).toBe("stealtheye-mission.v1");
    expect(compiled.mission.status).toBe("planned");
    expect(compiled.mission.target_repositories).toEqual(["StealthEyeLLC/stealtheye-agent-os"]);
  });

  it("compiles Mission Language to an authority envelope", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    expect(compiled.authority_envelope.mission_id).toBe(compiled.mission.mission_id);
    expect(compiled.authority_envelope.allowed_effects).toContain("write_branch_files");
    expect(compiled.authority_envelope.target_constraints.branch_prefixes).toEqual(["agent/"]);
  });

  it("authority envelope can produce capability-token-compatible data", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    expect(compiled.capability_token_template.schema_version).toBe("capability-token.v1");
    expect(compiled.capability_token_template.mission_id).toBe(compiled.mission.mission_id);
    expect(compiled.capability_token_template.status).toBe("active");
  });

  it("mission plan steps preserve dependencies", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    const writeStep = compiled.plan.steps.find((step) => step.step_id === "plan-step:write-branch-files");
    expect(writeStep?.depends_on).toEqual(["plan-step:read-context"]);
  });

  it("generates a Guard requested repo write action from a plan step", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture", plan_steps: [repoWritePlanStep] });
    const action = requestedActionFromPlanStep(compiled.mission, repoWritePlanStep, "agent:mission-os-fixture", "write_branch_files");
    expect(action.schema_version).toBe("requested-action.v1");
    expect(action.effect).toBe("write_branch_files");
    expect(action.target.repo).toBe("StealthEyeLLC/stealtheye-agent-os");
  });

  it("Guard allows a safe planned action with matching authority", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture", plan_steps: [repoWritePlanStep] });
    const action = compiled.requested_action_templates[0];
    expect(action).toBeDefined();
    const decision = evaluateGuardDecision(action!, [compiled.capability_token_template], { now: guardNow, registryTrust });
    expect(decision.decision).toBe("allow");
    expect(decision.reason_codes).toEqual([]);
  });

  it("Guard escalates or denies a hard-stop planned action", () => {
    const compiled = compileMissionLanguage(hardStopProductionDeployMission, { now, issued_to: "agent:mission-os-fixture", plan_steps: [productionDeployPlanStep] });
    const action = compiled.requested_action_templates[0];
    expect(action?.effect).toBe("production_deploy");
    const decision = evaluateGuardDecision(action!, [compiled.capability_token_template], { now: guardNow, registryTrust });
    expect(["escalate", "deny"]).toContain(decision.decision);
    expect(decision.reason_codes).toContain("hard_stop:production_deploy_or_data_mutation");
  });

  it("handles mission status transition happy path", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    const awaiting = transitionMissionStatus(compiled.mission, "awaiting_authority", "2026-01-01T00:02:00.000Z");
    const authorized = transitionMissionStatus(awaiting, "authorized", "2026-01-01T00:03:00.000Z");
    expect(authorized.status).toBe("authorized");
  });

  it("rejects invalid status transition", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    expect(() => transitionMissionStatus(compiled.mission, "completed", "2026-01-01T00:02:00.000Z")).toThrow("Invalid mission status transition");
  });

  it("mission status summary includes blockers and next actions", () => {
    const compiled = compileMissionLanguage(missingVerificationPlanMission, { now, issued_to: "agent:mission-os-fixture" });
    const summary = summarizeMissionStatus(compiled.mission, compiled.plan);
    expect(summary.blockers).toContain("verification plan is missing executable checks");
    expect(summary.next_actions).toContain("request mission authority");
  });

  it("receipt and evidence references are preserved", () => {
    const compiled = compileMissionLanguage(normalRepoFeatureMission, { now, issued_to: "agent:mission-os-fixture" });
    const withReceipt = addMissionReceiptRef(compiled.mission, { ref_id: "receipt:guard:1", kind: "guard_decision", uri: "test://guard/1", summary: "fixture guard decision", created_at: now });
    const withArtifact = addMissionArtifactRef(withReceipt, { artifact_id: "artifact:diff:1", kind: "diff", uri: "test://artifact/diff", summary: "fixture diff" }, now);
    const refs = createMissionReceiptRefs(withArtifact);
    expect(refs.guard_decision_refs[0]?.ref_id).toBe("receipt:guard:1");
    expect(refs.artifact_refs[0]?.artifact_id).toBe("artifact:diff:1");
  });

  it("includes invalid target constraints and missing verification fixtures as eval cases", () => {
    const invalidTargets = compileMissionLanguage(invalidTargetConstraintsMission, { now, issued_to: "agent:mission-os-fixture" });
    const missingVerification = compileMissionLanguage(missingVerificationPlanMission, { now, issued_to: "agent:mission-os-fixture" });
    expect(invalidTargets.mission.target_repositories).toEqual([]);
    expect(summarizeMissionStatus(missingVerification.mission, missingVerification.plan).blockers).toContain("verification plan is missing executable checks");
  });

  it("does not include obvious real-secret material in fixtures", () => {
    const serialized = JSON.stringify({ normalRepoFeatureMission, PUBLIC_MISSION_OS_FIXTURE_NOTICE });
    expect(serialized).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(serialized).not.toMatch(/BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY/);
    expect(serialized).not.toMatch(/client_secret=/);
    expect(serialized).not.toMatch(/PRIVATE_KEY=/);
  });
});
