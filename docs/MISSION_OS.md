# Mission OS

Mission OS turns broad user goals into structured, validated, authority-aware mission objects. Build 5 exposes those objects through the preview-only App Host shell. Build 6 hands Mission OS plan steps to Worker Fleet task contracts. Build 7 associates CodeOps patch plans and CI Repair plans with mission/task identity for future mission-to-code handoff.

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

## Build 7 CodeOps and CI Repair handoff

`packages/codeops` models future branch-safe repository work and CI repair loops as mission-bound contracts. Patch plans include `mission_id` and `task_id`, repository target, file-change contracts, verification plan, rollback notes, evidence refs, receipt refs, risk tier, and status. CI repair plans include mission/task refs, CI summary refs, failure categories, suspected files, proposed patch plans, verification commands, rerun eligibility, evidence refs, receipt refs, risk tier, and status.

CodeOps can create Guard requested actions and Worker Fleet task templates for future repo read, branch write, commit branch, open PR, CI read, failed-job rerun, and receipt-write steps. This does not execute live GitHub mutation or live CI reruns.

## StealthEye Mission Language

Mission Language is a typed JSON/YAML-like structure for now. It does not implement a general parser. It represents mission goal, targets, authority, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

## Authority envelopes

Authority envelopes are mission-scoped authority structures. They are not production credentials. They can produce capability-token-compatible templates for Guard but do not issue production auth or secrets.

Authority envelopes include mission id, allowed/denied/forbidden effects, hard stops, target constraints, tool/manifest constraints, validity window, usage constraints, evidence requirements, receipt requirements, escalation requirements, and autonomy level.

## Guard integration

Mission OS imports Guard primitives rather than duplicating Guard policy logic. It produces structures that Guard can evaluate: capability-token-compatible templates from authority envelopes, requested-action objects from mission plan steps, safe repo-write fixtures, and hard-stop production-deploy fixtures. Build 6 Worker Fleet calls Guard preflight on action-bearing tasks before any future executor can run. Build 7 CodeOps uses Guard requested actions and preflight summaries for future CodeOps/CI Repair steps.

## Planning model

Mission plans contain ordered steps with dependencies. Build 6 maps those dependencies to Worker Fleet task dependencies. Build 7 patch and repair plans can be attached to mission tasks for future repo and CI repair steps. The planning model remains structure only; full Workflow Compiler execution is still deferred.

## Status model

Mission statuses include draft, planned, awaiting_authority, authorized, running, blocked, completed, failed, and canceled. Build 4 includes transition validation, blocker identification, next-action summaries, and completion-readiness checks. Worker Fleet adds package-level task summaries for future worker execution state. CodeOps and CI Repair add package-level status fields for patch and repair plans.

## Receipt references

Build 4 stores mission-level references to Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. Build 5 can preview those structures through App Host resources and tools. Build 6 adds worker receipt event expectations and artifact references at the task layer. Build 7 adds patch plan, file-change, verification plan, CI summary, repair plan, PR evidence, and CodeOps preflight receipt expectations. The full receipt ledger is still deferred.

## Public/private boundary

Fixtures are fake and public-safe. This package does not include real secrets, production endpoints, customer data, internal OAuth clients, real cloud/account identifiers, sensitive runbooks, production tokens, live deployment targets, money movement, production deploy automation, live worker queues, live repo mutation, live CI reruns, or production worker runtime.

## Next step

Build 8 should implement BrowserOps foundations while preserving Mission OS authority boundaries, Worker Fleet task contracts, CodeOps/CI Repair evidence boundaries, and Guard-gated execution.
