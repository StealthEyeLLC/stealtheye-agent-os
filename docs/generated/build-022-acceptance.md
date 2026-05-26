# Build 22 acceptance checklist: Safe Local Preview Runner / Manual Developer-Mode Connection Checklist

## Package foundation

- Safe local preview runner schemas, helpers, safety decisions, readiness report, manual-run checklist, and receipt preview validate.
- Manual developer-mode connection checklist and manifest schemas validate.
- Allowed runner modes are metadata-only and blocked/future runner modes are denied.
- MCP resources expose Build 22 readiness, manual-run checklist, developer-mode checklist, and receipt-preview metadata as read-only public-safe resources.
- Generated sync is strict and deterministic for Build 22.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No server is bound by default.
- No process starts in CI or default mode.
- No tunnel, public endpoint, production connection material, real app material, live write path, protected branch mutation, restricted operation, private data workflow, financial flow, external send, or external side effect is added.
- Runner and connection metadata remains local/dev, preview-only, fixture-safe, manually gated, read-only by default, and public-safe.

## Next target

- Build 23 - Durable Public-Safe Preview Receipt Ledger / Verifier-Reviewed Manual Preview Evidence.
