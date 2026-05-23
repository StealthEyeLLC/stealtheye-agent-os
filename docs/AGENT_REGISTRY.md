# Agent Registry

The Agent Registry is the trust and discovery layer for agents, tools, and subagents.

## Build 2 implementation

`packages/agent-registry` now provides the first concrete registry primitives:

- signed agent-card and signed tool-manifest Zod schemas;
- JSON Schema export for those public schema shapes;
- canonical unsigned payload generation;
- deterministic canonical JSON;
- SHA-256 digests using `sha256:<hex>` format;
- Ed25519 signing and verification helpers using Node crypto;
- manifest diffing for risk-relevant changes;
- in-memory trust registry with publisher/key/digest allow rules;
- revocation by agent id, manifest id, key id, or digest;
- public test fixtures and Vitest tests that serve as initial eval-style cases.

## Signed agent cards

Agent cards identify an agent, version, publisher, public verification keys, supported protocols, capabilities, risk tier, allowed effects, hard stops, auth requirements, receipt requirements, linked manifests, validity window, revocation references, and signatures. Signatures are computed over canonical unsigned payloads, not over the mutable `signatures` array.

## Signed tool manifests

Tool manifests describe tool families, schema metadata, scopes, side effects, auth requirements, evidence expectations, allowed effects, hard-stop categories, risk tier, public verification keys, validity window, revocation references, and signatures. They must not be trusted solely because a remote MCP server advertises them.

## Manifest pinning and diffing

Missions should pin exact manifest digests. Registry review should compare old and new signed payloads and highlight capability, tool, side-effect, auth/scope, risk-tier, hard-stop, schema, publisher/key, expiry, and revocation changes.

## Trust registry

The current trust registry is in-memory. It can represent trusted publishers, trusted keys, pinned manifest/card digests, allowed agents, allowed tool manifests, trust status, review status, notes, and evidence references. Durable Postgres storage is deferred.

## Revocation

The revocation model supports revoking by `agent_id`, `manifest_id`, `key_id`, or digest. Verification fails when a relevant revoked identifier is present. Future builds should persist revocations and propagate them to workers before job execution.

## Agent identity

Every agent/subagent needs a stable identity bound to signatures, manifests, receipts, and mission authority. Identity is not inferred from network location or self-description.

## MCP + A2A hybrid direction

MCP is the tool protocol direction. A2A-style subagent delegation may be supported later, but all delegation must preserve signed identity, scoped authority, Guard enforcement, and receipts.

## No blind trust

Remote tool descriptions, browser content, repo files, logs, documents, and unverified manifests are untrusted input. The registry verifies cryptographic identity and pinned metadata; Guard decides whether a call is authorized.

## Next step

Build 3 should connect registry results to Guard + Capability Tokens so trust decisions can become enforceable authority decisions.
