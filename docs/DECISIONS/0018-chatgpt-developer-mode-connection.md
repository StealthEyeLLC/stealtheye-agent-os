# ADR 0018: ChatGPT Developer Mode Connection

## Status

Accepted for Build 16.

## Context

Build 14 added `@stealtheye/mcp-server` as an official-MCP-aligned server wrapper. Build 15 added `@stealtheye/dev-endpoint` as a dev-only endpoint/tunnel readiness layer. Build 16 must model how the MCP server would be connected from ChatGPT Developer Mode once a safe reachable dev endpoint exists, without committing credentials or performing a real app connection.

## Decision

Add `@stealtheye/chatgpt-dev-connection` as a fixture/planning/checklist package. It creates developer-mode connection plans, checklists, manifests, safety decisions, readiness reports, and receipt previews around `@stealtheye/mcp-server` and `@stealtheye/dev-endpoint`.

The build explicitly blocks real ChatGPT connection, public app submission, production OAuth configuration, real app IDs, production domains, real public endpoint URLs, tunnel auth values, cloud credentials, unrestricted live write tools, protected branch mutation tools, destructive tools, production mutation tools, customer/private data, material external sends, and money movement.

## Official documentation checked

Build 16 checked current official documentation only:

- OpenAI Apps SDK overview.
- OpenAI Apps SDK Connect from ChatGPT guide.
- OpenAI Apps SDK Test your integration guide.
- OpenAI Apps SDK Submit your app guide.
- OpenAI Apps SDK Security & Privacy guide.
- Model Context Protocol docs for MCP server/client/tool/resource behavior.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Consequences

The repo gains a public-safe developer-mode connection manifest and readiness model that can be reviewed by a verifier. It does not create an app, connect ChatGPT, submit a public app, configure OAuth production clients, add a tunnel secret, or expose unrestricted live write tools.

## Next

Build 17 should create the first app/control-plane UX surface or perform the safe manual developer-mode connection step, depending on environment readiness.
