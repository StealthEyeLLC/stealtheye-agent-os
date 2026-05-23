# ADR 0010: BrowserOps foundation and minimal build automation engine

## Status

Accepted for Build 8.

## Context

StealthEye Agent OS needs a BrowserOps foundation for future GUI/browser workflows, but the public repo must not add live browser automation, credentialed browsing, real website interaction, material external sends, purchases/payments, destructive actions, production mutation, secret access, or private infrastructure.

The project also needs a reusable way to generate predictable build artifacts so later builds can keep manifests, acceptance checklists, handoff packets, known gaps, safety matrices, eval inventories, and project memory synchronized.

## Decision

Build 8 adds two separate deliverables: `@stealtheye/browserops` as a fixture-only contracts package, and `scripts/stealtheye-build.mjs` plus `scripts/phases/build-008-browserops.mjs` as a minimal generated-state engine.

BrowserOps models sessions, page observations, evidence refs, actions, action policies, action plans, Guard requested-action conversion, Guard/Worker Fleet preflight, and future-browserops task templates. It uses public-safe fixtures only and exports no live browser execution capability.

The build engine reads a phase spec, generates `docs/generated/` artifacts, supports `--check`, prints summaries, and scans generated state plus BrowserOps fixtures for obvious unsafe content or false live-capability claims.

## Consequences

Future BrowserOps runtime work has typed contracts and safety expectations before any live execution exists. Guard and Worker Fleet can reason about browser plans without executing them. Generated state becomes predictable and CI-verifiable.

## Next

Build 9 should implement Receipts + Replay using the evidence and generated-state references introduced by earlier builds.
