import { guardEvalFixtures, trustedCapabilityToken, trustedRegistryDecisionFixture } from "@stealtheye/guard";
import { compileMissionLanguage, normalRepoFeatureMission } from "@stealtheye/mission-os";
import { createArtifactReference } from "./artifacts";
import { createIdempotencyRecord } from "./idempotency";
import { createLease } from "./leases";
import { createWorkerReceiptEvent } from "./receipts";
import { defaultRetryPolicy, scheduleRetry } from "./retry-policy";
import { transitionTaskStatus } from "./status";
import { createWorkerTask, workerTasksFromMissionPlan } from "./tasks";

export const PUBLIC_WORKER_FLEET_FIXTURE_NOTICE = "Public-safe Worker Fleet fixtures only. No real secrets, credentials, production endpoints, customer data, OAuth clients, cloud account identifiers, queue URLs, storage buckets, or live write APIs.";
export const fixtureNow = "2026-01-01T00:00:00.000Z";

export const compiledWorkerMission = compileMissionLanguage(normalRepoFeatureMission, {
  now: fixtureNow,
  issued_to: "agent:worker-fleet-fixture"
});

export const normalMissionStepTask = workerTasksFromMissionPlan({
  mission: compiledWorkerMission.mission,
  plan: compiledWorkerMission.plan,
  actor_id: "agent:worker-fleet-fixture",
  capability_token_refs: [compiledWorkerMission.capability_token_template.token_id],
  now: fixtureNow
})[0]!;

export const guardPreflightAllowTask = createWorkerTask({
  mission_id: guardEvalFixtures.normalDelegatedRepoActionAllowed.mission_id,
  plan_id: "plan:fixture:guard-preflight-allow",
  step_id: "step:guard-preflight-allow",
  title: "Guard preflight allow fixture",
  description: "Fixture task that Guard should allow inside mission-scoped authority.",
  requested_action: guardEvalFixtures.normalDelegatedRepoActionAllowed,
  capability_token_refs: [trustedCapabilityToken.token_id],
  now: fixtureNow
});

export const guardPreflightHardStopTask = createWorkerTask({
  mission_id: guardEvalFixtures.productionDeployEscalated.mission_id,
  plan_id: "plan:fixture:worker-fleet-hard-stop",
  step_id: "step:production-deploy",
  title: "Attempt production deploy preflight",
  description: "Fixture task that models a hard-stop production deployment request without executing it.",
  requested_action: guardEvalFixtures.productionDeployEscalated,
  capability_token_refs: [trustedCapabilityToken.token_id],
  now: fixtureNow
});

export const untrustedRegistryBlockTask = createWorkerTask({
  mission_id: guardEvalFixtures.untrustedManifestDenied.mission_id,
  plan_id: "plan:fixture:untrusted-registry",
  step_id: "step:untrusted-registry",
  title: "Check untrusted registry summary",
  description: "Fixture task that should be blocked by Guard when registry trust is untrusted.",
  requested_action: guardEvalFixtures.untrustedManifestDenied,
  capability_token_refs: [trustedCapabilityToken.token_id],
  now: fixtureNow
});

export const retryableFailureTask = transitionTaskStatus(normalMissionStepTask, "failed", fixtureNow, {
  error_summary: { code: "temporary_failure", message: "Temporary fixture failure.", retryable: true },
  retry_state: scheduleRetry(normalMissionStepTask.retry_state!, "temporary_failure", new Date(fixtureNow))
});

export const nonRetryableFailureTask = transitionTaskStatus(normalMissionStepTask, "failed", fixtureNow, {
  error_summary: { code: "guard_denied", message: "Guard denied fixture work.", retryable: false },
  retry_state: scheduleRetry(normalMissionStepTask.retry_state!, "guard_denied", new Date(fixtureNow))
});

export const activeLeaseFixture = createLease({
  task_id: normalMissionStepTask.task_id,
  worker_id: "worker:fixture:1",
  now: new Date(fixtureNow),
  ttl_ms: 60_000,
  evidence_refs: ["test://worker-fleet/lease"]
});

export const staleLeaseRejectionFixture = { lease: activeLeaseFixture, stale_fencing_token: activeLeaseFixture.fencing_token - 1 };
export const idempotencyDuplicateFixture = createIdempotencyRecord(normalMissionStepTask, fixtureNow);
export const idempotencyCollisionTask = { ...normalMissionStepTask, step_id: "step:different-action", task_id: "worker-task:collision:different-action" };

export const publicSafeArtifactFixture = createArtifactReference({
  artifact_id: "artifact:worker-fleet:public-safe-preview",
  task_id: normalMissionStepTask.task_id,
  mission_id: normalMissionStepTask.mission_id,
  kind: "preview",
  uri: "test://worker-fleet/artifacts/public-safe-preview",
  summary: "Public-safe worker artifact reference fixture.",
  created_at: fixtureNow,
  sensitivity: "public",
  retention_hint: "public-safe-fixture"
});

export const workerReceiptEventFixture = createWorkerReceiptEvent({
  task: { ...normalMissionStepTask, artifact_refs: [publicSafeArtifactFixture] },
  worker_id: "worker:fixture:1",
  event_type: "task_completed",
  timestamp: fixtureNow,
  status_before: "running",
  status_after: "completed",
  summary: "Worker fixture task completed with public-safe artifact reference.",
  evidence_refs: ["test://worker-fleet/receipt"]
});

export const trustedWorkerRegistrySummary = trustedRegistryDecisionFixture();
export { trustedCapabilityToken, defaultRetryPolicy };
