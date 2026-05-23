# Receipts

Receipts are the evidence ledger for autonomous work.

## Receipt schema concept

A receipt should include mission id, actor/agent/worker identity, timestamp, authority reference, app-host preview reference, worker task reference, lease reference, idempotency key, retry state, registry trust decision, signed manifest/card digest, Guard decision, requested action, mission status, plan step, inputs summary, outputs summary, artifacts, policy decisions, redactions, errors, and follow-up obligations.

## Mission timeline

The ledger should reconstruct mission planning, approvals, authority-envelope creation, app-host previews, Mission OS plan creation, Worker Fleet task queue/lease/start/preflight/block/retry/complete events, registry verification, manifest pinning, manifest diff review, Guard decisions, tool calls, denied actions, diffs, logs, screenshots, artifacts, CI results, browser QA evidence, and final reports.

## App Host evidence

Build 5 introduces preview-only app-host outputs for health, capabilities, Mission OS previews, Guard decisions/receipts, Registry validation/trust/diff previews, and policy summaries. These are receipt-friendly preview artifacts only. They are not durable ledger records and do not execute live actions.

## Worker Fleet evidence

Build 6 introduces worker receipt event shapes in `@stealtheye/worker-fleet`. A worker receipt event captures event id, mission id, task id, worker id, event type, status before/after, Guard decision ref, idempotency key, lease id, artifact refs, timestamp, evidence refs, and summary.

Worker event types cover task queued, task leased, task started, Guard preflight checked, task blocked, task completed, task failed, retry scheduled, task canceled, artifact recorded, and receipt recorded. Build 6 also defines artifact references for worker outputs and idempotency records for duplicate/collision handling. These remain package-level receipt expectations, not a durable production ledger.

## Mission OS evidence

Build 4 introduces mission-level reference shapes for Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. Build 6 preserves mission, plan, and step identity when converting Mission OS plan steps into Worker Fleet tasks.

## Agent Registry evidence

Build 2 introduces evidence concepts for agent id, manifest id, key id, digest, signature validation result, trust status, review status, revocation status, and diff changes requiring review. Future receipt schemas should make those fields first-class.

## Guard decision receipts

Build 3 introduces the Guard decision receipt shape in `@stealtheye/guard`. A Guard receipt captures decision id, mission id, action id, actor id, requested effect, target summary, capability token ids considered and matched, policy checks, hard stops matched, registry trust summary, decision result, reason codes, timestamp, and evidence refs. Build 5 can preview this shape through `guard.receipt.preview` without writing a ledger. Build 6 Worker Fleet records Guard decision refs and preflight receipt events before any future task executor runs.

## Replay model

Replay should answer what happened, why it was authorized, what mission/plan/status applied, which worker task and lease applied, what app-host preview was shown, what was trusted, what Guard preflight decided, what changed, what evidence supports the result, what was denied or escalated, what was retried or deduplicated, and what remains incomplete. Replay does not require exposing secrets or raw sensitive data.
