# Receipts

Receipts are the evidence ledger for autonomous work.

## Receipt schema concept

A receipt should include mission id, actor identity, timestamp, authority reference, app-host preview reference, worker task reference, CodeOps patch plan reference, CI repair plan reference, lease reference, idempotency key, retry state, registry trust decision, manifest/card digest, Guard decision, requested action, mission status, plan step, input summary, output summary, artifacts, policy decisions, redactions, errors, and follow-up obligations.

## Mission timeline

The ledger should reconstruct mission planning, approvals, authority-envelope creation, app-host previews, Mission OS plan creation, Worker Fleet task events, CodeOps patch-plan creation, file-change contract review, verification-plan obligations, CI summaries, CI repair plans, PR evidence packets, registry verification, manifest pinning, Guard decisions, tool calls, denied actions, diffs, logs, artifacts, CI results, browser QA evidence, and final reports.

## Build evidence layers

- Build 5 introduces preview-only App Host outputs.
- Build 6 introduces Worker Fleet receipt event shapes.
- Build 7 introduces CodeOps and CI Repair receipt expectations.
- Build 9 introduces receipt bundles and replay packets.
- Build 11 introduces repo/status read receipt previews.

## Replay model

Replay should answer what happened, why it was authorized, what mission/plan/status applied, what evidence supports the result, what was denied or escalated, what was retried or deduplicated, and what remains incomplete.

<!-- BEGIN BUILD 9 ADDITIVE UPDATE -->

## Build 9 additive update: receipt bundle and replay foundations

Build 9 adds `@stealtheye/receipts-replay`, which turns receipt expectations into typed foundation contracts. It models receipt events for Mission OS, Agent Registry, Guard, Worker Fleet, App Host, CodeOps, CI Repair, BrowserOps, Build Automation, and future workflow/tool/domain systems.

Build 9 evidence refs are reference-only and public-safe. Build 9 replay packets are descriptive, preserve event order, index public-safe evidence refs, identify omitted sensitive refs, and explicitly mark replay steps as side-effect-free.

<!-- END BUILD 9 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update: repo/status read receipts

Build 11 adds public-safe receipt previews for repo/status reads. Each read result includes the tool name, target repository, applicable ref/PR/issue/check/file target, timestamp, Guard decision or read-policy reference, public-safe input summary, public-safe output summary, and a no-write/no-side-effect statement.

Repo/status receipt previews cover repository metadata, branch reads, PR reads/lists, issue reads/lists, workflow/check status reads, public-safe file metadata/content reads, and repository status summaries. Build 11 returns these receipts with tool results only and does not add a durable receipt ledger.

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
