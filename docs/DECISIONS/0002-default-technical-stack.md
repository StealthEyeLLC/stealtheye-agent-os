# ADR 0002: Default technical stack

## Status

Accepted

## Context

The project needs a durable, typed, MCP-oriented foundation compatible with ChatGPT custom apps, workers, receipts, evals, and future orchestration.

## Decision

Default to TypeScript monorepo, Node.js MCP servers, Postgres, Redis + BullMQ, S3/R2 artifact storage, GitHub App auth, Playwright, OpenAI Responses API + Apps SDK, Zod + JSON Schema, and Temporal as a future orchestration upgrade path.

## Consequences

This stack is pragmatic for early implementation while keeping a path to stronger durable workflow orchestration. Initial CI must not pretend app code exists before scaffolding is added.

## Revisit triggers

Revisit after Worker Fleet scale tests, Temporal proof of concept, or app/runtime constraints require a different language or queue model.
