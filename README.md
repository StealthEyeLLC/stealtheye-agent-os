# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 4: Mission OS + StealthEye Mission Language**. The repo includes the Build 2 Agent Registry package, Build 3 Guard package, and the first Mission OS foundation package for typed mission-language objects, normalized mission schemas, authority-envelope production, mission plans, status inspection, receipt references, Guard capability-token templates, requested-action generation, public fixtures, and Vitest eval-style coverage.

This is still foundation work. It does not implement production app servers, production workers, persistent Postgres state, Redis queues, production endpoints, real credential handling, deployment automation, customer-data workflows, money movement, production deploys, or private infrastructure.

## Repo posture

This is a public-visible, locked-down build repo. Do not assume open contribution by default. The project has not selected a final license and should not be described as formally open source unless a license is added later.

Public repo content may include architecture docs, public specs, non-secret schemas, scaffolding, mock examples, eval templates, governance docs, and compliance planning. Private systems must hold secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive operational runbooks.

## Core architecture summary

The default direction is a TypeScript monorepo with Node.js MCP servers, Postgres durable mission/control/evidence state, Redis + BullMQ worker queues, S3/R2-compatible artifact storage, GitHub App repository auth, Playwright BrowserOps, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card schemas. Temporal is reserved as a future workflow-orchestration upgrade path.

Major subsystems are Mission OS, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps, Observability, and the domain ops apps.

## Agent Registry package

`packages/agent-registry` provides signed agent/tool manifest primitives, canonical JSON and SHA-256 digests, Ed25519 helpers, manifest diffing, in-memory trust registry, revocation, fixtures, and tests.

## Guard package

`packages/guard` provides capability-token, requested-action, Guard decision, and Guard decision receipt primitives, deterministic policy checks, hard-stop evaluation, registry trust enforcement, fixtures, and tests.

## Mission OS package

`packages/mission-os` provides:

- StealthEye Mission Language schema and JSON Schema exports.
- Normalized mission, authority-envelope, plan, status, and receipt-reference schemas.
- Compiler from Mission Language into missions, authority envelopes, plans, status snapshots, receipt expectations, Guard capability-token templates, and Guard requested-action templates.
- Lightweight plan/DAG primitives with dependencies and expected effects.
- Status transition, blocker, next-action, and completion-readiness helpers.
- Public-safe fixtures for repo feature, CI repair, browser QA, hard-stop production deploy, hard-stop money movement, invalid target constraints, and missing verification plan scenarios.

## Local verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-secret project context.
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/AUTONOMY_MODEL.md](docs/AUTONOMY_MODEL.md), [docs/MISSION_OS.md](docs/MISSION_OS.md), [docs/AGENT_REGISTRY.md](docs/AGENT_REGISTRY.md), and [docs/CUSTOM_APPS.md](docs/CUSTOM_APPS.md) before implementation work.
- Treat GitHub issue #1, “Master plan: StealthEye Agent OS max-leverage app suite,” as the canonical planning anchor.

## Next build target

Build 5 should implement **ChatGPT App / MCP Server Host Shell** so Mission OS can be exposed through an app/server interface while preserving Guard, registry, receipt, and public/private boundaries.
