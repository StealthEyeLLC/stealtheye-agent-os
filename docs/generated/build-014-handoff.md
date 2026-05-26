# Build 14 handoff: Official MCP Server Transport / SDK Alignment

Build 14 prepares StealthEye Agent OS for ChatGPT developer-mode MCP connection by adding an official-MCP-aligned server package, transport diagnostics, dev connection manifest, tool/resource registries, safety inventory, and receipt previews while preserving all Build 13 safety boundaries.

## New package

Official-MCP-aligned server wrapper package that composes existing App Host, repo/status, Memory Graph, and CodeOps runtime tools behind safe local/dev transport helpers.

## Generated files

- docs/generated/build-014-manifest.json
- docs/generated/build-014-acceptance.md
- docs/generated/build-014-handoff.md
- docs/generated/build-014-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 14 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 14 docs.

## Known gaps

- Official SDK package was not added in Build 14; the package implements an SDK-aligned adapter boundary pending dependency compatibility verification.
- HTTP/dev preview transport is modeled but not bound to a public endpoint.
- Hosted/public ChatGPT app deployment, public app submission, production OAuth clients, and production domains remain future work.
- No durable receipt ledger is added.

## Next target

Build 15 — Reachable Dev Deployment / Tunnel / Endpoint.
