# Build 12 acceptance checklist: Memory Graph Foundations

## Package foundation

- Memory Graph schemas/helpers/fixtures/tests exist.
- Runtime Memory Graph preview tools are read-only preview-only fixture-only.
- Build 12 strict generated sync is enabled.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- Fixture-only and in-memory.
- No production database, vector DB, embeddings, cloud storage, private/customer data ingestion, durable personal memory, live memory service, or secret storage.
- Retention and compaction helpers report/model only and delete nothing.

## Next target

- Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
