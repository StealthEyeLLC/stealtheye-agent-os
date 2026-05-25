# AGENTS.md

## Purpose

Build StealthEye Agent OS: a high-autonomy, mission-scoped operating system for authorized online tasks, code operations, browser work, worker execution, signed manifests, Mission OS, app-host surfaces, Guard decisions, receipts, evals, and compliance-ready evidence.

## Build posture

This repo is public-visible but locked down. Work on feature branches and pull requests. Do not push directly to protected branches. Keep sensitive operational material and private infrastructure details out of public files.

## High-autonomy policy

Inside an approved mission envelope, proceed without repeated approval for ordinary delegated actions. Preserve durable evidence, use idempotent operations, and escalate only when a hard stop or unclear authority boundary is reached.

## Verification

Before final reporting, verify required files/changes exist, docs remain coherent, CI is truthful, and receipt/eval expectations were updated where applicable.

For package work, run or verify through CI:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Deeper docs

Read `docs/ARCHITECTURE.md`, `docs/AUTONOMY_MODEL.md`, `docs/CODEOPS.md`, `docs/CI_REPAIR.md`, `docs/WORKER_FLEET.md`, `docs/APP_HOST.md`, `docs/MISSION_OS.md`, `docs/AGENT_REGISTRY.md`, `docs/SECURITY.md`, `docs/WORKFLOWS.md`, `docs/EVALS.md`, `docs/RECEIPTS.md`, and `docs/BUILD_PROMPTS.md`.

<!-- BEGIN BUILD 8 ADDITIVE UPDATE -->

## Build 8 additive update

Build 8 adds `@stealtheye/browserops` and a minimal generated-state engine. BrowserOps is fixture-only and models browser sessions, page observations, evidence refs, action policies, action plans, Guard preflight, and Worker Fleet handoff templates.

Additional Build 8 CI check:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

<!-- END BUILD 8 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update

Build 9 adds `@stealtheye/receipts-replay` for public-safe receipt events, evidence references, receipt bundles, mission timeline assembly, replay packets, verification packets, final-report packets, and deterministic integrity digests.

Additional Build 9 CI check:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check
```

<!-- END BUILD 9 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update

Build 11 adds `@stealtheye/repo-status` for Guard-gated public GitHub repository/status observation and exposes read-only repo/status tools through `@stealtheye/mcp-runtime`.

Additional Build 11 CI check:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check
```

<!-- END BUILD 11 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 12 ADDITIVE UPDATE -->

## Build 12 additive update: Memory Graph Foundations

Build 12 adds `@stealtheye/memory-graph` as a fixture-only, deterministic, in-memory foundation for typed memory nodes, typed relationships, provenance/source refs, evidence and receipt refs, confidence, recency, retention hints, query helpers, compaction helpers, retention reports, and public-safe context summaries.

Build 12 also exposes MCP Runtime preview tools for `memory.graph.preview`, `memory.node.search.preview`, `memory.context.preview`, and `memory.retention.preview`. These tools are read-only, preview-only, fixture-only, non-destructive, no-storage, no-embeddings, and no-live-write.

The Build 12 phase spec sets `strictGeneratedSync: true`, and CI must run:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check
```

Build 12 remains fixture-only and in-memory. It does not add durable storage, vector search, embeddings, private ingestion, live memory service, live writes, or production changes.

Next target after Build 12: **Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts**.

<!-- END BUILD 12 ADDITIVE UPDATE -->
