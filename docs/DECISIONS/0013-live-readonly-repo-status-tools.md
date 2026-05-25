# ADR 0013: Live Read-Only Repo/Status Tools

## Status

Accepted for Build 11.

## Context

Build 10 introduced a local/dev MCP-style runtime that exposed preview-safe and fixture-backed App Host tools. Build 11 needs the first step beyond fixture-only previews: a limited live observation surface for the public GitHub repository, while preserving the project hard stops around mutation, credentials, private data, production systems, and external effects.

## Decision

Add `@stealtheye/repo-status` as the owner of public GitHub repository/status observation contracts. Integrate it into `@stealtheye/mcp-runtime` as read-only repo/status tools.

The implementation includes:

- Zod schemas for repository targets, client config, repository/branch/PR/issue/workflow/file summaries, status packets, policy results, and receipt previews.
- Deterministic read-only policy helpers that allow only explicit public-read effects.
- Guard adapter integration with a mission-scoped read-only capability token and registry trust checks.
- Public-safe receipt previews using Receipts + Replay event contracts.
- Fixture client coverage for CI.
- Optional public unauthenticated GitHub REST client constrained to GET requests against `https://api.github.com` for an explicit public repository allowlist.

## Boundaries

Build 11 does not add branch creation, file writes, commits, PR creation or mutation, issue mutation, CI reruns, workflow dispatch, repository settings mutation, secret access, private repository access, browser execution, deployment, money movement, production mutation, or customer-data workflows.

CI remains fixture-backed or mocked and does not require credentials or live network stability.

## Consequences

The runtime can now summarize public repository status through Guard and receipt previews. This is the first live-capable read-only surface, but not a production deployment, durable ledger, public app submission, or write-capable automation layer.

## Next

Build 12 should start Memory Graph work using the Build 11 public-safe read/status pattern as a reference for bounded observation and receipt generation.
