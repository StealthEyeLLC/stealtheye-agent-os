# Build 12 handoff: Memory Graph Foundations

Build 12 adds Memory Graph foundations and strict generated sync.

## New package

`@stealtheye/memory-graph` defines fixture-only, deterministic, in-memory Memory Graph schemas, helpers, fixtures, tests, and preview-only runtime tools.

## Generated files

- docs/generated/build-012-manifest.json
- docs/generated/build-012-acceptance.md
- docs/generated/build-012-handoff.md
- docs/generated/build-012-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Preserve hand-authored docs. Build 12 predictable standalone docs, LLM context, and generated state are declared in this phase spec.

## Known gaps

- No durable memory storage, vector search, embeddings, private/customer data ingestion, or live memory service.
- Runtime memory tools are fixture-only previews.

## Next target

Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
