# ADR 0014: Memory Graph Foundation

## Status

Accepted for Build 12.

## Decision

Add `@stealtheye/memory-graph` as a fixture-only in-memory schema/helper foundation. Add fixture-only MCP runtime preview tools. Set `strictGeneratedSync: true` for Build 12 so generated/synced output drift fails CI.

## Boundaries

No production database, vector DB, embeddings, cloud storage, private/customer data ingestion, durable personal memory, live memory service, live writes, deployment, or secret storage.

## Next

Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
