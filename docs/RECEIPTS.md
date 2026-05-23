# Receipts

Receipts are the evidence ledger for autonomous work.

## Receipt schema concept

A receipt should include mission id, actor/agent identity, timestamp, authority reference, registry trust decision, signed manifest/card digest, tool/action type, inputs summary, outputs summary, artifacts, policy decisions, redactions, errors, and follow-up obligations.

## Mission timeline

The ledger should reconstruct mission planning, approvals, registry verification, manifest pinning, manifest diff review, tool calls, denied actions, diffs, logs, screenshots, artifacts, CI results, browser QA evidence, and final reports.

## Agent Registry evidence

Build 2 introduces evidence concepts for agent id, manifest id, key id, digest, signature validation result, trust status, review status, revocation status, and diff changes requiring review. Future receipt schemas should make those fields first-class.

## Replay model

Replay should answer what happened, why it was authorized, what was trusted, what changed, what evidence supports the result, what was denied, and what remains incomplete. Replay does not require exposing secrets or raw sensitive data.
