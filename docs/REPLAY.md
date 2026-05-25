# Replay

Replay is the descriptive evidence reconstruction layer for StealthEye Agent OS. Build 9 implements replay foundations only: typed receipt events, evidence references, receipt bundles, mission timelines, replay packets, verification packets, final report packets, and deterministic helpers.

## Build 9 scope

`@stealtheye/receipts-replay` provides schemas and deterministic helpers for:

- receipt events across Mission OS, Agent Registry, Guard, Worker Fleet, App Host, CodeOps, CI Repair, BrowserOps, Build Automation, and future workflow/tool/domain systems;
- public-safe evidence references for JSON documents, summaries, manifest digests, Guard decisions, Worker Fleet events, CodeOps patch plans, CI excerpts, PR evidence, BrowserOps references, generated state, final reports, and artifact digests;
- receipt bundles with subsystem refs and integrity digests;
- mission timeline assembly from receipt events;
- replay packets that preserve event order and index public-safe evidence refs;
- verification packets and final report packets.

## Replay boundary

Replay is descriptive only. It must not execute tools, mutate state, call APIs, run browser actions, rerun CI, dispatch workflows, access secrets, use credentials, reach production systems, move money, send external messages, or operate on customer data.

## Evidence boundary

Evidence refs are references only. Build 9 does not store real logs, real screenshots, real DOM snapshots, HARs, traces, videos, customer data, secrets, production incidents, private endpoints, or production artifacts.

## Deferred work

Durable receipt storage, production ledger APIs, artifact retention workflows, replay UI, signed receipts, provenance, and Memory Graph integration are deferred. Next target: Build 10 — Memory Graph.

<!-- BEGIN BUILD 12 ADDITIVE UPDATE -->

## Build 12 additive update: Memory Graph Foundations

Build 12 adds `@stealtheye/memory-graph` as a fixture-only, deterministic, in-memory foundation for typed memory nodes, typed relationships, provenance/source refs, evidence and receipt refs, confidence, recency, retention hints, query helpers, compaction helpers, retention reports, and public-safe context summaries.

Build 12 also exposes MCP Runtime preview tools for `memory.graph.preview`, `memory.node.search.preview`, `memory.context.preview`, and `memory.retention.preview`. These tools are read-only, preview-only, fixture-only, non-destructive, no-storage, no-embeddings, and no-live-write.

The Build 12 phase spec sets `strictGeneratedSync: true`, and CI must run:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check
```

Build 12 does not add a production database, vector database, embeddings provider, cloud storage, private knowledge ingestion, durable personal memory, live memory service, live writes, production mutation, or secret storage.

Next target after Build 12: **Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts**.

<!-- END BUILD 12 ADDITIVE UPDATE -->
