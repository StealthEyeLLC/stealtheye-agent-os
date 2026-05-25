# StealthEye Agent OS

StealthEye Agent OS is the foundation for a high-autonomy agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, app-host surfaces, branch-safe CodeOps, CI Repair contracts, receipts, evals, Memory Graph context, and compliance-ready evidence.

## Current status

This repository is at **Build 12: Memory Graph Foundations**. Current foundation packages include Agent Registry, Guard, Mission OS, App Host, Worker Fleet, CodeOps, BrowserOps, Receipts + Replay, MCP Runtime, Repo Status, and Memory Graph.

This remains foundation work. It does not implement production app servers, production workers, live write paths, production deployment, durable memory storage, vector search, embeddings, private ingestion, or live memory service.

## Local verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check
```

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-sensitive project context.
- Read `docs/ARCHITECTURE.md`, `docs/MCP_RUNTIME.md`, `docs/RECEIPTS.md`, `docs/REPLAY.md`, `docs/MEMORY_GRAPH.md`, and `docs/SECURITY.md` before implementation work.

<!-- BEGIN BUILD 8 ADDITIVE UPDATE -->

## Build 8 additive update: BrowserOps and build automation

Build 8 adds `@stealtheye/browserops` as a fixture-only package for browser sessions, page observations, evidence references, action policies, action plans, Guard preflight, and Worker Fleet task templates. It also adds generated build-state checks under `docs/generated/`.

Additional verification for Build 8:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

<!-- END BUILD 8 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update: Receipts + Replay

Build 9 adds `@stealtheye/receipts-replay` as a foundation package for receipt events, evidence references, receipt bundles, deterministic mission timelines, descriptive replay packets, verification packets, final-report packets, and receipt-bundle integrity digests.

Additional verification for Build 9:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check
```

<!-- END BUILD 9 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update: live read-only repo/status tools

Build 11 adds `@stealtheye/repo-status` and integrates read-only repo/status tools into `@stealtheye/mcp-runtime`.

Additional verification for Build 11:

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
