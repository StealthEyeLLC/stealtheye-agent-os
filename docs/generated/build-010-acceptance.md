# Build 10 acceptance checklist: MCP Runtime + ChatGPT App Dev-Mode Connection

## Runtime

- `@stealtheye/mcp-runtime` exposes list tools, call tool, list resources, read resource, health, capabilities, metadata, and dev-mode connection info.
- All exposed tools are safe App Host tools.
- Tool descriptors include read-only annotations, safety metadata, allowed effects, hard stops, receipt expectations, and disabled live capability status.
- Tool calls generate public-safe receipt previews.

## Boundary

- No live writes, repo mutation, browser execution, worker execution, CI reruns, deployment, secret access, money movement, or production/customer workflow is added.
- Dev-mode metadata is public-safe and does not claim public app submission or production deployment.

## Next target

Build 11 — Live Read-Only Repo/Status Tools through Guard + Receipts.
