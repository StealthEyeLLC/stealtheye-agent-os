# Build 15 handoff: Reachable Dev Deployment / Tunnel / Endpoint

Build 15 prepares a reachable development endpoint/tunnel layer for a future ChatGPT developer-mode connection while preserving the no-secret, no-production, no-public-app-submission, no-unrestricted-live-write boundary.

## New package

Dev-only reachable endpoint and tunnel modeling package around @stealtheye/mcp-server with placeholder-only tunnel configuration, health, safety, readiness, manifest, and receipt preview helpers.

## Generated files

- docs/generated/build-015-manifest.json
- docs/generated/build-015-acceptance.md
- docs/generated/build-015-handoff.md
- docs/generated/build-015-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 15 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 15 docs.

## Known gaps

- No real tunnel provider is enabled; all tunnel providers remain future/config-required.
- No public endpoint, real tunnel URL, production domain, production OAuth app, app submission, or cloud deployment is added.
- ChatGPT developer-mode connection is documented as a future Build 16 target after a safe reachable dev endpoint exists.
- No durable endpoint receipt ledger is added.

## Next target

Build 16 — Connect from ChatGPT Developer Mode.
