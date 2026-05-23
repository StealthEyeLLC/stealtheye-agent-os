# Mission OS

Mission OS turns broad user goals into structured, validated, authority-aware mission objects. Build 5 exposes those objects through the preview-only App Host shell.

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

`packages/app-host` uses Mission OS through preview-only tools:

- `mission.validate` validates Mission Language;
- `mission.compile` compiles Mission Language into normalized mission structures;
- `mission.preview` previews authority envelope, plan, status, receipt expectations, and requested-action templates;
- `mission.status.preview` previews status summaries, blockers, next actions, and completion readiness.

These tools do not execute missions, issue credentials, run workers, create branches, mutate repositories, automate browsers, deploy software, or access secrets/customer data.

## StealthEye Mission Language

Mission Language is a typed JSON/YAML-like structure for now. It does not implement a general parser. It represents mission goal, targets, authority, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

## Authority envelopes

Authority envelopes are mission-scoped authority structures. They are not production credentials. They can produce capability-token-compatible templates for Guard but do not issue production auth or secrets.

Authority envelopes include mission id, allowed/denied/forbidden effects, hard stops, target constraints, tool/manifest constraints, validity window, usage constraints, evidence requirements, receipt requirements, escalation requirements, and autonomy level.

## Guard integration

Mission OS imports Guard primitives rather than duplicating Guard policy logic. It produces structures that Guard can evaluate:

- capability-token-compatible templates from authority envelopes;
- requested-action objects from mission plan steps;
- fixtures showing a safe repo write allowed by Guard with matching authority;
- fixtures showing hard-stop production deploy actions requiring escalation or denial.

## Planning model

Mission plans contain ordered steps with dependencies. This is plan structure only. It does not build Worker Fleet, queueing, durable leases, retries, idempotent workers, or runtime orchestration.

## Status model

Mission statuses include draft, planned, awaiting_authority, authorized, running, blocked, completed, failed, and canceled. Build 4 includes transition validation, blocker identification, next-action summaries, and completion-readiness checks.

## Receipt references

Build 4 stores mission-level references to Guard decisions, registry decisions, pull requests, CI runs, artifacts, and final reports. Build 5 can preview those structures through App Host resources and tools. It does not implement the full receipt ledger yet.

## Public/private boundary

Fixtures are fake and public-safe. This package does not include real secrets, production endpoints, customer data, internal OAuth clients, real cloud/account identifiers, sensitive runbooks, production tokens, live deployment targets, money movement, or production deploy automation.

## Next step

Build 6 should implement Worker Fleet foundations while preserving Mission OS authority boundaries and Guard-gated execution.
