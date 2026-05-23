# AGENTS.md

## Purpose

Build StealthEye Agent OS: a high-autonomy, mission-scoped operating system for authorized online tasks, code operations, browser work, worker execution, signed manifests, Mission OS, Guard decisions, receipts, evals, and compliance-ready evidence.

## Build posture

This repo is public-visible but locked down. Work on feature branches and pull requests. Do not push directly to protected branches. Do not add secrets, private endpoints, production credentials, customer data, internal OAuth clients, cloud/account details, or sensitive operational runbooks.

## High-autonomy policy

Inside an approved mission envelope, proceed without repeated approval for ordinary delegated actions. Preserve durable evidence, use idempotent operations, and escalate only when a hard stop or unclear authority boundary is reached.

Build 4 adds `@stealtheye/mission-os` as the foundation for converting broad goals into typed Mission Language, normalized missions, authority envelopes, plans, status summaries, receipt references, and Guard-compatible action templates. Mission OS is package-level foundation only; it is not a production app server, live worker fleet, secret store, deployment automation, billing automation, or durable ledger.

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

Hard-stop actions must result in deny or escalation. Mission OS may model hard-stop missions for evals, but it must not enable real execution of those actions.

## Verification

Before final reporting, verify required files/changes exist, no secrets were introduced, docs remain coherent, CI is truthful, and receipt/eval expectations were updated where applicable.

For package work, run or verify through CI:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Docs, evals, and receipts

Update relevant docs with behavior changes. Add or update eval expectations when a failure mode or safety condition is discovered. Ensure receipts can capture mission timeline, mission status, authority envelopes, tool calls, approvals, denied actions, diffs, logs, artifacts, screenshots, CI, browser QA, manifest digests, registry decisions, Guard decisions, policy checks, hard stops, and final reports.

## Deeper docs

Read `docs/ARCHITECTURE.md`, `docs/AUTONOMY_MODEL.md`, `docs/MISSION_OS.md`, `docs/AGENT_REGISTRY.md`, `docs/SECURITY.md`, `docs/WORKFLOWS.md`, `docs/EVALS.md`, `docs/RECEIPTS.md`, and `docs/BUILD_PROMPTS.md`.
