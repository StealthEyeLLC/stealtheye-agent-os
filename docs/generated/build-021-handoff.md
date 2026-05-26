# Build 21 handoff: Controlled Localhost Preview Command / Developer-Mode Resource Connection

Build 21 adds a controlled localhost preview command/readiness layer and developer-mode resource connection metadata while preserving the local/dev public-safe boundary.

## New package

Controlled localhost preview command model and developer-mode resource connection metadata inside @stealtheye/mcp-server. Build 21 adds schema-validated command plans, readiness reports, safety decisions, and receipt previews without binding a server, starting a process, enabling a tunnel, or creating a real ChatGPT app.

## Generated files

- docs/generated/build-021-manifest.json
- docs/generated/build-021-acceptance.md
- docs/generated/build-021-handoff.md
- docs/generated/build-021-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 21 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 21 docs.

## Known gaps

- No controlled local preview runner exists yet; Build 21 only models readiness and command plans.
- No real ChatGPT app, public app submission, production OAuth, real app ID, production domain, public endpoint, or tunnel credential exists.
- No production frontend, default server binding, process start in CI/default mode, external network access, hosted preview, or tunnel live enablement exists.
- No unrestricted live write path, protected branch mutation path, destructive path, production mutation path, customer/private data path, material external send path, credential entry path, or money movement path exists.
- No durable localhost preview ledger exists yet; Build 21 produces receipt previews only.

## Next target

Build 22 - Safe Local Preview Runner / Manual Developer-Mode Connection Checklist.
