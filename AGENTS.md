# AGENTS.md

## Purpose

Build StealthEye Agent OS: a high-autonomy, mission-scoped operating system for authorized online tasks, code operations, browser work, worker execution, signed manifests, receipts, evals, and compliance-ready evidence.

## Build posture

This repo is public-visible but locked down. Work on feature branches and pull requests. Do not push directly to protected branches. Do not add secrets, private endpoints, production credentials, customer data, internal OAuth clients, cloud/account details, or sensitive operational runbooks.

## High-autonomy policy

Inside an approved mission envelope, proceed without repeated approval for ordinary delegated actions. Preserve durable evidence, use idempotent operations, and escalate only when a hard stop or unclear authority boundary is reached.

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

## Verification

Before final reporting, verify required files/changes exist, no secrets were introduced, docs remain coherent, CI is truthful, and receipt/eval expectations were updated where applicable.

For package work, run or verify:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Docs, evals, and receipts

Update relevant docs with behavior changes. Add or update eval expectations when a failure mode or safety condition is discovered. Ensure receipts can capture mission timeline, tool calls, approvals, denied actions, diffs, logs, artifacts, screenshots, CI, browser QA, manifest digests, registry decisions, and final reports.

## Deeper docs

Read `docs/ARCHITECTURE.md`, `docs/AUTONOMY_MODEL.md`, `docs/AGENT_REGISTRY.md`, `docs/SECURITY.md`, `docs/WORKFLOWS.md`, `docs/EVALS.md`, `docs/RECEIPTS.md`, and `docs/BUILD_PROMPTS.md`.
