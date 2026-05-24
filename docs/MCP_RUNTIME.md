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
