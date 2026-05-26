# Build 15 acceptance checklist: Reachable Dev Deployment / Tunnel / Endpoint

## Package foundation

- @stealtheye/dev-endpoint package exists with schemas, helpers, fixtures, and Vitest coverage.
- Dev endpoint modes validate for disabled, localhost_only, tunnel_config_required, reachable_dev_preview, and hosted_future.
- Tunnel providers validate for none, cloudflare_tunnel_future, ngrok_future, localhost_forward_future, and custom_future.
- Safety policy allows disabled, localhost_only, and placeholder-only tunnel_config_required modes.
- Safety policy denies production, public endpoints, production OAuth, tunnel auth values, cloud credentials, unrestricted live write tools, destructive tools, production mutation, protected branch mutation, customer/private data, money movement, material external sends, and production deployment.
- Manifest, health, readiness, and receipt preview helpers are implemented around @stealtheye/mcp-server.
- Readiness reports local-dev and tunnel-config readiness while blocking public submission and production.
- Official docs checked are documented in docs/DEV_ENDPOINT.md and ADR 0017.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No production infrastructure is deployed or configured.
- No public endpoint is created.
- No public ChatGPT app is submitted.
- No production OAuth credential, tunnel auth value, cloud credential, private key, app identifier, or production domain is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, or money movement tool is exposed.
- Developer-mode connection remains local/dev or future config-required.

## Next target

- Build 16 — Connect from ChatGPT Developer Mode.
