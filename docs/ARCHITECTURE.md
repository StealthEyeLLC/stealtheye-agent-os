# Architecture

StealthEye Agent OS is organized as mission, control, tool, worker, evidence, memory, and governance layers.

## Core components

- App Host: MCP-style preview surfaces.
- Mission OS: mission intake, planning, status, and authority envelopes.
- Agent Registry: signed agent/tool metadata and trust records.
- Guard: policy decisions and hard-stop enforcement.
- Worker Fleet: task, lease, retry, idempotency, artifact, and receipt contracts.
- CodeOps and CI Repair: branch-safe code-operation and CI-repair contracts.
- BrowserOps: fixture browser planning and observation contracts.
- Receipts + Replay: public-safe evidence reconstruction.
- MCP Runtime and Repo Status: safe runtime previews and public repo/status observation.
- Memory Graph: durable-knowledge model foundations.

## Control flow

Mission request -> App Host preview -> Mission OS compiler -> authority envelope -> Worker Fleet contract -> Guard preflight -> future runtime executors -> receipts/artifacts -> Memory Graph context packets -> eval and final report.

<!-- BEGIN BUILD 8 ADDITIVE UPDATE -->

## Build 8 additive update: fixture-only BrowserOps and generated build state

Build 8 implements the BrowserOps foundation as contracts and deterministic helpers only. `@stealtheye/browserops` models browser sessions, page observations, browser evidence refs, action categories/kinds, action plans, Guard requested-action conversion, Guard preflight summaries, and Worker Fleet `future_browserops` task templates.

The next architecture target is **Build 9 — Receipts + Replay**.

<!-- END BUILD 8 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update: receipts, replay, and final reports

Build 9 implements `@stealtheye/receipts-replay` as the foundation evidence layer. It adds typed receipt events, evidence refs, receipt bundles, deterministic mission timeline assembly, side-effect-free replay packets, verification packets, final-report packets, subsystem adapters, and receipt-bundle integrity digests.

The next architecture target is **Build 10 — Memory Graph**.

<!-- END BUILD 9 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update: repo/status observation layer

Build 11 adds `@stealtheye/repo-status` as a bounded observation layer for public GitHub repository/status reads. It adds schemas, read-only policy, Guard adapter integration, public-safe receipt previews, a fixture client, and public read-only runtime tools.

The MCP runtime now includes repo/status read-only tools next to the existing App Host preview surface.

The next architecture target is **Build 12 — Memory Graph**.

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
