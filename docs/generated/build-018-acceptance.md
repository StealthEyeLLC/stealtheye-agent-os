# Build 18 acceptance checklist: Control Plane UI Component Resources

## Package foundation

- @stealtheye/control-plane-ui package exists with schemas, helpers, fixtures, and Vitest coverage.
- Component, resource, template, metadata, hydration payload, safety policy, safety decision, and fixture bundle schemas validate.
- UI component/resource descriptors cover overview_dashboard, mission_list, mission_detail, agent_registry, tool_inventory, guard_decisions, receipt_timeline, replay_report, memory_context, repo_status, codeops_panel, browserops_panel, worker_fleet, mcp_server_status, dev_endpoint_status, chatgpt_developer_mode_status, and safe_settings.
- Resource URIs use the local app-safe ui://stealtheye/control-plane/... scheme only.
- Hydration payloads include control-plane state snapshot, navigation, views, panels, actions, safety inventory, receipt previews, and known gaps.
- Safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe resource URI schemes, missing read-only/preview/fixture flags, missing receipt references, and unknown component/resource types.
- Official docs checked are documented in docs/CONTROL_PLANE_UI_COMPONENTS.md and ADR 0020.
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
- No production OAuth credential, real app identifier, production domain, public deployed app URL, real hosted endpoint, tunnel token, cloud credential, private key, or customer/private data workflow is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, or money movement path is exposed.
- The control plane UI resources remain model/static/fixture/preview-only.

## Next target

- Build 19 — Local Dev UI Shell / Resource Rendering.
