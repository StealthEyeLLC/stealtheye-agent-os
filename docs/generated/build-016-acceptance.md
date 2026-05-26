# Build 16 acceptance checklist: Connect from ChatGPT Developer Mode

## Package foundation

- @stealtheye/chatgpt-dev-connection package exists with schemas, helpers, fixtures, and Vitest coverage.
- Connection stages validate for prerequisites, endpoint_ready, app_manifest_ready, connect_from_chatgpt, test_integration, and submit_app_future.
- Safety policy allows fixture-only local/dev plans and placeholder-only tunnel-config-required plans.
- Safety policy denies production submission, real app IDs, production OAuth clients/secrets, production domains, real public endpoints, tunnel auth tokens, cloud credentials, unrestricted live write tools, destructive tools, production mutation tools, protected branch mutation tools, customer/private data, money movement, missing endpoint readiness, missing MCP safety inventory, missing receipt preview, and missing boundary statements.
- Manifest/readiness/receipt helpers summarize @stealtheye/mcp-server and @stealtheye/dev-endpoint without performing a real ChatGPT connection.
- Official docs checked are documented in docs/CHATGPT_DEVELOPER_MODE.md and ADR 0018.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No real ChatGPT connection is performed.
- No public ChatGPT app is submitted.
- No production OAuth credential, tunnel auth value, cloud credential, private key, real app identifier, production domain, or public deployed app URL is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, or money movement tool is exposed.
- Developer-mode connection remains local/dev, fixture-only, or future manual configuration.

## Next target

- Build 17 — Core Control Plane App.
