# ADR 0008: Worker Fleet Foundation

## Status

Accepted

## Context

Builds 2 through 5 established Agent Registry, Guard, Mission OS, and App Host package foundations. The next architectural need is a durable execution contract that can later support mission-step execution, retries, leases, status updates, artifacts, receipts, and Guard-gated authority outside a single chat turn.

The project is still in public-safe foundation mode. Worker Fleet must define typed contracts and deterministic helpers without introducing live Redis/BullMQ queues, production workers, live tool execution, browser automation, repository mutation, private infrastructure, secret access, production deployment, customer data, or money movement.

## Decision

Implement `@stealtheye/worker-fleet` as a TypeScript package with Zod schemas, JSON Schema exports, fixtures, and eval-style Vitest tests for:

- worker task models and task status/type enums;
- leases with fencing tokens and deterministic stale-update rejection;
- idempotency records, stable action fingerprints, duplicate detection, and collision detection;
- retry policy/state helpers for fixed, linear, and exponential backoff;
- task status transitions, blocker summaries, next-runnable detection, completion readiness, and mission worker summaries;
- worker artifact references and worker receipt events;
- Guard preflight integration that evaluates requested actions and returns receipt/status suggestions without executing work;
- Mission OS plan-to-worker-task conversion preserving mission, plan, step, dependencies, and requested-action context.

## Consequences

Worker Fleet now has a package-level durable execution model that future runtime implementations can persist and enforce. Mission OS can hand plan steps to worker tasks, and Guard can preflight action-bearing tasks before any future executor runs them.

This intentionally remains non-runtime foundation work. There is no live queue, no distributed lock, no storage backend, no production worker, no live tool execution, and no real artifact persistence yet.

The new test fixtures become the first Worker Fleet eval-style cases for normal mission-step tasks, Guard allow/block paths, untrusted registry blocking, retryable and non-retryable failures, stale lease rejection, idempotency duplicate/collision behavior, receipt events, artifact references, and public-safe fixture checks.

## Revisit triggers

Revisit this decision when adding a real queue backend, Postgres/Temporal/BullMQ persistence, production worker processes, live CodeOps/BrowserOps/CI Repair executors, durable artifact storage, receipt ledger persistence, worker observability, distributed lease coordination, concurrency controls, or Secrets Broker integration.
