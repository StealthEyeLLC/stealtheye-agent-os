# Build 17 acceptance checklist: Core Control Plane App

## Package foundation

- @stealtheye/control-plane-app package exists with schemas, helpers, fixtures, and Vitest coverage.
- Navigation, views, panels, actions, state snapshot, safety policy, safety decisions, and receipt previews validate.
- Views cover overview, missions, agents, tools, guard, receipts, replay, memory, repo_status, codeops, browserops, worker_fleet, mcp_server, dev_endpoint, chatgpt_developer_mode, and settings_safe.
- Actions are fixture/model/preview-only; no real live execution, destructive action, production mutation, protected branch mutation, credential entry/storage, customer/private data workflow, material external send, or money movement path is added.
- Official docs checked are documented in docs/CONTROL_PLANE_APP.md and ADR 0019.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No production frontend deployment is created.
- No public app submission is performed.
- No production OAuth credential, tunnel auth value, cloud credential, private key, real app identifier, production domain, public deployed app URL, or real hosted endpoint is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, or money movement action is exposed.
- The control plane app remains model/fixture/preview-only.

## Next target

- Build 18 — Control Plane UI Component Resources.
