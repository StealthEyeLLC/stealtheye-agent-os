# StealthEye Agent OS

StealthEye Agent OS is the foundation for a max-leverage autonomous-agent operating system: authorized online-task execution, durable workers, mission-scoped authority, signed manifests, receipts, evals, and compliance-ready evidence. It is intended to support broad delegated autonomy across code, browser, research, product, customer, inbox, commerce, and operational workflows—not only code automation.

## Current status

This repository is at **Build 1: Foundation Scaffold**. The current branch establishes public architecture, governance, autonomy, evidence, security, compliance, and build-process documentation. It does not yet implement production app code, production workers, production endpoints, or real credential handling.

## Repo posture

This is a public-visible, locked-down build repo. Do not assume open contribution by default. The project has not selected a final license and should not be described as formally open source unless a license is added later.

Public repo content may include architecture docs, public specs, non-secret schemas, scaffolding, mock examples, eval templates, governance docs, and compliance planning. Private systems must hold secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive operational runbooks.

## Core architecture summary

The default direction is a TypeScript monorepo with Node.js MCP servers, Postgres durable mission/control/evidence state, Redis + BullMQ worker queues, S3/R2-compatible artifact storage, GitHub App repository auth, Playwright BrowserOps, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card schemas. Temporal is reserved as a future workflow-orchestration upgrade path.

Major subsystems are Mission OS, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps, Observability, and the domain ops apps.

## Orientation

- Start with [AGENTS.md](AGENTS.md) for operational rules.
- Use [llms.txt](llms.txt) for a concise LLM index and [llms-full.txt](llms-full.txt) for expanded non-secret project context.
- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/AUTONOMY_MODEL.md](docs/AUTONOMY_MODEL.md), and [docs/CUSTOM_APPS.md](docs/CUSTOM_APPS.md) before implementation work.
- Treat GitHub issue #1, “Master plan: StealthEye Agent OS max-leverage app suite,” as the canonical planning anchor.

## Next build target

Build 2 should implement the **Agent Registry + Signed Manifests** foundation: schemas, signature model, manifest pinning/diffing, trust registry, revocation model, and initial eval fixtures.
