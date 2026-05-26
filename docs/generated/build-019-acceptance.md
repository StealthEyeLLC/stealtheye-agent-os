# Build 19 acceptance checklist: Local Dev UI Shell / Resource Rendering

## Package foundation

- @stealtheye/local-dev-ui-shell package exists with schemas, helpers, fixtures, deterministic renderer, and Vitest coverage.
- LocalDevUiShell, route, render request/result, static asset, resource load result, hydration result, safety policy/decision, receipt preview, and fixture bundle schemas validate.
- Routes cover /, /overview, /missions, /agents, /tools, /guard, /receipts, /replay, /memory, /repo-status, /codeops, /browserops, /worker-fleet, /mcp-server, /dev-endpoint, /chatgpt-developer-mode, and /settings.
- Routes map only to local app-safe ui://stealtheye/control-plane/... resources from @stealtheye/control-plane-ui.
- Renderer loads resources, templates, hydration payloads, safety decisions, and receipt previews to produce deterministic static HTML.
- Static assets use only ui-asset://stealtheye/control-plane/... or ui://stealtheye/control-plane/... fixture-safe schemes.
- Safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe route paths, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, missing read-only/preview/fixture flags, missing receipt references, and unknown route/component/resource types.
- Official docs checked are documented in docs/LOCAL_DEV_UI_SHELL.md and ADR 0021.
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
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, remote script/style/asset, default server binding, or money movement path is exposed.
- The local dev UI shell remains static/local/fixture/preview-only.

## Next target

- Build 20 1 MCP Server Resource Wiring / Controlled Localhost Preview.
