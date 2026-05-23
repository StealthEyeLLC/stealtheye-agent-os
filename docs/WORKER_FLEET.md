# Worker Fleet

Worker Fleet is the durable execution substrate for StealthEye Agent OS. Build 6 adds the package-level foundation only: typed schemas, deterministic helpers, fixtures, and eval-style tests for worker tasks, leases, idempotency, retry policy, status summaries, artifact references, receipt events, Guard preflight boundaries, and Mission OS plan handoff.

## Build 6 package

`packages/worker-fleet` provides:

- `WorkerTask` schemas for mission-step and system tasks;
- task statuses for queued, leased, running, waiting, blocked, completed, failed, retry scheduled, and canceled work;
- task types for mission steps, Guard preflight, registry checks, receipt writes, status updates, app-host previews, and future CodeOps/BrowserOps/CI Repair lanes;
- lease schemas and deterministic helpers for create, active/expired checks, heartbeat, release, complete, and stale/fenced update rejection;
- idempotency records, stable action fingerprints, duplicate detection, collision detection, and completed-result references;
- retry policy/state helpers for fixed, linear, and exponential backoff without live queues;
- task status transition validation, next-runnable detection, blocker summaries, mission worker summaries, and retryable-failure summaries;
- artifact reference schemas for worker outputs without storing real artifacts;
- worker receipt event schemas for replayable task lifecycle events;
- Guard preflight helper that evaluates requested actions before execution and returns a worker receipt event plus updated status suggestion;
- Mission OS helpers that convert plan steps into worker tasks while preserving mission, plan, step, dependencies, and requested-action templates.

## Execution boundary

Build 6 does not add a live Redis/BullMQ queue, production worker runtime, live tool execution, browser automation, repo mutation, production deployment, secret access, money movement, customer-data workflows, private infrastructure, cloud storage, or live queue credentials.

The package models the durable execution contract that future runtime workers will persist and enforce. It is safe foundation code, not an executor.

## Guard preflight rule

Any task type that carries action authority must pass Guard preflight before execution. The helper accepts a worker task, capability tokens, and registry trust summary, then calls Guard evaluation. Allowed decisions can move a task toward leased/running readiness. Deny decisions block the task. Escalate decisions mark the task as waiting or blocked for escalation. No helper executes the requested action.

## Mission OS handoff

Worker Fleet consumes Mission OS plans and converts each plan step into a worker task. It preserves:

- `mission_id`
- `plan_id`
- `step_id`
- title and description
- dependencies mapped to worker task ids
- requested-action templates where the plan step has an expected effect
- receipt refs and capability-token refs

This is a handoff contract, not a full Workflow Compiler or durable workflow runtime.

## Receipts and artifacts

Worker receipt events represent queue, lease, start, preflight, block, completion, failure, retry, cancel, artifact, and receipt lifecycle events. Artifact references include kind, URI, optional digest, summary, sensitivity classification, and retention hint. Build 6 records references only; it does not persist real artifact bytes.

## Evals

`packages/worker-fleet/test/worker-fleet.test.ts` covers normal mission-step tasks, Guard allow/block paths, untrusted registry blocking, retryable/non-retryable failures, stale lease rejection, idempotency duplicate/collision behavior, receipt events, artifact references, status transitions, dependencies, runnable detection, blocker summaries, and no-secret fixture checks.

These tests are initial eval-style fixtures. Future builds should promote them into a broader Worker Fleet eval suite once a live runtime and durable store exist.
