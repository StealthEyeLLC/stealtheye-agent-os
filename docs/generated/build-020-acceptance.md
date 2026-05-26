# Build 20 acceptance checklist: MCP Server Resource Wiring / Controlled Localhost Preview

## Package foundation

- @stealtheye/mcp-server lists existing resources, Control Plane UI resources, Local Dev UI Shell render resources, and localhost-preview metadata resources.
- @stealtheye/mcp-server reads UI resources, rendered shell resources, and localhost-preview metadata resources through the same resource API.
- Rendered shell resources contain deterministic static HTML, the boundary banner, and receipt previews.
- Controlled localhost preview metadata validates for disabled, static_fixture_preview, and localhost_config_required modes.
- localhost_bound_future and hosted_future remain blocked/future.
- Safety policy denies production deployment, public app submission, real OAuth clients, real app IDs, production domains, real public endpoints, unrestricted live writes, protected branch mutation, destructive actions, production mutation, customer/private data, money movement, material external sends, credential entry/storage, external side effects, unsafe URI schemes, remote scripts/styles/assets, server binding by default, external network access, tunnel provider live enablement, hosted/public mode, missing flags, missing receipt references, and unknown modes.
- Official docs checked are documented in docs/MCP_RESOURCE_WIRING_LOCALHOST_PREVIEW.md and ADR 0022.
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
- No production OAuth credential, real app identifier, production domain, public deployed app URL, real hosted endpoint, tunnel credential, cloud credential, credential material, or customer/private data workflow is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, remote script/style/asset, external network access, default server binding, tunnel live enablement, or money movement path is exposed.
- The MCP resource wiring remains static/local/fixture/preview-only.

## Next target

- Build 21 - Controlled Localhost Preview Command / Developer-Mode Resource Connection.
