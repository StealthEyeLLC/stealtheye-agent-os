# Build 22 handoff: Safe Local Preview Runner / Manual Developer-Mode Connection Checklist

Build 22 adds safe local preview runner metadata and manual developer-mode checklist metadata while preserving the public-safe local/dev boundary.

## Changed package/files

- packages/mcp-server/src/safe-local-preview-runner.ts
- packages/mcp-server/src/manual-developer-mode-checklist.ts
- packages/mcp-server/src/resource-registry.ts
- packages/mcp-server/src/index.ts
- packages/mcp-server/test/safe-local-preview-runner.test.ts
- scripts/phases/build-022-safe-local-preview-runner.mjs

## Generated files

- docs/generated/build-022-manifest.json
- docs/generated/build-022-acceptance.md
- docs/generated/build-022-handoff.md
- docs/generated/build-022-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Protected docs policy

README.md, AGENTS.md, and docs/ARCHITECTURE.md are unchanged.

## Known gaps

- Manual local preview execution remains gated and config-required.
- Developer-mode connection remains manual and checklist-based.
- No public endpoint is produced.
- No tunnel live enablement exists.
- No default server binding exists.
- No process start occurs in CI/default mode.

## Verifier notes

Confirm generated sync and CI status before merge.
