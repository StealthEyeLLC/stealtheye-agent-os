# AGENTS.md

## Purpose

Build StealthEye Agent OS: a high-autonomy, mission-scoped operating system for authorized online tasks, code operations, browser work, worker execution, signed manifests, Mission OS, app-host surfaces, Guard decisions, receipts, evals, and compliance-ready evidence.

## Build posture

This repo is public-visible but locked down. Work on feature branches and pull requests. Do not push directly to protected branches. Do not add secrets, private endpoints, production credentials, customer data, internal OAuth clients, cloud/account details, production tokens, live deployment targets, live write APIs, live queue credentials, or sensitive operational runbooks.

## High-autonomy policy

Inside an approved mission envelope, proceed without repeated approval for ordinary delegated actions. Preserve durable evidence, use idempotent operations, and escalate only when a hard stop or unclear authority boundary is reached.

Build 7 adds `@stealtheye/codeops` as the CodeOps + CI Repair foundation. It defines typed repository targets, branch/path safety helpers, patch plans, file-change contracts, verification obligations, CI log classification, repair plans, rerun eligibility, PR evidence, and Guard/Worker Fleet preflight adapters. It is not a live GitHub client, branch creator, commit writer, PR creator, CI rerunner, protected-branch writer, browser automation layer, secret store, deployment automation, billing automation, customer-data workflow, or production runtime.

## Hard stops

- deletion/destruction
- raw secrets/credentials
- money/refunds/purchases/billing/subscriptions
- production deployment or production data mutation
- production-impacting DB migrations
- auth/security-critical changes
- direct protected branch mutation
- force push/history rewrite
- weakening CI/tests/security controls to pass
- material external sends as Jamie/company
- legal commitments/contracts
- platform/OpenAI-required confirmations

Hard-stop actions must result in deny or escalation. CodeOps and CI Repair may model patch plans, requested actions, worker tasks, and Guard preflight outcomes for evals, but they must not execute live actions or bypass Guard.

## Verification

Before final reporting, verify required files/changes exist, no secrets were introduced, docs remain coherent, CI is truthful, and receipt/eval expectations were updated where applicable.

For package work, run or verify through CI:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Docs, evals, and receipts

Update relevant docs with behavior changes. Add or update eval expectations when a failure mode or safety condition is discovered. Ensure receipts can capture mission timeline, mission status, authority envelopes, app-host tool previews, worker task lifecycle, leases, retries, idempotency records, CodeOps patch plans, file-change contracts, verification plans, CI summaries, repair plans, PR evidence, tool calls, approvals, denied actions, diffs, logs, artifacts, screenshots, CI, browser QA, manifest digests, registry decisions, Guard decisions, policy checks, hard stops, and final reports.

## Deeper docs

Read `docs/ARCHITECTURE.md`, `docs/AUTONOMY_MODEL.md`, `docs/CODEOPS.md`, `docs/CI_REPAIR.md`, `docs/WORKER_FLEET.md`, `docs/APP_HOST.md`, `docs/MISSION_OS.md`, `docs/AGENT_REGISTRY.md`, `docs/SECURITY.md`, `docs/WORKFLOWS.md`, `docs/EVALS.md`, `docs/RECEIPTS.md`, and `docs/BUILD_PROMPTS.md`.
