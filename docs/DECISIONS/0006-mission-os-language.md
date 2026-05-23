# ADR 0006: Mission OS and StealthEye Mission Language

## Status

Accepted

## Context

StealthEye Agent OS needs a durable way to turn broad user goals into structured, validated, authority-aware mission objects. Build 2 introduced signed agent/tool metadata. Build 3 introduced Guard capability tokens and requested-action evaluation. Build 4 needs Mission OS primitives that compile mission intent into normalized missions, authority envelopes, plans, status summaries, receipt references, and Guard-compatible action templates.

This foundation must remain public-safe. It must not add production app servers, live worker queues, real credentials, production endpoints, money movement, production deploys, customer data, private OAuth clients, real cloud/account identifiers, production tokens, or sensitive operational runbooks.

## Decision

Implement an `@stealtheye/mission-os` TypeScript package with Zod schemas and JSON Schema exports for StealthEye Mission Language, normalized missions, authority envelopes, mission plans, status snapshots, and receipt references.

Mission Language is a typed JSON/YAML-like object model for now, not a full parser. It expresses mission goal, targets, allowed effects, hard stops, verification commands, browser flows, evidence requirements, receipt requirements, risk tier, autonomy level, execution constraints, stop conditions, and final-report requirements.

Mission OS compiles Mission Language into normalized mission objects, authority envelopes, capability-token-compatible templates, mission plans, status summaries, receipt expectations, and Guard requested-action templates. Guard remains responsible for policy decisions; Mission OS does not duplicate Guard enforcement logic.

## Consequences

The project now has a package-level Mission OS foundation for validated mission structure, authority-envelope production, lightweight plan/DAG primitives, status inspection, receipt references, and Guard integration points. Tests cover valid and invalid Mission Language, mission compilation, authority-envelope generation, token-compatible data, step dependencies, requested-action generation, Guard allow/escalate behavior, status transitions, receipt preservation, and public-safe fixtures.

This is still foundation work. It does not provide a production app server, MCP server, durable database, worker fleet, receipt ledger, live credentials, production deployment path, or customer-data workflow.

## Revisit triggers

Revisit when adding ChatGPT App/MCP Server Host Shell, Mission OS persistence, durable receipt ledger, Workflow Compiler integration, Worker Fleet execution, BrowserOps runtime hooks, production capability issuance, Secrets Broker integration, full mission-language parser, or formal policy-language support.

## Evals / fixtures

Initial eval-style fixtures include normal repo feature mission, CI repair mission, browser QA mission, hard-stop production deploy mission, hard-stop money movement mission, invalid target constraints mission, and missing verification plan mission. Future eval runners should attach fixture metadata, scenario ids, expected receipts, and regression dashboards.
