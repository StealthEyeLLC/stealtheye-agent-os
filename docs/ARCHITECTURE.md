# Architecture

StealthEye Agent OS is organized as a set of mission, control, tool, worker, evidence, and governance layers. The system should enable high autonomy without erasing authority boundaries.

## Default stack

- TypeScript monorepo.
- Node.js MCP servers.
- Postgres for durable mission, control, and evidence state.
- Redis + BullMQ for initial worker queues.
- Temporal as a future workflow-orchestration upgrade path.
- S3/R2-compatible artifact storage.
- GitHub App auth for future repository operations.
- Playwright for future BrowserOps.
- OpenAI Responses API + Apps SDK integration.
- Zod + JSON Schema for mission, tool, workflow, receipt, authority, agent-card, Guard, Mission OS, App Host, Worker Fleet, CodeOps, and CI Repair schemas.

## Core components

### App Host
Owns the first ChatGPT App / MCP Server Host Shell surface. Build 5 implements `@stealtheye/app-host` with app metadata, MCP-style tool descriptors, input/output schemas, static resource descriptors, fixture-backed preview handlers, and tests. It exposes only read-only, fixture-only, or preview-only tools for host, Mission OS, Guard, Agent Registry, and policy families. Build 7 does not change App Host runtime behavior.

### Mission OS
Owns mission intake, Mission Language validation, mission normalization, planning, authority envelope creation, status inspection, timeline assembly, receipt references, and final reporting expectations. Build 4 implements `@stealtheye/mission-os`. Build 6 Worker Fleet consumes Mission OS plans. Build 7 CodeOps patch plans carry `mission_id` and `task_id` for future mission-to-code handoff.

### Agent Registry
Stores and verifies signed agent cards and signed tool manifests. Build 2 implements package-level schemas, canonicalization, SHA-256 digesting, Ed25519 verification, diffing, in-memory trust records, and revocation primitives. Durable registry storage and remote MCP discovery are deferred.

### Guard
Enforces hard stops, mission authority, semantic firewall decisions, registry trust decisions, and policy checks before tool execution. Build 7 CodeOps maps branch/CI work into Guard requested actions and models denied/escalated outcomes without executing those actions.

### Capability Tokens
Represent scoped delegated authority for tools/workers. Build 3 tokens encode mission, issuer, subject, allowed/forbidden effects, hard stops, target constraints, tool/manifest constraints, validity windows, usage budgets, evidence requirements, receipt requirements, escalation requirements, digest/signature references, and lifecycle status. They are not production credentials.

### Worker Fleet
Owns durable execution contracts: worker tasks, task types/statuses, leases with fencing tokens, idempotency records, retry policy/state, status summaries, artifact references, worker receipt events, Guard preflight outcomes, and Mission OS plan-to-task handoff. Build 7 CodeOps creates Worker Fleet task templates for future CodeOps and CI Repair steps without live execution.

### CodeOps
Build 7 implements `@stealtheye/codeops` as a package-level foundation for repository targets, branch-prefix rules, protected branch detection, path allow/deny matching, structured patch plans, file-change contracts, verification plans, stable patch-plan fingerprints, PR evidence packets, Guard requested-action adapters, and Worker Fleet task templates. It does not create branches, write commits, open PRs, mutate protected branches, force push, or call live GitHub APIs.

### CI Repair
Build 7 implements CI Repair contracts inside `@stealtheye/codeops`: CI/check summaries, short public-safe log excerpts, deterministic fixture-log classification, repair plans, rerun eligibility, non-retryable reasons, and verification commands. It does not fetch live logs, rerun jobs, dispatch workflows, weaken tests, or bypass Guard.

### BrowserOps
Uses Playwright in future builds to observe and validate web flows, collect screenshots, traces, console logs, and browser QA evidence. It stops before money movement, destructive actions, auth/security-critical changes, production mutation, and material external sends.

### Receipts + Replay
Every mission emits a durable evidence ledger: timeline, mission status, authority envelopes, app-host previews, worker task lifecycle events, leases, retries, idempotency records, CodeOps patch plans, file-change contracts, verification plans, CI summaries, repair plans, PR evidence, tool calls, approvals, denials, diffs, logs, screenshots, artifacts, CI, browser QA, manifest digests, registry decisions, Guard decisions, and final report references.

### Memory Graph
Persists non-secret project memory, decisions, entities, dependencies, preferences, issue/PR links, and evidence references.

### Evals
Turns expected behavior and failures into regression suites: mission success, app-host descriptor safety, Worker Fleet leases/idempotency/retry/preflight/status behavior, CodeOps branch safety, CI Repair classification/rerun policy, tool selection, receipt accuracy, browser QA, security, prompt injection, tool poisoning, registry verification, revocation, manifest diffing, Guard policy decisions, hard stops, capability-token lifecycle, Mission Language compilation, and status transitions.

### Workflow Compiler
Compiles mission intent into executable DAGs with authority gates, retries, idempotency, artifact expectations, and receipt requirements. Build 4 provides lightweight Mission OS plan primitives; Build 6 provides Worker Fleet task contracts; Build 7 provides CodeOps/CI Repair task-template handoff. Full Workflow Compiler execution is deferred.

### Semantic Firewall
Classifies and sanitizes untrusted repo, log, browser, document, app-host input, worker artifact metadata, and tool-output content. Tool outputs cannot grant themselves authority.

### A2A Subagent Network
Future direction for delegated subagents with signed identities, scoped authority, and receipts. A2A does not bypass Guard or Agent Registry trust.

### Agent Arena
Runs agents and policies against test suites and adversarial scenarios to select safer, higher-performing execution paths.

### StagingOps and Observability
StagingOps manages preview/staging validation. Observability captures logs, metrics, traces, alerts, health, worker status, CodeOps/CI Repair evidence, and mission status with redaction.

### Domain Ops
ProductOps, InboxOps, CustomerOps, ResearchOps, and CommerceOps translate domain tasks into bounded missions. They share the same hard stops, evidence model, and public/private boundary.

## Control flow

Mission request -> App Host preview/intake surface -> Mission OS Mission Language compiler -> normalized mission -> authority envelope / capability-token template -> planned requested actions -> Worker Fleet task conversion -> Guard preflight for action-bearing tasks -> future Tool Router runtime -> future CodeOps/CI Repair/BrowserOps executors -> receipts/artifacts -> eval and final report.

## Next architecture build

Build 8 should implement BrowserOps foundations on top of Guard, Worker Fleet, CodeOps evidence, and receipt boundaries.
