# ADR 0007: ChatGPT App / MCP Server Host Shell

## Status

Accepted

## Context

Build 2 introduced Agent Registry primitives for signed agent cards, signed tool manifests, manifest diffing, trust decisions, and revocation. Build 3 introduced Guard capability-token, requested-action, decision, hard-stop, policy, and receipt primitives. Build 4 introduced Mission OS and StealthEye Mission Language with mission compilation, authority envelopes, plans, status snapshots, receipt references, and Guard-compatible templates.

Build 5 needs the first app/server surface so these foundations can be exposed through a ChatGPT App / MCP Server Host Shell direction without adding production capabilities or live execution.

## Decision

Implement `@stealtheye/app-host` as a TypeScript package that models an MCP-style host shell with app metadata, tool descriptors, input/output schemas, resource descriptors, fixture-backed handlers, and eval-style tests.

The shell exposes only read-only, fixture-only, or preview-only tools for host health/capabilities, Mission OS validation/compile/preview/status, Guard decision/receipt previews, Agent Registry validation/diff/trust previews, and policy/hard-stop summaries.

Do not wire live repository mutation, worker execution, browser automation, production deployment, secret access, money movement, customer-data workflows, remote manifest fetching, production credentials, or durable production state in this build.

## Consequences

The repository now has a first typed app-host adapter layer that can later be wired to the official MCP SDK or ChatGPT App runtime. It provides a testable contract for safe tool descriptors, boundaries, resource descriptors, and preview handlers while preserving public/private and hard-stop boundaries.

This remains foundation work. It is not a production app, not a deployed MCP server, not a worker fleet, not a browser automation layer, not a repo mutation service, and not a credential broker.

## Revisit triggers

Revisit when adding official MCP SDK runtime integration, ChatGPT Apps SDK metadata, authenticated app sessions, durable Mission OS storage, Worker Fleet execution, Tool Router runtime, BrowserOps, CodeOps mutation tools, receipt ledger persistence, Secrets Broker integration, production capability issuance, remote MCP discovery, or formal OAuth/client registration.
