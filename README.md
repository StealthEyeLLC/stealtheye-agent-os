# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 3: Guard + Capability Tokens**. The repo includes the Build 2 Agent Registry package plus the first Guard foundation package for mission-scoped capability tokens, requested-action schemas, deterministic policy checks, hard-stop evaluation, registry trust enforcement, lifecycle helpers, receipt shapes, public fixtures, and Vitest eval-style coverage.

This is still foundation work. It does not implement production app servers, production workers, persistent Postgres state, Redis queues, production endpoints, real credential handling, deployment automation, customer-data workflows, money movement, production deploys, or private infrastructure.

## Repo posture

This is a public-visible, locked-down build repo. Do not assume open contribution by default. The project has not selected a final license and should not be described as formally open source unless a license is added later.

Public repo content may include architecture docs, public specs, non-secret schemas, scaffolding, mock examples, eval templates, governance docs, and compliance planning. Private systems must hold secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive operational runbooks.

## Core architecture summary

The default direction is a TypeScript monorepo with Node.js MCP servers, Postgres durable mission/control/evidence state, Redis + BullMQ worker queues, S3/R2-compatible artifact storage, GitHub App repository auth, Playwright BrowserOps, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card schemas. Temporal is reserved as a future workflow-orchestration upgrade path.

Major subsystems are Mission OS, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps, Observability, and the domain ops apps.

## Agent Registry package

`packages/agent-registry` provides:

- Zod schemas and JSON Schema exports for signed agent cards, signed tool manifests, and trust registry snapshots.
- Deterministic canonical JSON and SHA-256 digests for unsigned payloads.
- Ed25519 signing/verification helpers using Node crypto.
- Risk-relevant diff output for review and future Guard UI.
- In-memory trust registry and revocation model.
- Public test fixtures with generated local test keys only; no real private keys are committed.

## Guard package

`packages/guard` provides:

- Zod schemas and JSON Schema exports for capability tokens, requested actions, Guard decisions, and Guard decision receipts.
- Mission-scoped capability-token lifecycle helpers for active, expired, revoked, suspended, and exhausted states.
- Deterministic token-to-action matching across effects, repo, branch, path, environment, system, account, agent, manifest, and pinned digest constraints.
- Hard-stop evaluation for deletion/destruction, raw secrets, money/billing, production deployment/data mutation, production-impacting migrations, auth/security-critical changes, protected branch mutation, force push/history rewrite, CI/test/security weakening, material external sends, legal commitments, and platform-required confirmations.
- Registry trust summary enforcement for trusted and approved signed agent/tool metadata.
- Receipt-friendly Guard decision and receipt shapes.

## Local verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-secret project context.
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/AUTONOMY_MODEL.md](docs/AUTONOMY_MODEL.md), [docs/AGENT_REGISTRY.md](docs/AGENT_REGISTRY.md), and [docs/CUSTOM_APPS.md](docs/CUSTOM_APPS.md) before implementation work.
- Treat GitHub issue #1, “Master plan: StealthEye Agent OS max-leverage app suite,” as the canonical planning anchor.

## Next build target

Build 4 should implement **Mission OS + StealthEye Mission Language**: mission schema, mission DSL/CML primitives, authority-envelope production, lifecycle state, status inspection, plan/receipt references, and integration with Guard decisions.
