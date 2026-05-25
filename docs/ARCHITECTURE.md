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
