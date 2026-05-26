# Build 18 handoff: Control Plane UI Component Resources

Build 18 creates the first Control Plane UI Component Resources while preserving the no-secret, no-production, no-public-submission, no-real-auth, no-customer-data, no-unrestricted-live-write boundary.

## New package

Control Plane UI Component Resources package that models Apps SDK-style static component/resource descriptors, templates, metadata, hydration contracts, fixtures, and UI safety decisions around @stealtheye/control-plane-app without deploying a frontend or adding live app material.

## Generated files

- docs/generated/build-018-manifest.json
- docs/generated/build-018-acceptance.md
- docs/generated/build-018-handoff.md
- docs/generated/build-018-receipt.json
- docs/generated/project-memory.json
- docs/generated/known-gaps.json
- docs/generated/safety-capability-matrix.json
- docs/generated/eval-registry.json
- docs/generated/tool-inventory.json
- docs/generated/build-state.json

## Hand-authored docs policy

Build 18 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 18 docs.

## Known gaps

- No production frontend, hosted app, real app auth, public app submission, production OAuth, real app IDs, production domains, or real public endpoints exist.
- No real user data, customer/private data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, credential entry path, external side effect path, or money movement path exists.
- No local dev UI shell or resource renderer is added in Build 18.
- No durable UI receipt ledger is added.

## Next target

Build 19 — Local Dev UI Shell / Resource Rendering.
