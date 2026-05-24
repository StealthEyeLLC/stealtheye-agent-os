# Workflows

## Build-loop protocol

Build work proceeds as focused branch-based missions. Each build updates implementation, docs, eval expectations, receipt expectations, and verification notes. The verifier checks against issue #1, merges accepted green PRs, updates issue #1, and provides the next build prompt.

## App Host preview flow

Build 5 App Host exposes safe preview-only flows for host health, mission validation/compile previews, Guard preview decisions, registry previews, and policy boundary summaries. These flows do not execute workers, mutate repositories, rerun CI, automate browsers, deploy, access secrets, move money, or touch customer data.

## Mission lifecycle

Build 4 Mission OS uses explicit lifecycle states: draft -> planned -> awaiting_authority -> authorized -> running -> blocked/completed/failed/canceled. Status helpers validate transitions, summarize blockers, identify next actions, and report completion readiness.

Mission Language encodes goal, authority, allowed effects, hard stops, targets, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

## Worker Fleet task handoff

Build 6 Worker Fleet consumes Mission OS plans and converts plan steps into worker task contracts. It preserves mission id, plan id, step id, title, description, dependencies, receipt refs, capability-token refs, and requested-action context. This handoff defines the shape future durable workers will persist; it does not execute the steps.

## CodeOps patch planning flow

Build 7 CodeOps introduces a foundation-only repository workflow:

1. Define a `RepoTarget` with base branch, working branch, allowed branch prefixes, protected branches, allowed/denied paths, required checks, authority refs, evidence requirements, and receipt requirements.
2. Build a structured patch plan with files to read, modify, create, and safely delete-or-deprecate.
3. Evaluate branch safety, path safety, destructive delete indicators, secret-bearing path indicators, CI/test/security weakening indicators, verification obligations, and a stable patch-plan fingerprint.
4. Convert safe plans into Guard requested actions and Worker Fleet task templates for future repo read, branch write, commit branch, open PR, CI read, failed-job rerun, and receipt-write work.
5. Stop at modeled preflight outcomes; no helper performs live GitHub mutation.

Protected branch mutation, force push/history rewrite, destructive delete, and CI/test/security weakening are denied or escalated by default.

## CI Repair loop

Build 7 CI Repair introduces a foundation-only repair workflow:

1. Capture a public-safe CI/check summary with short log excerpts and evidence refs.
2. Classify failure categories deterministically from fixture log snippets.
3. Generate a repair plan with suspected files, proposed patch plans, verification commands, rerun eligibility, non-retryable reasons, evidence refs, and receipt refs.
4. Allow rerun-only handling for flaky/infrastructure failures when evidence and receipts exist.
5. Require a patch before rerun for deterministic typecheck, test, lint, format, dependency, missing-file, secret-guard, or workflow-syntax failures.
6. Deny reruns when the repair weakens CI/tests/security, requires protected branch mutation, or lacks evidence/receipt refs.

Build 7 does not fetch live logs, rerun jobs, dispatch workflows, or patch branches automatically.

## Workflow blueprints

Blueprints define repeatable patterns such as repo feature missions, CI repair missions, browser QA missions, dependency updates, research dossiers, and support triage. Build 7 adds eval-style fixtures for safe branch-scoped patch plans, protected branch mutation attempts, force push/history rewrite attempts, destructive delete attempts, CI/test weakening attempts, CI failure logs, repair plans, rerun-only plans, and PR evidence packets.

## DAGs, retries, and idempotency

Compiled workflows should be DAGs with retry policies, idempotency keys, durable state transitions, and evidence emission at each node. Build 6 provides deterministic helpers for worker dependencies, backoff, retry exhaustion, stable action fingerprints, duplicate idempotency detection, collision detection, and completed-result references. Build 7 reuses Worker Fleet task templates for future CodeOps and CI Repair steps. Live queue scheduling and durable orchestration are still deferred.

## Background workers

Future workers will claim jobs, validate authority, execute allowed actions, emit receipts, refresh leases, and stop cleanly when authority expires or revocation occurs. Build 7 still does not add a live Redis/BullMQ runtime, production worker process, live GitHub writer, live CI rerunner, or BrowserOps runtime.

## Next build sequence

1. BrowserOps foundations.
2. Durable Mission OS storage and receipt ledger.
3. Workflow Compiler execution layer.
4. Live CodeOps/CI Repair adapters behind Guard and Worker Fleet.
5. Official MCP/App runtime integration.

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update: receipt and replay workflow

Build 9 adds a foundation-only evidence workflow:

1. Create public-safe receipt events from subsystem outputs.
2. Collect evidence refs and artifact refs without storing real artifact bytes.
3. Assemble a receipt bundle and compute a deterministic integrity digest.
4. Build a mission timeline sorted by timestamp and event id.
5. Create a replay packet that reconstructs the mission narrative without side effects.
6. Create a verification packet and final report packet for verifier handoff.

Build 9 does not add a durable receipt database, production ledger, live replay runner, live tool calls, browser execution, CodeOps mutation, CI reruns, or production artifact storage.

<!-- END BUILD 9 ADDITIVE UPDATE -->
