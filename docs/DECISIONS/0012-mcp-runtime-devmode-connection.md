# ADR 0012: MCP runtime and ChatGPT app dev-mode connection

## Status

Accepted for Build 10.

## Context

The project had several package-foundation builds but no real runnable App Host runtime. Build 10 corrects the queue: the target is MCP Runtime + ChatGPT App Dev-Mode Connection, while Memory Graph moves after the first runtime/app connection.

## Decision

Add `@stealtheye/mcp-runtime` as a local/dev MCP-style runtime wrapper around safe App Host tools. The package exposes list tools, call tool, list resources, read resource, health, capabilities, runtime metadata, dev-mode connection metadata, and receipt previews. It remains in-process testable and does not require network access.

The runtime uses App Host descriptors as the source of truth and asserts that every exposed tool is read-only, preview-only, or fixture-only with disabled live capability status. Tool calls create public-safe receipt previews using `@stealtheye/receipts-replay` event contracts.

## Consequences

The repo now has a runnable runtime surface that can later be adapted to an official MCP SDK server and ChatGPT developer-mode connector. The runtime remains honest about gaps: no public app submission, production deployment, OAuth production credential, live write tool, or live external side effect is included.

## Next

Build 11 should add live read-only repo/status tools through Guard + Receipts. Memory Graph remains later.
