# Workflows

## Build-loop protocol

Build work proceeds as focused branch-based missions. Each build updates implementation, docs, eval expectations, receipt expectations, and verification notes. The verifier checks against issue #1 and provides the next build prompt.

## App Host preview flow

Build 5 App Host exposes safe preview-only flows:

1. Host reports health and safe capabilities.
2. Mission tools validate or compile fixture/provided Mission Language.
3. Mission preview tools show authority envelopes, plans, status snapshots, receipt expectations, and requested-action templates.
4. Guard preview tools evaluate fixture requested actions and produce receipt-friendly preview records.
5. Registry preview tools validate fixture/payload shapes, preview risky manifest diffs, and return fixture-backed trust decisions.
6. Policy tools summarize hard stops and autonomy boundaries.

None of these flows execute workers, mutate repositories, rerun CI, automate browsers, deploy, access secrets, move money, or touch customer data.

## Mission lifecycle

Build 4 Mission OS uses explicit lifecycle states: draft -> planned -> awaiting_authority -> authorized -> running -> blocked/completed/failed/canceled. Status helpers validate transitions, summarize blockers, identify next actions, and report completion readiness.

## StealthEye Mission Language

Mission Language encodes goal, authority, allowed effects, hard stops, targets, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

Mission OS compiles Mission Language into normalized missions, authority envelopes, plan/DAG structures, status snapshots, receipt expectations, capability-token-compatible templates, and Guard requested-action templates.

## Worker Fleet task handoff

Build 6 Worker Fleet consumes Mission OS plans and converts plan steps into worker task contracts. It preserves mission id, plan id, step id, title, description, dependencies, receipt refs, capability-token refs, and requested-action context. This handoff defines the shape future durable workers will persist; it does not execute the steps.

## Workflow blueprints

Blueprints define repeatable patterns such as repo feature missions, CI repair missions, browser QA missions, dependency updates, research dossiers, and support triage. Build 4 includes public-safe fixtures for repo feature, CI repair, browser QA, production-deploy hard stop, money-movement hard stop, invalid target constraints, and missing verification plan scenarios. Build 5 adds app-host eval-style fixtures for mission compile preview, invalid mission rejection, safe Guard preview allow, hard-stop Guard preview escalation/denial, trusted registry preview, risky manifest diff preview, policy boundary summary, and no live write tool exposure. Build 6 adds Worker Fleet eval-style fixtures for task validation, plan-step conversion, leases, idempotency, retries, status transitions, Guard preflight, untrusted registry blocking, artifact refs, receipt events, and no-secret fixture checks.

## DAGs, retries, and idempotency

Compiled workflows should be DAGs with retry policies, idempotency keys, durable state transitions, and evidence emission at each node. Build 6 provides deterministic helpers for worker task dependencies, fixed/linear/exponential backoff, retry exhaustion, stable action fingerprints, duplicate idempotency detection, collision detection, and completed-result references. Live queue scheduling and durable orchestration are still deferred.

## Background workers

Future workers will claim jobs, validate authority, execute allowed actions, emit receipts, refresh leases, and stop cleanly when authority expires or revocation occurs. Build 6 defines the package-level contracts for task leases, fencing tokens, Guard preflight, status updates, artifacts, and receipts, but does not add a live Redis/BullMQ runtime or production worker process.

## Next build sequence

1. CodeOps + CI Repair foundations.
2. Durable Mission OS storage and receipt ledger.
3. Workflow Compiler execution layer.
4. BrowserOps runtime integration.
5. Official MCP/App runtime integration.
