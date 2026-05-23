# ADR 0003: High-autonomy mission-scoped authority

## Status

Accepted

## Context

The product goal requires broad delegated autonomy without constant approval prompts, while still preventing destructive, financial, security-critical, production, legal, and platform-required actions.

## Decision

Use mission-scoped authority envelopes. Inside approved scope, agents proceed without repeated approval for ordinary delegated actions. Guard enforces hard stops and escalates only when authority is missing or risk changes.

## Consequences

Autonomy becomes usable for real work while preserving clear safety boundaries and evidence. The system must invest early in receipts, evals, and authority schemas.

## Revisit triggers

Revisit after hard-stop eval failures, customer/legal review, platform policy changes, or production authority expansion.
