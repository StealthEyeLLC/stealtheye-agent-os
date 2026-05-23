# ADR 0009: CodeOps and CI Repair Foundations

## Status

Accepted

## Context

Builds 2 through 6 established Agent Registry, Guard, Mission OS, App Host, and Worker Fleet package foundations. The next architectural need is a branch-safe repository operations contract and a CI repair contract that future live tools can implement without bypassing mission authority, Guard hard stops, Worker Fleet task boundaries, receipts, or public/private safety boundaries.

The project remains in public-safe foundation mode. Build 7 must define typed schemas, deterministic helpers, fixtures, and eval-style tests, while avoiding live GitHub mutation, branch creation, commits, PR creation, CI reruns, protected-branch writes, force pushes, CI weakening, secret access, deployment, browser automation, money movement, customer-data workflows, and production-impacting work.

## Decision

Implement a single coherent `@stealtheye/codeops` package containing both CodeOps and CI Repair foundations. The package defines:

- repository target schemas and branch/path policy helpers;
- structured patch plans, file-change contracts, verification plans, PR evidence packets, and stable patch-plan fingerprints;
- deterministic detection for destructive deletes, protected paths, suspicious secret-bearing paths, force push/history rewrite intent, direct protected-branch mutation, and CI/test/security weakening;
- CI log/check-run summary schemas and deterministic fixture-log classifiers;
- CI repair plan schemas and rerun eligibility helpers;
- Guard requested-action adapters for repository read, branch write, branch commit, PR open, CI read, failed-job rerun, and receipt write actions;
- Worker Fleet task templates for future CodeOps and CI Repair execution steps;
- public-safe fixtures and Vitest eval-style coverage for safe and blocked paths.

The package exports JSON Schema where practical through `zod-to-json-schema` and keeps live GitHub/API clients out of scope.

## Consequences

Future live CodeOps and CI Repair tools will have stable contracts for branch-safe work, patch planning, CI interpretation, repair planning, PR evidence, and verification loops. Guard can preflight action-bearing CodeOps tasks before execution, and Worker Fleet can model durable task handoff without executing live actions.

The build intentionally does not create live branches, commits, PRs, CI reruns, workflow dispatches, protected-branch mutations, force pushes, deployments, secret access, or production/customer-data workflows. Any future runtime must add adapters behind Guard preflight, Worker Fleet leases/idempotency, receipt emission, and expanded eval coverage.

## Revisit triggers

Revisit this ADR when:

- a live GitHub App CodeOps adapter is added;
- live CI log fetching or rerun APIs are enabled;
- persistent patch plans, repair plans, or PR evidence packets are stored in a durable ledger;
- BrowserOps starts consuming CodeOps/CI Repair evidence;
- stronger secret redaction, semantic log sanitization, or repo prompt-injection defenses are added;
- the package is split into separate CodeOps and CI Repair packages for operational reasons.
