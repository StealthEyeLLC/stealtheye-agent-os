# Build 13 handoff: Live CodeOps Branch-Write Path through Guard + Receipts

Build 13 bridges CodeOps planning into a guarded branch-safe write path through Guard and Receipts while keeping CI fixture-only and live GitHub writing config-required.

## New package

Guarded CodeOps branch-write schemas, policy, receipt previews, fixture writer, config-required GitHub writer interface, and MCP runtime tools.

## Generated files

- docs/generated/build-013-manifest.json
- docs/generated/build-013-acceptance.md
- docs/generated/build-013-handoff.md
- docs/generated/build-013-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 13 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 13 docs.

## Known gaps

- Optional live GitHub writer remains config-required and is not exercised in CI.
- No durable receipt ledger is included.
- Pull request opening is modeled as preview/future behavior and not exposed as an unrestricted live runtime tool.
- Official MCP SDK/server transport alignment remains future work.

## Next target

Build 14 — Official MCP Server Transport / SDK Alignment.
