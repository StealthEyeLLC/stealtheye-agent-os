# ADR 0004: Agent Registry signed manifests

## Status

Accepted

## Context

StealthEye Agent OS needs a way to identify trusted agents and tools before granting mission authority. Remote tool descriptions and agent self-descriptions are untrusted and may be poisoned. The system needs signed metadata, deterministic digests, manifest pinning, diff review, trust status, and revocation before Guard and worker layers can safely delegate capability.

## Decision

Implement an `@stealtheye/agent-registry` TypeScript package with Zod schemas for signed agent cards and signed tool manifests, JSON Schema export, deterministic canonicalization, SHA-256 digesting, Ed25519 signing/verification helpers, manifest diffing, an in-memory trust registry, revocation lists, public test fixtures, and initial Vitest eval-style tests.

Signatures are computed over canonical unsigned payloads that exclude the mutable `signatures` field. Production private keys are not stored in the repo; future production signing should use KMS/HSM or other private key-management systems.

## Consequences

The project now has concrete schema and verification primitives for Agent Registry work. Guard and Capability Tokens can consume registry trust decisions in the next build. The registry is not yet durable, not networked, and not integrated with MCP discovery or worker enforcement.

## Revisit triggers

Revisit when adding durable Postgres registry storage, remote MCP manifest discovery, KMS/HSM-backed production signing, formal JSON Schema publication, SBOM/provenance workflow, or Guard enforcement integration.
