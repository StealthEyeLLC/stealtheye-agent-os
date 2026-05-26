# Build 20 handoff: MCP Server Resource Wiring / Controlled Localhost Preview

Build 20 wires local UI shell resources into the MCP server resource layer while preserving static/local/fixture/preview-only boundaries and no default server binding.

## New package

MCP Server Resource Wiring package extension that lists and reads Control Plane UI resources, deterministic Local Dev UI Shell render resources, and controlled localhost-preview metadata through @stealtheye/mcp-server without binding a server by default or adding remote assets.

## Generated files

- docs/generated/build-020-manifest.json
- docs/generated/build-020-acceptance.md
- docs/generated/build-020-handoff.md
- docs/generated/build-020-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 20 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 20 docs.

## Known gaps

- No production frontend, hosted app, real app auth, public app submission, production OAuth, real app IDs, production domains, real public endpoints, or tunnel credentials exist.
- No customer data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, credential entry path, external side effect path, remote asset path, external network path, default server binding path, tunnel live enablement path, or money movement path exists.
- No explicit controlled localhost preview command is added yet.
- No developer-mode resource connection command is added yet.
- No durable UI receipt ledger is added.

## Next target

Build 21 - Controlled Localhost Preview Command / Developer-Mode Resource Connection.
