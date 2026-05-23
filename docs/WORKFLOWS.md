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

## Workflow blueprints

Blueprints define repeatable patterns such as repo feature missions, CI repair missions, browser QA missions, dependency updates, research dossiers, and support triage. Build 4 includes public-safe fixtures for repo feature, CI repair, browser QA, production-deploy hard stop, money-movement hard stop, invalid target constraints, and missing verification plan scenarios. Build 5 adds app-host eval-style fixtures for mission compile preview, invalid mission rejection, safe Guard preview allow, hard-stop Guard preview escalation/denial, trusted registry preview, risky manifest diff preview, policy boundary summary, and no live write tool exposure.

## DAGs, retries, and idempotency

Compiled workflows should be DAGs with retry policies, idempotency keys, durable state transitions, and evidence emission at each node. Build 4 provides lightweight plan-step structures with dependencies and expected effects only. Build 5 provides app-host preview handlers only. It does not implement Worker Fleet execution, queues, leases, retries, or durable orchestration.

## Background workers

Workers claim jobs, validate authority, execute allowed actions, emit receipts, refresh leases, and stop cleanly when authority expires or revocation occurs. Worker Fleet remains deferred.

## Next build sequence

1. Worker Fleet foundations.
2. Durable Mission OS storage and receipt ledger.
3. Workflow Compiler execution layer.
4. BrowserOps and CodeOps runtime integration.
5. Official MCP/App runtime integration.
