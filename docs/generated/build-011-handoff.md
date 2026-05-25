# Build 11 handoff: Live Read-Only Repo/Status Tools through Guard + Receipts

Build 11 adds the first public GitHub repository/status observation surface. The surface is read-only, Guard-gated, receipt-producing, and fixture-tested in CI.

## New package

`@stealtheye/repo-status` adds schemas, deterministic read policy, Guard adapter, receipt previews, fixtures, status packet summary helpers, and an optional unauthenticated public GitHub REST client.

## Runtime integration

`@stealtheye/mcp-runtime` now lists and calls read-only repo/status tools alongside the existing App Host preview tools. Runtime metadata remains truthful: live reads may be configured, live writes are not present.

## Generated files

- docs/generated/build-011-manifest.json
- docs/generated/build-011-acceptance.md
- docs/generated/build-011-handoff.md
- docs/generated/build-011-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Preserve accumulated hand-authored docs. Generated sync may write docs/generated files and Build 11 hand-authored updates must be additive and bounded by explicit Build 11 markers.

## Known gaps

- CI uses fixture clients and mocked fetch for stability; live public REST reads are optional configuration, not required for tests.
- No durable ledger is included for repo/status receipts; receipts are returned with in-memory tool results.
- No official MCP SDK transport, public endpoint, public ChatGPT app submission, or production deployment is included.
- No private repository, credentialed GitHub, GitHub App installation, OAuth, or write workflow is included.
- Memory Graph remains future work.

## Next target

Build 12 — Memory Graph.
