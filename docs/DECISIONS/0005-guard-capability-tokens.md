# ADR 0005: Guard capability tokens

## Status

Accepted

## Context

StealthEye Agent OS needs an enforcement layer that converts high-autonomy mission authority into executable decisions before tool or worker action. Build 2 introduced signed agent-card and tool-manifest primitives, but trusted metadata alone does not grant mission authority. The system needs typed capability-token records, requested-action schemas, deterministic policy checks, hard-stop evaluation, registry trust enforcement, and receipt-friendly decision shapes.

This foundation must stay public-safe. It must not add production auth tokens, real secrets, money movement, production deployment, private endpoints, customer data, private OAuth clients, or sensitive operational runbooks.

## Decision

Implement an `@stealtheye/guard` TypeScript package with Zod schemas and JSON Schema exports for capability tokens, requested actions, Guard decisions, and Guard decision receipts.

Capability tokens are delegated-authority records, not credential storage. They encode mission id, issuer, subject, authority origin, allowed and forbidden effects, hard stops, target constraints, tool/manifest constraints, time windows, usage constraints, evidence requirements, receipt requirements, escalation requirements, optional digest/signature references, and lifecycle status.

Guard policy evaluation is deterministic. An action is allowed only when an active non-expired/non-revoked/non-suspended/non-exhausted token applies, effect and target constraints match, tool/manifest constraints match, registry trust requirements are satisfied, pinned digests match when required, and no hard stop is triggered. Hard stops result in denial or escalation, never silent allow.

Guard consumes Agent Registry trust summaries as input and enforces requirements such as trusted publisher, approved review status, pinned digest, and revoked/invalid outcomes. Guard does not re-verify signatures in this build.

## Consequences

The project now has a typed enforcement foundation for mission-scoped authority and policy receipts. Tests cover delegated repo actions, missing token, scope mismatch, production deploy, money movement, raw secret access, protected branch mutation, force push/history rewrite, CI/test weakening, untrusted registry decisions, digest mismatch, expired/revoked/suspended tokens, trusted registry allow, receipt fields, and deterministic reason codes.

This is still foundation work. It is not a durable runtime service, not a production authorization system, not a ledger, not a Secrets Broker, and not connected to live workers or Mission OS yet.

## Revisit triggers

Revisit when adding Mission OS authority-envelope issuance, durable Postgres token storage, receipt ledger persistence, Secrets Broker integration, live worker preflight enforcement, remote MCP discovery, production signing/KMS integration, browser/tool runtime hooks, or formal policy language support.
