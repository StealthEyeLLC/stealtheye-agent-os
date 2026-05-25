# Build 12 acceptance checklist: Memory Graph Foundations

## Package foundation

- Memory Graph schemas, helpers, fixtures, and tests exist.
- Runtime exposes fixture-only memory preview tools.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No production database, vector database, embeddings provider, cloud storage, durable memory, live memory service, production mutation, live writes, private ingestion, or secret storage is added.
- Runtime memory tools are read-only, preview-only, fixture-only, non-destructive, side-effect-free, and live-write disabled.
- Retention helpers report only and never delete records.

## Next target

- Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
