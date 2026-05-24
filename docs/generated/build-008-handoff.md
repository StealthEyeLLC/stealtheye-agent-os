# Build 8 handoff: BrowserOps Foundations + Minimal Build Automation Engine

Build 8 adds BrowserOps contracts and a minimal build automation engine as separate foundations.

## New package

`@stealtheye/browserops` models browser sessions, page observations, evidence references, action policies, action plans, Guard preflight, and Worker Fleet handoff templates.

## New build engine

- `scripts/stealtheye-build.mjs`
- `scripts/phases/build-008-browserops.mjs`

## Generated files

- `docs/generated/build-008-manifest.json`
- `docs/generated/build-008-acceptance.md`
- `docs/generated/build-008-handoff.md`
- `docs/generated/build-008-receipt.json`
- `docs/generated/project-memory.json`
- `docs/generated/known-gaps.json`
- `docs/generated/safety-capability-matrix.json`
- `docs/generated/eval-registry.json`
- `docs/generated/tool-inventory.json`
- `docs/generated/build-state.json`

## Hand-authored docs policy

Preserve accumulated hand-authored docs. Generated sync may write `docs/generated/` files and may update hand-authored docs only inside explicit `BEGIN/END BUILD 8 ADDITIVE UPDATE` markers.

## Carried-forward gaps

- Live BrowserOps runtime, Playwright integration, browser isolation infrastructure, and credential broker flows remain future work.
- Build automation remains a minimal generator/checker.
- Worker Fleet handoff remains task-template modeling only.

## Next target

Build 9 — Receipts + Replay.
