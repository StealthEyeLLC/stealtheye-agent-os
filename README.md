# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 2: Agent Registry + Signed Manifests**. The repo now includes the first concrete TypeScript package foundation for signed agent cards, signed tool manifests, deterministic canonicalization, SHA-256 digesting, Ed25519 verification primitives, manifest diffing, an in-memory trust registry, revocation checks, public test fixtures, and Vitest coverage.

This is still foundation work. It does not implement production app servers, production workers, persistent Postgres state, Redis queues, production endpoints, real credential handling, deployment automation, or customer-data workflows.

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

Build 3 should implement **Guard + Capability Tokens**: authority token schemas, policy checks, hard-stop evaluation, Guard decision receipts, and integration points for Agent Registry verification.
