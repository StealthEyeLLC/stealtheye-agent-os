# Build 17 handoff: Core Control Plane App

Build 17 creates the first Core Control Plane App model while preserving the no-secret, no-production, no-public-submission, no-real-auth, no-customer-data, no-unrestricted-live-write boundary.

## New package

Core Control Plane App model package that organizes missions, agents, tools, receipts, replay, memory, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server, Dev Endpoint, and ChatGPT developer-mode readiness into a coherent fixture/preview control surface.

## Generated files

- docs/generated/build-017-manifest.json
- docs/generated/build-017-acceptance.md
- docs/generated/build-017-handoff.md
- docs/generated/build-017-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 17 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 17 docs.

## Known gaps

- No production frontend, hosted app, real app auth, public app submission, or production OAuth exists.
- No real user data, customer/private data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, or money movement path exists.
- First UI/component resources remain future Build 18 work.
- No durable control-plane receipt ledger is added.

## Next target

Build 18 — Control Plane UI Component Resources.
