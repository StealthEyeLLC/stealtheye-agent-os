# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, app-host surfaces, branch-safe CodeOps, CI Repair contracts, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 7: CodeOps + CI Repair Foundations**. The repo includes the Build 2 Agent Registry package, Build 3 Guard package, Build 4 Mission OS package, Build 5 App Host package, Build 6 Worker Fleet package, and the Build 7 `@stealtheye/codeops` package for branch-safe repository-operation contracts, structured patch plans, file-change contracts, verification plans, CI log classification, repair plans, rerun policy, PR evidence, and Guard/Worker Fleet preflight adapters.

This is still foundation work. It does not implement production app servers, production workers, persistent Postgres state, Redis/BullMQ queues, production endpoints, real credential handling, deployment automation, customer-data workflows, money movement, production deploys, live repo mutation, branch creation, commits, PR creation, live CI reruns, browser automation, live tool execution, or private infrastructure.

## Repo posture

This is a public-visible, locked-down build repo. Do not assume open contribution by default. The project has not selected a final license and should not be described as formally open source unless a license is added later.

Public repo content may include architecture docs, public specs, non-secret schemas, scaffolding, mock examples, eval templates, governance docs, app-host preview descriptors, Worker Fleet foundation contracts, CodeOps/CI Repair foundation contracts, and compliance planning. Private systems must hold secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive operational runbooks.

## Core architecture summary

The default direction is a TypeScript monorepo with Node.js MCP servers, Postgres durable mission/control/evidence state, Redis + BullMQ worker queues, S3/R2-compatible artifact storage, GitHub App repository auth, Playwright BrowserOps, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card/worker/codeops schemas. Temporal is reserved as a future workflow-orchestration upgrade path.

Major subsystems are Mission OS, App Host, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps, Observability, and the domain ops apps.

## Foundation packages

- `packages/agent-registry` provides signed agent/tool manifest primitives, canonical JSON and SHA-256 digests, Ed25519 helpers, manifest diffing, in-memory trust registry, revocation, fixtures, and tests.
- `packages/guard` provides capability-token, requested-action, Guard decision, and Guard decision receipt primitives, deterministic policy checks, hard-stop evaluation, registry trust enforcement, fixtures, and tests.
- `packages/mission-os` provides Mission Language schemas, normalized missions, authority envelopes, plans, status snapshots, receipt references, Guard-compatible templates, fixtures, and tests.
- `packages/app-host` provides app/server metadata, MCP-style preview-only tool descriptors, static resource descriptors, fixture-backed handlers, and eval-style tests proving no live write/destructive tools are exposed.
- `packages/worker-fleet` provides typed worker task, lease, idempotency, retry, status, artifact, receipt event, Guard preflight, and Mission OS plan-handoff foundations.
- `packages/codeops` provides CodeOps + CI Repair schemas, branch/path safety helpers, patch-plan and file-change contracts, verification obligations, CI log classification, repair planning, rerun policy, PR evidence packets, fixtures, and tests. It creates future-action models only; it does not execute live GitHub operations.

## Local verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-secret project context.
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/AUTONOMY_MODEL.md](docs/AUTONOMY_MODEL.md), [docs/CODEOPS.md](docs/CODEOPS.md), [docs/CI_REPAIR.md](docs/CI_REPAIR.md), [docs/WORKER_FLEET.md](docs/WORKER_FLEET.md), [docs/APP_HOST.md](docs/APP_HOST.md), [docs/MISSION_OS.md](docs/MISSION_OS.md), [docs/AGENT_REGISTRY.md](docs/AGENT_REGISTRY.md), and [docs/CUSTOM_APPS.md](docs/CUSTOM_APPS.md) before implementation work.
- Treat GitHub issue #1, “Master plan: StealthEye Agent OS max-leverage app suite,” as the canonical planning anchor.

## Next build target

Build 8 should implement **BrowserOps** foundations: isolated browser observation contracts, page/action policy schemas, screenshot/DOM/console/network evidence references, Guard-gated browser action models, and Worker Fleet handoff without money movement, destructive actions, production mutation, or material external sends.

<!-- BEGIN BUILD 8 ADDITIVE UPDATE -->

## Build 8 additive update: BrowserOps and build automation

This branch advances the repository to **Build 8 — BrowserOps Foundations + Minimal Build Automation Engine** while preserving the accumulated Build 1–7 architecture and operating rules above.

Build 8 adds `@stealtheye/browserops` as a fixture-only package for browser sessions, page observations, browser evidence references, action policies, action plans, Guard preflight, and Worker Fleet `future_browserops` task templates. It also adds `scripts/stealtheye-build.mjs` with `scripts/phases/build-008-browserops.mjs` to generate/check public-safe build state under `docs/generated/`.

Additional verification for Build 8:

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

The Build 8 implementation still does not add live browser automation, Playwright runtime execution, credentialed browsing, real website interaction, material external sends, purchases/payments, destructive actions, production mutation, secret access, private endpoints, customer-data workflows, or private infrastructure.

Next target after Build 8: **Build 9 — Receipts + Replay**.

<!-- END BUILD 8 ADDITIVE UPDATE -->
