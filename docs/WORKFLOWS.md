# Workflows

## Build-loop protocol

Build work proceeds as focused branch-based missions. Each build updates implementation, docs, eval expectations, receipt expectations, and verification notes. The verifier checks against issue #1 and provides the next build prompt.

## Mission lifecycle

Planned -> Approved -> Executing -> Branch Created -> Patch Applied -> PR Opened -> CI Pending -> CI Failed/Green -> Repair Planned/Applied -> QA Complete -> Final Reported -> Closed/Blocked.

## Future StealthEye Mission Language

A mission language should encode goal, authority, allowed effects, forbidden effects, targets, workflow graph, evals, receipt requirements, and escalation rules.

## Workflow blueprints

Blueprints define repeatable patterns such as docs scaffold, code feature, CI repair, browser QA, dependency update, research dossier, and support triage.

## DAGs, retries, and idempotency

Compiled workflows should be DAGs with retry policies, idempotency keys, durable state transitions, and evidence emission at each node.

## Background workers

Workers claim jobs, validate authority, execute allowed actions, emit receipts, refresh leases, and stop cleanly when authority expires or revocation occurs.

## Next build sequence

1. Agent Registry + Signed Manifests.
2. Authority and capability-token schemas.
3. Receipt schema and evidence ledger.
4. Minimal Worker Fleet with idempotent execution.
5. Mission OS API/app scaffold.
