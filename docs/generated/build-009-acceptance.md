# Build 9 acceptance checklist: Receipts + Replay Foundations

## Package foundation

- Receipt event, evidence ref, receipt bundle, timeline, replay packet, verification packet, and final report schemas validate.
- Timeline helpers sort, group, detect missing events, and summarize denials/escalations and mission progress.
- Replay packets preserve event order and remain descriptive/side-effect-free.
- Integrity digest helpers are stable and detect mismatch.
- Adapters create receipt events from Guard, Worker Fleet, CodeOps, BrowserOps, and generated build-state fixtures.

## Build automation engine

- `scripts/stealtheye-build.mjs` supports Build 9 phase-generated output and still supports Build 8.
- Generated files exist under `docs/generated/`.
- Public-safe/no-live scanner runs in `--check` mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No durable database or production receipt ledger is added.
- No live replay execution, live tool execution, browser execution, CodeOps mutation, CI rerun, production mutation, money movement, or artifact storage backend is added.
- Evidence refs are fixture/public-safe references only and contain no real logs, screenshots, DOM, customer data, secrets, or production incidents.

## Next target

- Build 10 — Memory Graph.
