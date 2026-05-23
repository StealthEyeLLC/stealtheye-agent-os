# Mission OS

Mission OS turns broad user goals into structured, validated, authority-aware mission objects. Build 5 exposes those objects through the preview-only App Host shell. Build 6 hands Mission OS plan steps to Worker Fleet task contracts.

## Build 4 implementation

`packages/mission-os` provides package-level Mission OS primitives:

- StealthEye Mission Language schema and JSON Schema export;
- normalized mission schema with lifecycle status, priority, autonomy level, targets, constraints, risk, verification, receipts, artifacts, and final-report expectations;
- authority-envelope schema aligned with `@stealtheye/guard` capability-token fields;
- compiler from Mission Language to normalized mission, authority envelope, mission plan, status snapshot, receipt expectations, capability-token template, and Guard requested-action templates;
- lightweight plan/DAG primitives with step dependencies and expected effects;
- requested-action generation from plan steps for Guard evaluation;
- mission status transition, blocker, next-action, and completion-readiness helpers;
- mission-level receipt and artifact reference helpers;
- public-safe fixtures and Vitest eval-style cases.

## Build 5 App Host exposure

`packages/app-host` uses Mission OS through preview-only tools: `mission.validate`, `mission.compile`, `mission.preview`, and `mission.status.preview`. These tools do not execute missions, issue credentials, run workers, create branches, mutate repositories, automate browsers, deploy software, or access secrets/customer data.

## Build 6 Worker Fleet handoff

`packages/worker-fleet` consumes Mission OS `MissionPlan` and `MissionPlanStep` objects and converts each step into a worker task. The handoff preserves `mission_id`, `plan_id`, `step_id`, title, description, dependencies, receipt refs, capability-token refs, and requested-action context generated from plan-step expected effects.

Worker Fleet uses this handoff to model future durable execution. It does not replace Mission OS planning and does not execute mission steps in Build 6.

## StealthEye Mission Language

Mission Language is a typed JSON/YAML-like structure for now. It does not implement a general parser. It represents mission goal, targets, authority, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

## Authority envelopes

Authority envelopes are mission-scoped authority structures. They are not production credentials. They can produce capability-token-compatible templates for Guard but do not issue production auth or secrets.

Authority envelopes include mission id, allowed/denied/forbidden effects, hard stops, target constraints, tool/manifest constraints, validity window, usage constraints, evidence requirements, receipt requirements, escalation requirements, and autonomy level.

## Guard integration

Mission OS imports Guard primitives rather than duplicating Guard policy logic. It produces structures that Guard can evaluate: capability-token-compatible templates from authority envelopes, requested-action objects from mission plan steps, safe repo-write fixtures, and hard-stop production-deploy fixtures. Build 6 Worker Fleet calls Guard preflight on action-bearing tasks before any future executor can run.

## Planning model

Mission plans contain ordered steps with dependencies. Build 6 maps those dependencies to Worker Fleet task dependencies. The planning model remains structure only; full Workflow Compiler execution is still deferred.

## Status model

Mission statuses include draft, planned, awaiting_authority, authorized, running, blocked, completed, failed, and canceled. Build 4 includes transition validation, blocker identification, next-action summaries, and completion-readiness checks. Worker Fleet adds package-level task summaries for future worker execution state.

## Receipt references

Build 4 stores mission-level references to Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. Build 5 can preview those structures through App Host resources and tools. Build 6 adds worker receipt event expectations and artifact references at the task layer. It does not implement the full receipt ledger yet.

## Public/private boundary

Fixtures are fake and public-safe. This package does not include real secrets, production endpoints, customer data, internal OAuth clients, real cloud/account identifiers, sensitive runbooks, production tokens, live deployment targets, money movement, production deploy automation, live worker queues, or production worker runtime.

## Next step

Build 7 should implement CodeOps + CI Repair foundations while preserving Mission OS authority boundaries, Worker Fleet task contracts, and Guard-gated execution.
