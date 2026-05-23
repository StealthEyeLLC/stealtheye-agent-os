import { describe, expect, it } from "vitest";
import {
  PUBLIC_WORKER_FLEET_FIXTURE_NOTICE,
  activeLeaseFixture,
  compiledWorkerMission,
  fixtureNow,
  guardPreflightAllowTask,
  guardPreflightHardStopTask,
  idempotencyCollisionTask,
  idempotencyDuplicateFixture,
  nonRetryableFailureTask,
  normalMissionStepTask,
  publicSafeArtifactFixture,
  retryableFailureTask,
  staleLeaseRejectionFixture,
  trustedCapabilityToken,
  trustedWorkerRegistrySummary,
  untrustedRegistryBlockTask,
  workerReceiptEventFixture
} from "../src/fixtures";
import { completeIdempotencyRecord, computeActionFingerprint, createIdempotencyRecord, detectIdempotency } from "../src/idempotency";
import { createLease, heartbeatLease, isLeaseActive, isLeaseExpired } from "../src/leases";
import { runGuardPreflight } from "../src/preflight";
import { createRetryState, retryDelayMs, scheduleRetry } from "../src/retry-policy";
import { WorkerTaskSchema } from "../src/schemas";
import { blockerSummary, canTransitionTaskStatus, failedRetryableTasks, missionWorkerSummary, nextRunnableTasks, transitionTaskStatus } from "../src/status";
import { workerTasksFromMissionPlan } from "../src/tasks";

const now = new Date(fixtureNow);
const secretLikeFixturePattern = new RegExp([
  "AKIA[0-9A-Z]{16}",
  "BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY",
  `client_${"secret"}=`,
  `PRIVATE_${"KEY"}=`,
  `pass${"word"}=`
].join("|"));

describe("Worker Fleet foundation", () => {
  it("validates a valid worker task", () => {
    expect(WorkerTaskSchema.parse(normalMissionStepTask).task_id).toBe(normalMissionStepTask.task_id);
  });

  it("rejects an invalid worker task", () => {
    expect(() => WorkerTaskSchema.parse({ ...normalMissionStepTask, task_id: "" })).toThrow();
  });

  it("creates worker tasks from Mission OS plan steps", () => {
    const tasks = workerTasksFromMissionPlan({ mission: compiledWorkerMission.mission, plan: compiledWorkerMission.plan, now: fixtureNow });
    expect(tasks.length).toBe(compiledWorkerMission.plan.steps.length);
    expect(tasks[0]?.mission_id).toBe(compiledWorkerMission.mission.mission_id);
    expect(tasks[0]?.plan_id).toBe(compiledWorkerMission.plan.plan_id);
    expect(tasks[0]?.step_id).toBe(compiledWorkerMission.plan.steps[0]?.step_id);
  });

  it("preserves dependencies from Mission OS plan steps", () => {
    const tasks = workerTasksFromMissionPlan({ mission: compiledWorkerMission.mission, plan: compiledWorkerMission.plan, now: fixtureNow });
    const dependent = tasks.find((task) => task.dependencies.length > 0);
    expect(dependent?.dependencies[0]).toContain(compiledWorkerMission.plan.steps[0]!.step_id);
  });

  it("creates and recognizes an active lease", () => {
    const lease = createLease({ task_id: normalMissionStepTask.task_id, worker_id: "worker:test", now, ttl_ms: 60_000 });
    expect(lease.lease_status).toBe("active");
    expect(isLeaseActive(lease, now)).toBe(true);
  });

  it("detects an expired lease", () => {
    expect(isLeaseExpired(activeLeaseFixture, new Date(now.getTime() + 61_000))).toBe(true);
  });

  it("updates heartbeat and fencing token", () => {
    const updated = heartbeatLease(activeLeaseFixture, new Date(now.getTime() + 1000), 60_000);
    expect(updated.heartbeat_at).not.toBe(activeLeaseFixture.heartbeat_at);
    expect(updated.fencing_token).toBe(activeLeaseFixture.fencing_token + 1);
  });

  it("rejects stale fenced lease updates", () => {
    expect(() => heartbeatLease(staleLeaseRejectionFixture.lease, now, 60_000, staleLeaseRejectionFixture.stale_fencing_token)).toThrow(/stale fenced lease/);
  });

  it("computes stable idempotency fingerprints", () => {
    expect(computeActionFingerprint(normalMissionStepTask)).toBe(computeActionFingerprint({ ...normalMissionStepTask, updated_at: new Date(now.getTime() + 1000).toISOString() }));
  });

  it("detects duplicate idempotency and returns completed result refs", () => {
    const completed = completeIdempotencyRecord(idempotencyDuplicateFixture, "receipt:existing-result", fixtureNow);
    const detected = detectIdempotency(completed, normalMissionStepTask, fixtureNow);
    expect(detected.kind).toBe("duplicate");
    expect(detected.result_ref).toBe("receipt:existing-result");
  });

  it("detects idempotency collisions", () => {
    const detected = detectIdempotency(idempotencyDuplicateFixture, idempotencyCollisionTask, fixtureNow);
    expect(detected.kind).toBe("collision");
  });

  it("schedules fixed backoff retries deterministically", () => {
    const state = createRetryState({ ...normalMissionStepTask.retry_policy, backoff_strategy: "fixed", base_delay_ms: 5000, max_delay_ms: 30_000 });
    const scheduled = scheduleRetry(state, "temporary_failure", now);
    expect(retryDelayMs(state, 1)).toBe(5000);
    expect(scheduled.next_retry_at).toBe(new Date(now.getTime() + 5000).toISOString());
  });

  it("schedules exponential backoff retries deterministically", () => {
    const state = createRetryState({ ...normalMissionStepTask.retry_policy, backoff_strategy: "exponential", base_delay_ms: 1000, max_delay_ms: 30_000 }, 2);
    expect(retryDelayMs(state, 3)).toBe(4000);
  });

  it("marks retries exhausted", () => {
    const state = createRetryState({ ...normalMissionStepTask.retry_policy, max_attempts: 1 });
    const scheduled = scheduleRetry(state, "temporary_failure", now);
    expect(scheduled.exhausted).toBe(true);
  });

  it("allows valid task status transitions", () => {
    const leased = transitionTaskStatus(normalMissionStepTask, "leased", fixtureNow);
    const running = transitionTaskStatus(leased, "running", fixtureNow);
    expect(running.status).toBe("running");
  });

  it("rejects invalid task status transitions", () => {
    expect(canTransitionTaskStatus("completed", "running")).toBe(false);
    const completedTask = WorkerTaskSchema.parse({ ...normalMissionStepTask, status: "completed", completed_at: fixtureNow });
    expect(() => transitionTaskStatus(completedTask, "running", fixtureNow)).toThrow(/invalid task status transition/);
  });

  it("detects next runnable tasks", () => {
    const tasks = workerTasksFromMissionPlan({ mission: compiledWorkerMission.mission, plan: compiledWorkerMission.plan, now: fixtureNow });
    expect(nextRunnableTasks(tasks).map((task) => task.step_id)).toContain(compiledWorkerMission.plan.steps[0]!.step_id);
  });

  it("summarizes blockers", () => {
    const blocked = transitionTaskStatus(normalMissionStepTask, "blocked", fixtureNow, { blocked_reason: "guard_denied" });
    expect(blockerSummary([blocked])).toEqual([`${blocked.task_id}: guard_denied`]);
  });

  it("allows safe Guard preflight tasks", () => {
    const result = runGuardPreflight({ task: guardPreflightAllowTask, capability_tokens: [trustedCapabilityToken], registry_trust_summary: trustedWorkerRegistrySummary, worker_id: "worker:test", now });
    expect(result.outcome).toBe("allow");
    expect(result.updated_task_status_suggestion).toBe("leased");
    expect(result.receipt_event.event_type).toBe("guard_preflight_checked");
  });

  it("blocks hard-stop Guard preflight tasks", () => {
    const result = runGuardPreflight({ task: guardPreflightHardStopTask, capability_tokens: [trustedCapabilityToken], registry_trust_summary: trustedWorkerRegistrySummary, worker_id: "worker:test", now });
    expect(["block", "escalate"]).toContain(result.outcome);
    expect(["blocked", "waiting"]).toContain(result.updated_task_status_suggestion);
  });

  it("blocks tasks with untrusted registry summary", () => {
    const result = runGuardPreflight({
      task: untrustedRegistryBlockTask,
      capability_tokens: [trustedCapabilityToken],
      registry_trust_summary: { trusted: false, valid: false, trust_status: "untrusted", review_status: "rejected", errors: ["fixture untrusted registry"], revoked: false },
      worker_id: "worker:test",
      now
    });
    expect(result.outcome).toBe("block");
    expect(result.guard_decision.reason_codes).toContain("registry_invalid");
  });

  it("creates worker receipt events with required fields", () => {
    expect(workerReceiptEventFixture.event_id).toContain("worker-event:");
    expect(workerReceiptEventFixture.mission_id).toBe(normalMissionStepTask.mission_id);
    expect(workerReceiptEventFixture.artifact_refs[0]?.artifact_id).toBe(publicSafeArtifactFixture.artifact_id);
  });

  it("validates public-safe artifact references", () => {
    expect(publicSafeArtifactFixture.sensitivity).toBe("public");
    expect(publicSafeArtifactFixture.uri).toContain("test://");
  });

  it("keeps fixtures free of real secrets", () => {
    const fixtureText = JSON.stringify({ PUBLIC_WORKER_FLEET_FIXTURE_NOTICE, normalMissionStepTask, retryableFailureTask, nonRetryableFailureTask });
    expect(fixtureText).not.toMatch(secretLikeFixturePattern);
  });

  it("summarizes mission worker state", () => {
    const blocked = transitionTaskStatus(normalMissionStepTask, "blocked", fixtureNow, { blocked_reason: "guard_denied" });
    const summary = missionWorkerSummary([blocked, retryableFailureTask]);
    expect(summary.blockers.length).toBe(1);
    expect(failedRetryableTasks([retryableFailureTask]).length).toBe(1);
    expect(summary.failed_retryable_task_ids.length).toBe(1);
  });

  it("creates new idempotency records", () => {
    const record = createIdempotencyRecord(normalMissionStepTask, fixtureNow);
    expect(record.idempotency_key).toBe(normalMissionStepTask.idempotency_key);
  });
});
