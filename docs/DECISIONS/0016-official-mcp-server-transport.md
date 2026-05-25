# ADR 0016: Official MCP Server Transport / SDK Alignment

## Status

Accepted for Build 14.

## Context

Build 10 introduced a local/dev MCP-style runtime. Builds 11 through 13 added public-safe repo/status reads, fixture-only Memory Graph previews, and guarded CodeOps write preview/fixture tools. Build 14 prepares those runtime surfaces for official MCP server and OpenAI Apps SDK alignment without changing the safety boundary.

## Decision

Add `@stealtheye/mcp-server` as an official-MCP-aligned server wrapper package. The package provides server metadata, protocol metadata, tool/resource registries, descriptor validation, health, capabilities, transport diagnostics, safety inventory, receipt previews, and a developer-mode connection manifest.

The implementation uses an SDK-aligned adapter boundary rather than adding the official SDK package in this build. The reason is CI stability: this connector-only session cannot verify dependency resolution locally before pushing. The package keeps the interface ready for later SDK replacement once compatibility is verified.

## Official documentation checked

Build 14 checked only official documentation for SDK/API/transport behavior:

- OpenAI Apps SDK documentation for MCP server patterns, tool registration metadata, and developer-mode preparation.
- Model Context Protocol specification for tools, resources, protocol metadata, and transport behavior.
- Model Context Protocol transport documentation for stdio and Streamable HTTP guidance.

## Safety boundaries

Build 14 does not deploy production infrastructure, does not submit a public ChatGPT app, does not add production OAuth credentials, does not add production domains, and does not expose unrestricted live write tools.

The server wrapper preserves existing safety boundaries:

- App Host tools remain safe preview/fixture surfaces.
- repo/status tools remain read-only.
- Memory Graph tools remain preview-only and fixture-only.
- CodeOps preview tools remain preview-only.
- CodeOps fixture write remains fixture-only and non-destructive.
- Destructive, production mutation, protected branch mutation, secret access, customer data, and money movement capabilities remain unavailable.

## Consequences

The repo now has a clear MCP server host layer for ChatGPT developer-mode preparation while remaining public-safe and fixture/test-safe. Future work can replace the adapter boundary with the official SDK package and add a reachable development endpoint without changing the tool safety truth.

## Next

Build 15 should add Reachable Dev Deployment / Tunnel / Endpoint while preserving the same no-secret, no-production, no-unrestricted-live-write boundary.
