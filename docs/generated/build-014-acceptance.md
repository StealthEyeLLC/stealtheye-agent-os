# Build 14 acceptance checklist: Official MCP Server Transport / SDK Alignment

## Package foundation

- @stealtheye/mcp-server package exists with schemas, server helpers, transport helpers, tool/resource registries, health helper, fixtures, and tests.
- Server metadata and protocol/version metadata validate against Build 14 schemas.
- Transport modes model in_process, stdio_dev, http_dev_preview, and hosted_future; only local/dev modes are implemented.
- Tool registry composes App Host, repo/status, Memory Graph, and CodeOps tools from the existing MCP runtime.
- Registry rejects duplicate names, unsafe descriptors, destructive tools, and unrestricted live write tools.
- Resource registry lists runtime and server resources and reads public-safe JSON content.
- Tool calls through the server wrapper produce receipt previews with safety descriptor, transport mode, status, no-secret, no-production, and no-money statements.
- Dev connection manifest contains no credential material, production endpoint, production app identifier, or production OAuth client.
- Official docs checked are documented in docs/MCP_SERVER_TRANSPORT.md and ADR 0016.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No production infrastructure is deployed or configured.
- No public ChatGPT app is submitted.
- No production OAuth client, credential material, private key, cloud credential, app identifier, or production domain is added.
- No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, or money movement tool is exposed.
- HTTP/dev preview and hosted/public deployment are modeled as future work only.
- Existing App Host, repo/status, Memory Graph, and CodeOps safety flags are preserved.

## Next target

- Build 15 — Reachable Dev Deployment / Tunnel / Endpoint.
