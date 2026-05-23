# Architecture

StealthEye Agent OS is organized as a set of mission, control, tool, worker, evidence, and governance layers. The system should enable high autonomy without erasing authority boundaries.

## Default stack

- TypeScript monorepo.
- Node.js MCP servers.
- Postgres for durable mission, control, and evidence state.
- Redis + BullMQ for initial worker queues.
- Temporal as a future workflow-orchestration upgrade path.
- S3/R2-compatible artifact storage.
- GitHub App auth for repository operations.
- Playwright for BrowserOps.
- OpenAI Responses API + Apps SDK integration.
- Zod + JSON Schema for mission, tool, workflow, receipt, authority, agent-card, and Guard schemas.

## Core components

### Mission OS
Owns mission intake, planning, approval capture, authority envelope creation, status inspection, timeline assembly, and final reporting. Build 4 should turn this into concrete mission language/schema primitives.

### Agent Registry
Stores and verifies signed agent cards and signed tool manifests. Build 2 implements package-level schemas, canonicalization, SHA-256 digesting, Ed25519 verification, diffing, in-memory trust records, and revocation primitives. Durable registry storage and remote MCP discovery are deferred.

### Guard
Enforces hard stops, mission authority, semantic firewall decisions, registry trust decisions, and policy checks before tool execution. Build 3 implements `@stealtheye/guard` with schemas for capability tokens, requested actions, Guard decisions, and Guard decision receipts; deterministic policy evaluation; hard-stop evaluation; registry trust enforcement; and public-safe eval fixtures.

### Capability Tokens
Represent scoped delegated authority for tools/workers. Build 3 tokens encode mission, issuer, subject, allowed/forbidden effects, hard stops, target constraints, tool/manifest constraints, validity windows, usage budgets, evidence requirements, receipt requirements, escalation requirements, digest/signature references, and lifecycle status. They are not production credentials.

### Worker Fleet
Runs durable tasks through queues, leases, retries, idempotency keys, status reporting, and receipt emission. Redis + BullMQ is the initial queue path; Temporal is a future orchestration upgrade.

### CodeOps
Creates branches, writes scoped repo changes, commits, opens PRs, and preserves diffs. It never mutates protected branches directly.

### CI Repair
Reads workflow logs, diagnoses failures, patches branches, reruns allowed checks, and records repair evidence. It must not weaken tests, CI, or security controls.

### BrowserOps
Uses Playwright to observe and validate web flows, collect screenshots, traces, console logs, and browser QA evidence. It stops before money movement, destructive actions, auth/security-critical changes, and material external sends.

### Receipts + Replay
Every mission emits a durable evidence ledger: timeline, tool calls, inputs/outputs, approvals, denials, diffs, logs, screenshots, artifacts, CI, browser QA, manifest digests, registry decisions, Guard decisions, and final report references.

### Memory Graph
Persists non-secret project memory, decisions, entities, dependencies, preferences, issue/PR links, and evidence references.

### Evals
Turns expected behavior and failures into regression suites: mission success, tool selection, receipt accuracy, CI repair, browser QA, security, prompt injection, tool poisoning, registry verification, revocation, manifest diffing, Guard policy decisions, hard stops, and capability-token lifecycle.

### Workflow Compiler
Compiles mission intent into executable DAGs with authority gates, retries, idempotency, artifact expectations, and receipt requirements.

### Semantic Firewall
Classifies and sanitizes untrusted repo, log, browser, document, and tool-output content. Tool outputs cannot grant themselves authority.

### A2A Subagent Network
Future direction for delegated subagents with signed identities, scoped authority, and receipts. A2A does not bypass Guard or Agent Registry trust.

### Agent Arena
Runs agents and policies against test suites and adversarial scenarios to select safer, higher-performing execution paths.

### StagingOps and Observability
StagingOps manages preview/staging validation. Observability captures logs, metrics, traces, alerts, health, and mission status with redaction.

### Domain Ops
ProductOps, InboxOps, CustomerOps, ResearchOps, and CommerceOps translate domain tasks into bounded missions. They share the same hard stops, evidence model, and public/private boundary.

## Control flow

Mission request -> Mission OS -> capability token / authority envelope -> Guard requested-action evaluation -> Agent Registry trust summary enforcement -> Workflow Compiler -> Tool Router -> Worker Fleet/app tools -> receipts/artifacts -> eval and final report.

## Next architecture build

Build 4 should implement Mission OS + StealthEye Mission Language.
