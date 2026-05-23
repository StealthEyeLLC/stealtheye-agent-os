# Architecture

StealthEye Agent OS is organized as a public-safe TypeScript monorepo for mission-scoped autonomous online work. Current packages are contracts and deterministic helpers; production runtimes remain future work.

## Core components

- App Host: ChatGPT App / MCP host descriptors and preview-only fixture tools.
- Mission OS: Mission Language, normalized missions, authority envelopes, plans, status, and receipt refs.
- Agent Registry: signed manifest, digest, trust, diff, and revocation primitives.
- Guard: capability-token, requested-action, hard-stop, registry-trust, policy-decision, and receipt primitives.
- Worker Fleet: task, lease, idempotency, retry, artifact, receipt event, and Guard preflight contracts.
- CodeOps: repository and CI repair contracts for branch-safe patch/verification/PR evidence modeling.
- BrowserOps: fixture-only browser sessions, page observations, evidence refs, action policies, action plans, Guard preflight, and Worker Fleet handoff templates.
- Build Automation: deterministic public-safe generated build-state files under `docs/generated/`.

## BrowserOps Build 8 boundary

Build 8 stops before browser execution. BrowserOps only models fixture-safe plans and preflight outcomes. It does not launch browsers, run Playwright, visit real sites, use credentials, submit forms, send material externally, make purchases, mutate production, or perform destructive browser actions.

## Next architecture target

Build 9 — Receipts + Replay: durable receipt schemas, replay packets, evidence refs, final report packets, and verifier handoff state.
