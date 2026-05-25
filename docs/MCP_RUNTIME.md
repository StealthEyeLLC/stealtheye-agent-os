# MCP Runtime

Build 10 adds `@stealtheye/mcp-runtime`, the first runnable local/dev runtime surface for StealthEye Agent OS.

## Scope

The package exposes the existing safe `@stealtheye/app-host` tools through a deterministic in-process MCP-style server abstraction. It supports tool listing, tool calls, resource listing, resource reads, health, capabilities, runtime metadata, dev-mode connection metadata, and public-safe receipt previews.

## Exposed tool families

Build 10 exposes only App Host safe tools: host health and capabilities, Mission OS validation/compile/preview/status preview, Guard preview and receipt preview, Registry validation/diff/trust preview, and policy summaries.

Every exposed descriptor includes read-only annotations, preview/fixture metadata, risk tier, allowed effects, hard-stop categories, receipt expectations, evidence expectations, and disabled live capability status.

## Boundary

Build 10 does not add live writes, live CodeOps mutation, branch creation, commits, PR creation, live CI reruns, live BrowserOps execution, credentialed browsing, worker execution, durable receipt storage, production mutation, secret access, money movement, customer workflows, OAuth production credentials, deployment, or public app submission.

## SDK gap

The OpenAI Apps SDK documentation describes MCP as the backbone for ChatGPT Apps and says a minimal MCP server lists tools, calls tools, and can return resources/components; it also notes transport can be Server-Sent Events or Streamable HTTP, with Streamable HTTP recommended. Build 10 intentionally implements an MCP-style local/dev wrapper rather than a full official SDK transport. Future work can wire this package to the official SDK without changing the App Host safety contract.

## Verification

Run through CI:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check
```

<!-- BEGIN BUILD 11 ADDITIVE UPDATE -->

## Build 11 additive update: repo/status runtime tools

Build 11 adds read-only repo/status tools to `@stealtheye/mcp-runtime` through `packages/mcp-runtime/src/repo-status-adapter.ts`.

The runtime now lists and calls `repo.status.summary`, `repo.metadata.read`, `repo.branch.read`, `repo.pr.list`, `repo.pr.read`, `repo.issue.list`, `repo.issue.read`, `repo.workflow.status.read`, `repo.file.metadata.read`, and `repo.file.content.read`.

These tools are read-only, non-destructive, `liveWrite: false`, and return Guard/policy-backed receipt previews. They do not expose branch creation, file writes, commits, PR or issue mutation, CI reruns, workflow dispatch, browser execution, credentials, deployment, money movement, production mutation, private repository access, or customer-data workflows.

Additional Build 11 verification:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check
```

<!-- END BUILD 11 ADDITIVE UPDATE -->

<!-- BEGIN BUILD 12 ADDITIVE UPDATE -->

## Build 12 additive update: Memory Graph Foundations

Build 12 adds `@stealtheye/memory-graph` as a fixture-only, deterministic, in-memory foundation for typed memory nodes, typed relationships, provenance/source refs, evidence and receipt refs, confidence, recency, retention hints, query helpers, compaction helpers, retention reports, and public-safe context summaries.

Build 12 also exposes MCP Runtime preview tools for `memory.graph.preview`, `memory.node.search.preview`, `memory.context.preview`, and `memory.retention.preview`. These tools are read-only, preview-only, fixture-only, non-destructive, no-storage, no-embeddings, and no-live-write.

The Build 12 phase spec sets `strictGeneratedSync: true`, and CI must run:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check
```

Build 12 does not add a production database, vector database, embeddings provider, cloud storage, private knowledge ingestion, durable personal memory, live memory service, live writes, production mutation, or secret storage.

Next target after Build 12: **Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts**.

<!-- END BUILD 12 ADDITIVE UPDATE -->
