# ADR 0014: Memory Graph Foundation

## Status

Accepted for Build 12.

## Decision

Add `@stealtheye/memory-graph` as a fixture-only in-memory package and add MCP runtime preview tools that read from fixtures only.

The package defines typed memory node schemas, typed memory edge schemas, source refs, evidence refs, receipt refs, confidence and retention fields, query helpers, compaction helpers, retention helpers, repo-status fixture conversion helpers, generated build-state fixture conversion, and receipt previews.

## Boundaries

Build 12 has no production database, vector database, embeddings provider, cloud storage, durable personal memory, live memory service, production mutation, live writes, private ingestion, or secret storage.

## Next

Build 13 should implement Live CodeOps Branch-Write Path through Guard + Receipts.
