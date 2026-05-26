# ADR 0019: Core Control Plane App

## Status

Accepted for Build 17.

## Context

Build 14 added `@stealtheye/mcp-server`. Build 15 added `@stealtheye/dev-endpoint`. Build 16 added `@stealtheye/chatgpt-dev-connection`. Build 17 adds the first app/control-plane model that organizes these and earlier foundation packages into one safe operational surface.

## Decision

Add `@stealtheye/control-plane-app` as a model/fixture/preview-only package. It defines a Control Plane App, navigation, views, panels, actions, state snapshots, safety decisions, and receipt previews.

The app surfaces missions, agents, tools, Guard, receipts, replay, memory, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server, Dev Endpoint, ChatGPT developer-mode readiness, and safe settings without live execution.

## Official documentation checked

Build 17 checked current official documentation only:

- OpenAI Apps SDK overview.
- OpenAI Apps SDK reference for component, resource, tool, and metadata behavior.
- OpenAI Apps SDK examples for future UI component/resource direction.
- Model Context Protocol docs for server, client, tool, and resource behavior.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Safety boundaries

Build 17 does not deploy a production frontend, does not submit a public app, does not add production OAuth credentials, does not add real app IDs, does not add production domains, does not add customer/private data workflows, and does not expose unrestricted live write tools.

The safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, missing Guard boundary, missing receipt preview, and unknown action categories.

## Consequences

The repo now has a public-safe app/control-plane model suitable for verifier review and future UI/component resource work. It does not include production hosting, real authentication, real user data, credential entry, public submission, or live mutation.

## Next

Build 18 should implement the first Control Plane UI Component Resources.
