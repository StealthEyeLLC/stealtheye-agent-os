# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, app-host surfaces, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 5: ChatGPT App / MCP Server Host Shell**. The repo includes the Build 2 Agent Registry package, Build 3 Guard package, Build 4 Mission OS package, and the first App Host foundation package for preview-only MCP-style tools, static resources, app metadata, fixture-backed handlers, and eval-style tests.

This is still foundation work. It does not implement production app servers, production workers, persistent Postgres state, Redis queues, production endpoints, real credential handling, deployment automation, customer-data workflows, money movement, production deploys, live repo mutation, browser automation, or private infrastructure.

## Repo posture

This is a public-visible, locked-down build repo. Do not assume open contribution by default. The project has not selected a final license and should not be described as formally open source unless a license is added later.

Public repo content may include architecture docs, public specs, non-secret schemas, scaffolding, mock examples, eval templates, governance docs, app-host preview descriptors, and compliance planning. Private systems must hold secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive operational runbooks.

## Core architecture summary

The default direction is a TypeScript monorepo with Node.js MCP servers, Postgres durable mission/control/evidence state, Redis + BullMQ worker queues, S3/R2-compatible artifact storage, GitHub App repository auth, Playwright BrowserOps, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card schemas. Temporal is reserved as a future workflow-orchestration upgrade path.

Major subsystems are Mission OS, App Host, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps, Observability, and the domain ops apps.

## Agent Registry package

`packages/agent-registry` provides signed agent/tool manifest primitives, canonical JSON and SHA-256 digests, Ed25519 helpers, manifest diffing, in-memory trust registry, revocation, fixtures, and tests.

## Guard package

`packages/guard` provides capability-token, requested-action, Guard decision, and Guard decision receipt primitives, deterministic policy checks, hard-stop evaluation, registry trust enforcement, fixtures, and tests.

## Mission OS package

`packages/mission-os` provides Mission Language schemas, normalized missions, authority envelopes, plans, status snapshots, receipt references, Guard-compatible templates, fixtures, and tests.

## App Host package

`packages/app-host` provides:

- app/server metadata for the Build 5 non-production host shell;
- MCP-style tool descriptors with input/output schemas and safety hints;
- preview-only handlers for host, mission, Guard, registry, and policy tool families;
- static resource descriptors for health, capabilities, policy, and sample mission content;
- fixture-backed execution over Agent Registry, Guard, and Mission OS primitives;
- eval-style tests proving no live write/destructive tools are exposed.

## Local verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-secret project context.
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/AUTONOMY_MODEL.md](docs/AUTONOMY_MODEL.md), [docs/APP_HOST.md](docs/APP_HOST.md), [docs/MISSION_OS.md](docs/MISSION_OS.md), [docs/AGENT_REGISTRY.md](docs/AGENT_REGISTRY.md), and [docs/CUSTOM_APPS.md](docs/CUSTOM_APPS.md) before implementation work.
- Treat GitHub issue #1, “Master plan: StealthEye Agent OS max-leverage app suite,” as the canonical planning anchor.

## Next build target

Build 6 should implement **Worker Fleet** foundations: durable task concepts, leases, idempotency, status, receipt expectations, and Guard-gated execution boundaries.
