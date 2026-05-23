# Receipts

Receipts are the evidence ledger for autonomous work.

## Receipt schema concept

A receipt should include mission id, actor/agent identity, timestamp, authority reference, app-host preview reference, registry trust decision, signed manifest/card digest, Guard decision, requested action, mission status, plan step, inputs summary, outputs summary, artifacts, policy decisions, redactions, errors, and follow-up obligations.

## Mission timeline

The ledger should reconstruct mission planning, approvals, authority-envelope creation, app-host previews, registry verification, manifest pinning, manifest diff review, Guard decisions, tool calls, denied actions, diffs, logs, screenshots, artifacts, CI results, browser QA evidence, and final reports.

## App Host evidence

Build 5 introduces preview-only app-host outputs for health, capabilities, Mission OS previews, Guard decisions/receipts, Registry validation/trust/diff previews, and policy summaries. These are receipt-friendly preview artifacts only. They are not durable ledger records and do not execute live actions.

## Mission OS evidence

Build 4 introduces mission-level reference shapes for Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. These are references for future ledger storage, not the full durable receipt ledger.

## Agent Registry evidence

Build 2 introduces evidence concepts for agent id, manifest id, key id, digest, signature validation result, trust status, review status, revocation status, and diff changes requiring review. Future receipt schemas should make those fields first-class.

## Guard decision receipts

Build 3 introduces the Guard decision receipt shape in `@stealtheye/guard`. A Guard receipt captures decision id, mission id, action id, actor id, requested effect, target summary, capability token ids considered and matched, policy checks, hard stops matched, registry trust summary, decision result, reason codes, timestamp, and evidence refs. Build 5 can preview this shape through `guard.receipt.preview` without writing a ledger.

## Replay model

Replay should answer what happened, why it was authorized, what mission/plan/status applied, what app-host preview was shown, what was trusted, what changed, what evidence supports the result, what was denied or escalated, and what remains incomplete. Replay does not require exposing secrets or raw sensitive data.
