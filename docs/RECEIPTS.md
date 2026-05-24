# Receipts

Receipts are the evidence ledger for autonomous work.

## Receipt schema concept

A receipt should include mission id, actor/agent/worker identity, timestamp, authority reference, app-host preview reference, worker task reference, CodeOps patch plan reference, CI repair plan reference, lease reference, idempotency key, retry state, registry trust decision, signed manifest/card digest, Guard decision, requested action, mission status, plan step, inputs summary, outputs summary, artifacts, policy decisions, redactions, errors, and follow-up obligations.

## Mission timeline

The ledger should reconstruct mission planning, approvals, authority-envelope creation, app-host previews, Mission OS plan creation, Worker Fleet task queue/lease/start/preflight/block/retry/complete events, CodeOps patch-plan creation, file-change contract review, verification-plan obligations, CI log/check summaries, CI repair plans, PR evidence packets, registry verification, manifest pinning, manifest diff review, Guard decisions, tool calls, denied actions, diffs, logs, screenshots, artifacts, CI results, browser QA evidence, and final reports.

## App Host evidence

Build 5 introduces preview-only app-host outputs for health, capabilities, Mission OS previews, Guard decisions/receipts, Registry validation/trust/diff previews, and policy summaries. These are receipt-friendly preview artifacts only. They are not durable ledger records and do not execute live actions.

## Worker Fleet evidence

Build 6 introduces worker receipt event shapes in `@stealtheye/worker-fleet`. A worker receipt event captures event id, mission id, task id, worker id, event type, status before/after, Guard decision ref, idempotency key, lease id, artifact refs, timestamp, evidence refs, and summary.

Worker event types cover task queued, task leased, task started, Guard preflight checked, task blocked, task completed, task failed, retry scheduled, task canceled, artifact recorded, and receipt recorded. Build 6 also defines artifact references for worker outputs and idempotency records for duplicate/collision handling. These remain package-level receipt expectations, not a durable production ledger.

## CodeOps evidence

Build 7 introduces CodeOps receipt expectations in `@stealtheye/codeops`:

- repository targets with branch/path policy, authority refs, evidence requirements, and receipt requirements;
- patch plans with mission/task refs, expected effects, risk tier, rollback notes, verification plan, evidence refs, receipt refs, and status;
- file-change contracts with operation, before/after digest refs, summaries, risk indicators, evidence refs, and receipt refs;
- stable patch-plan fingerprints for replayable comparison;
- PR evidence packets capturing branch, checks, files, receipts, and verification obligations.

These are foundation contracts only. Build 7 does not create branches, write commits, open PRs, mutate protected branches, force push, or call live GitHub APIs.

## CI Repair evidence

Build 7 introduces CI Repair receipt expectations:

- CI/check summaries with provider, workflow, run id, job id, check name, status, conclusion, failed step, short public-safe excerpts, detected failure categories, evidence refs, and fetch time;
- repair plans with CI summary refs, failure categories, suspected files, proposed patch plans, verification commands, rerun eligibility, non-retryable reasons, risk tier, status, evidence refs, and receipt refs;
- rerun policy decisions that distinguish rerun-only flaky/infrastructure cases from deterministic failures requiring a patch first.

Build 7 does not fetch live logs, rerun jobs, dispatch workflows, or weaken CI/tests/security.

## Mission OS evidence

Build 4 introduces mission-level reference shapes for Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. Build 6 preserves mission, plan, and step identity when converting Mission OS plan steps into Worker Fleet tasks. Build 7 preserves mission and task identity in CodeOps patch plans and CI repair plans.

## Agent Registry evidence

Build 2 introduces evidence concepts for agent id, manifest id, key id, digest, signature validation result, trust status, review status, revocation status, and diff changes requiring review. Future receipt schemas should make those fields first-class.

## Guard decision receipts

Build 3 introduces the Guard decision receipt shape in `@stealtheye/guard`. A Guard receipt captures decision id, mission id, action id, actor id, requested effect, target summary, capability token ids considered and matched, policy checks, hard stops matched, registry trust summary, decision result, reason codes, timestamp, and evidence refs. Build 5 can preview this shape through `guard.receipt.preview` without writing a ledger. Build 6 Worker Fleet records Guard decision refs and preflight receipt events before any future task executor runs. Build 7 CodeOps produces Guard requested actions and preflight summaries for future repo/CI operations without executing them.

## Replay model

Replay should answer what happened, why it was authorized, what mission/plan/status applied, which worker task and lease applied, what app-host preview was shown, what patch plan was proposed, whether branch/path policy allowed it, what changed, what verification was required, what CI failure was classified, whether repair required a patch or rerun-only path, what PR evidence exists, what was trusted, what Guard preflight decided, what evidence supports the result, what was denied or escalated, what was retried or deduplicated, and what remains incomplete. Replay does not require exposing secrets or raw sensitive data.

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update: receipt bundle and replay foundations

Build 9 adds `@stealtheye/receipts-replay`, which turns the receipt expectations in this document into typed foundation contracts. It models receipt events for Mission OS, Agent Registry, Guard, Worker Fleet, App Host, CodeOps, CI Repair, BrowserOps, Build Automation, and future workflow/tool/domain systems.

Build 9 evidence refs are reference-only and public-safe. They use fixture/generated URI schemes and do not include real logs, screenshots, DOM, customer data, secrets, private endpoints, production incidents, or production artifacts.

Build 9 replay packets are descriptive. They preserve event order, index public-safe evidence refs, identify omitted sensitive refs, and explicitly mark replay steps as side-effect-free.

<!-- END BUILD 9 ADDITIVE UPDATE -->
