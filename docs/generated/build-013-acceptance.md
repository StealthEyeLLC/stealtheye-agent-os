# Build 13 acceptance checklist: Live CodeOps Branch-Write Path through Guard + Receipts

## Package foundation

- Branch-write schemas and helpers exist.
- Policy denies protected branches, invalid prefixes, workflow mutation, CI/security weakening, secret paths, production paths, delete, oversized patches, missing verification, and missing receipts.
- Guard requested actions cover repo branch read, branch create, file write, commit, PR open preview, and receipt write stages.
- Receipt previews cover policy, Guard, target repo/branch, file summaries, verification commands, safety statements, mode, and final result.
- Fixture writer preview and execution results are implemented and tested.
- MCP runtime exposes CodeOps write preview tools and one fixture-only execution tool without unrestricted live write tools.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No direct protected branch, default branch, main, or master write is allowed.
- No force push, history rewrite, workflow mutation, CI/test/security weakening, destructive deletion, production mutation, credential path, or customer/private data path is allowed.
- CI uses fixtures and mocks only; optional GitHub writer behavior is disabled/config-required and never uses credentials in tests.
- Receipts are preview events only; no durable ledger is added.

## Next target

- Build 14 — Official MCP Server Transport / SDK Alignment.
