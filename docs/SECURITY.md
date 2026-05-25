# Security

Security is a first-class control layer, not a post-hoc review step.

## Hard stops

- deletion/destruction
- unmasked auth material
- money/refunds/purchases/billing/subscriptions
- production deployment or production-state mutation
- production-impacting DB migrations
- auth/security-critical changes
- direct protected branch mutation
- force push/history rewrite
- weakening CI/tests/security controls to pass
- material external sends as Jamie/company
- legal commitments/contracts
- platform-required confirmations

## Build security posture

Agent Registry verifies signed agent/tool metadata. Guard enforces authority boundaries and hard stops. Mission OS, App Host, Worker Fleet, CodeOps, BrowserOps, Receipts + Replay, MCP Runtime, Repo Status, and Memory Graph remain foundation-first and public-safe in this repo.

## Public/private boundary

Public repo files may contain architecture, public schemas, mock data, fixture contracts, generated build state, and governance docs. Private systems hold sensitive operational material and deployed runtime configuration.

## Security evidence

Receipts should capture denials, approvals, policy decisions, mission ids, authority envelopes, app-host previews, worker task events, idempotency records, CodeOps patch plans, verification plans, CI summaries, PR evidence, manifest identities, registry decisions, Guard decisions, policy checks, hard stops, tool calls, redactions, and final-report references.

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update: public repo/status read boundary

Build 11 adds `@stealtheye/repo-status` and MCP runtime repo/status tools for read-only public GitHub observation. The implementation uses deterministic read policy, Guard decisions, and public-safe receipt previews.

Allowed reads are public repository metadata, branch metadata, PR/issue metadata, workflow/check summaries, and public-safe file metadata/content. CI uses fixtures and mocked fetch.

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
