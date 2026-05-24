# Build 9 handoff: Receipts + Replay Foundations

Build 9 adds Receipts + Replay foundations for public-safe evidence reconstruction without live side effects.

## New package

`@stealtheye/receipts-replay` models receipt events, evidence refs, receipt bundles, mission timelines, replay packets, verification packets, final report packets, deterministic integrity digests, and fixture-only adapters across existing subsystems.

## Generated files

- `docs/generated/build-009-manifest.json`
- `docs/generated/build-009-acceptance.md`
- `docs/generated/build-009-handoff.md`
- `docs/generated/build-009-receipt.json`
- `docs/generated/project-memory.json`
- `docs/generated/known-gaps.json`
- `docs/generated/safety-capability-matrix.json`
- `docs/generated/eval-registry.json`
- `docs/generated/tool-inventory.json`
- `docs/generated/build-state.json`

## Hand-authored docs policy

Preserve accumulated hand-authored docs. Generated sync may write `docs/generated/` files and may update hand-authored docs only inside explicit `BEGIN/END BUILD 9 ADDITIVE UPDATE` markers.

## Known gaps

- Durable receipt database, production ledger, and replay service remain future work.
- Artifact storage is reference-only; no live cloud bucket, object store, or retention workflow exists.
- Replay packets are descriptive only and cannot execute tools, browsers, CI reruns, or production workflows.
- Integrity digests are unsigned SHA-256 checks; signing and provenance are deferred.
- Memory Graph integration is not built until Build 10.

## Next target

Build 10 — Memory Graph.
