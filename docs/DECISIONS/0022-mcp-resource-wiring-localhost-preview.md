# ADR 0022: MCP Server Resource Wiring / Controlled Localhost Preview

## Status

Accepted for Build 20.

## Context

Build 18 added `@stealtheye/control-plane-ui` as Apps SDK-style component/resource descriptors. Build 19 added `@stealtheye/local-dev-ui-shell` as a static/local/fixture renderer. Build 20 needs the MCP server to list and read those resources through the existing MCP resource layer, while also modeling controlled localhost-preview metadata without binding a server by default.

## Decision

Extend `@stealtheye/mcp-server` with a UI resource adapter and localhost preview metadata model.

The adapter adds MCP resource descriptors and read results for:

- `ui://stealtheye/control-plane/...` Control Plane UI resources.
- `ui-render://stealtheye/control-plane/...` deterministic Local Dev UI Shell render resources.
- `localhost-preview://stealtheye/control-plane/...` controlled localhost-preview metadata resources.

Build 20 implements `disabled`, `static_fixture_preview`, and `localhost_config_required` metadata. `localhost_bound_future` and `hosted_future` remain blocked/future. The server does not bind ports, does not perform external fetches, does not add remote assets, and does not add a production web server.

## Official documentation checked

Build 20 checked current official documentation only:

- OpenAI Apps SDK reference for component resources, resource metadata, tool metadata, and output-template metadata.
- OpenAI Apps SDK Build your ChatGPT UI guide for resource templates, HTML rendering, hydration, and bridge context.
- OpenAI Apps SDK UI/state guidance for component state and hydration concepts.
- Model Context Protocol specification for server resources, resources/list, and resources/read.
- Model Context Protocol specification for server transports, stdio, and streamable HTTP concepts.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Safety boundaries

Build 20 does not deploy a production frontend, does not bind a server by default, does not submit a public app, does not add production OAuth credentials, does not add real app IDs, does not add production domains, does not add customer/private data workflows, does not expose unrestricted live write tools, does not add remote scripts/assets, and does not add tunnel credentials.

The MCP resource wiring safety policy denies production deployment, public app submission, real OAuth clients, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, external network access, tunnel provider live enablement, hosted/public mode, missing read-only/preview/fixture flags, missing receipt references, and unknown resource/preview mode.

## Consequences

The MCP server can now enumerate and read local UI resources and deterministic render previews through the same resource API as existing runtime and server resources. This prepares Build 21 for an explicit controlled localhost preview command or developer-mode resource connection without changing the public/private boundary.

## Next

Build 21 should add an explicit controlled localhost preview command if environment supports it, or connect developer-mode resources using config-required metadata.
