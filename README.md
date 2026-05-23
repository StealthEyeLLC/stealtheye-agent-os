# StealthEye Agent OS

StealthEye Agent OS is the public-safe foundation for mission-scoped autonomous online work: signed manifests, Guard policy gates, Worker Fleet task contracts, CodeOps/CI Repair contracts, fixture-only BrowserOps contracts, generated build state, receipts, evals, and compliance-ready evidence.

## Current status

Current build: **Build 8 — BrowserOps Foundations + Minimal Build Automation Engine**.

Foundation packages:

- `@stealtheye/agent-registry`: signed agent/tool manifest primitives.
- `@stealtheye/guard`: capability tokens, requested actions, hard stops, policy decisions, and receipts.
- `@stealtheye/mission-os`: Mission Language, normalized missions, authority envelopes, plans, status, and receipt refs.
- `@stealtheye/app-host`: fixture-backed ChatGPT App / MCP host descriptors and preview-only tools.
- `@stealtheye/worker-fleet`: worker task, lease, idempotency, retry, artifact, receipt event, and preflight contracts.
- `@stealtheye/codeops`: repository and CI-repair contracts, patch plans, verification plans, repair plans, and PR evidence.
- `@stealtheye/browserops`: fixture-only browser sessions, page observations, evidence refs, action policies, action plans, Guard preflight, and Worker Fleet task templates.

Build 8 also adds `scripts/stealtheye-build.mjs` and `scripts/phases/build-008-browserops.mjs` to generate/check public-safe state under `docs/generated/`.

## Boundary

This repo does not implement production app servers, production workers, persistent data stores, queue infrastructure, deployment automation, customer-data workflows, real credential handling, live repo mutation, live CI reruns, live browser automation, Playwright runtime execution, credentialed browsing, material external sends, purchases/payments, destructive browser actions, production browser mutation, or private infrastructure.

Public repo content may include architecture docs, public specs, non-secret schemas, fixture metadata, generated state, eval templates, governance docs, app-host preview descriptors, Worker Fleet contracts, CodeOps/CI Repair contracts, BrowserOps contracts, and compliance planning.

## Verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

CI is the verification authority when local commands cannot be run.

## Build automation

Regenerate Build 8 generated state:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs
```

Check generated files exist and scan generated state plus BrowserOps fixtures:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

## Next target

Build 9 — Receipts + Replay.
