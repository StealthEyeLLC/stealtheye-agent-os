# ADR 0011: Receipts + Replay foundation

## Status

Accepted for Build 9.

## Context

StealthEye Agent OS needs a replayable evidence layer before live execution layers are enabled. Prior builds produced receipt-friendly structures across Guard, Mission OS, App Host, Worker Fleet, CodeOps, CI Repair, BrowserOps, and generated build state, but there was no unified package for receipt events, evidence references, replay packets, verification packets, and final reports.

## Decision

Build 9 adds `@stealtheye/receipts-replay` as a foundation-only package. It models public-safe receipt events, evidence refs, receipt bundles, mission timelines, side-effect-free replay packets, verification packets, final report packets, and deterministic integrity digests. It includes adapters from existing subsystem fixtures without duplicating subsystem logic.

The build automation engine remains source-controlled and local: Build 9 adds `scripts/phases/build-009-receipts-replay.mjs` and generated state under `docs/generated/`. Hand-authored docs remain protected by marker-bounded update sections.

## Consequences

Missions can be summarized and replayed from references without live infrastructure. Verifiers get typed packets for what happened, what evidence supports it, what was denied or escalated, which checks ran, and what remains incomplete.

## Non-goals

Build 9 does not add a durable database, production ledger, live artifact storage, live replay executor, live browser execution, live CodeOps mutation, CI reruns, production mutation, money movement, secret access, customer-data workflows, or private infrastructure.

## Next

Build 10 should implement Memory Graph foundations and connect non-secret project memory to receipt/replay references.
