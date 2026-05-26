# ADR 0017: Reachable Dev Deployment / Tunnel / Endpoint

## Status

Accepted for Build 15.

## Context

Build 14 added `@stealtheye/mcp-server` as an official-MCP-aligned server wrapper with local/dev transport modeling, tool/resource registries, safety inventory, health, and receipt previews. Build 15 prepares the next layer: a reachable development endpoint/tunnel foundation that can later support ChatGPT developer-mode connection without crossing production or credential boundaries.

## Decision

Add `@stealtheye/dev-endpoint` as a dev-only endpoint and tunnel modeling package around `@stealtheye/mcp-server`.

The package models disabled, localhost-only, tunnel-config-required, reachable-dev-preview, and hosted-future modes. It allows only disabled, localhost-only, and placeholder-only tunnel-config-required readiness in this build. Reachable dev preview and hosted future remain blocked until a later safe configuration step.

The package includes config schemas, tunnel provider schemas, safety policy decisions, health checks, readiness reports, manifest generation, and receipt previews. It commits no secrets, no tunnel credentials, no production OAuth values, no cloud credentials, no production domain, no public app ID, and no public endpoint.

## Official documentation checked

Build 15 checked current official documentation only for endpoint, transport, and app-connection behavior:

- OpenAI Apps SDK Quickstart and MCP Server docs for the MCP app/server connection model.
- OpenAI Apps SDK Connect from ChatGPT, Test your integration, Submit your app, and Security & Privacy docs for developer-mode connection, testing, submission, and safety boundaries.
- OpenAI Secure MCP Tunnel docs for future tunnel behavior only. Build 15 does not commit live tunnel configuration.
- Model Context Protocol transport specification for stdio and Streamable HTTP behavior.

No blog posts, third-party tutorials, or unofficial SDK behavior were used as implementation authority.

## Safety boundaries

Build 15 does not deploy production infrastructure, does not create a public endpoint, does not submit a public ChatGPT app, does not add production OAuth credentials, does not add tunnel secrets, does not add cloud credentials, and does not expose unrestricted live write tools.

The safety policy denies production mode, public production domains, real production OAuth clients or secrets, tunnel auth values, cloud credentials, unrestricted live write tools, protected branch mutation, destructive operations, customer/private data, money movement, material external sends, production deployment, missing safety inventory, missing health checks, missing receipt preview, and unknown tunnel provider live enablement.

## Consequences

The repo now has a public-safe endpoint/tunnel readiness layer that can summarize MCP server metadata, tool inventory, resource inventory, safety inventory, health, readiness, and receipt preview status without performing any live network binding or deployment.

## Next

Build 16 should connect from ChatGPT Developer Mode once a safe reachable development endpoint exists.
