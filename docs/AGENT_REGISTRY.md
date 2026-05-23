# Agent Registry

The Agent Registry is the trust and discovery layer for agents, tools, and subagents.

## Signed agent cards

Agent cards identify an agent, version, publisher, public keys, intended capabilities, risk tier, supported protocols, receipt behavior, and revocation status. Cards must be signed and verified before use.

## Signed tool manifests

Tool manifests describe tool families, schemas, scopes, side effects, auth requirements, evidence expectations, and hard-stop categories. Manifests must be signed and never accepted solely because a remote server describes them.

## Manifest pinning and diffing

Missions should pin exact manifest digests. Manifest updates require diff review that highlights capability changes, side-effect changes, auth changes, schema changes, and risk changes.

## Trust registry

The registry records trusted publishers, keys, allowed capabilities, risk tiers, review status, and evidence history. Trust is explicit, scoped, and revocable.

## Revocation

Revocation should invalidate compromised agent cards, tool manifests, signing keys, and capability grants. Workers must check revocation before executing queued actions.

## Agent identity

Every agent/subagent needs a stable identity bound to signatures, manifests, receipts, and mission authority. Identity is not inferred from network location or self-description.

## MCP + A2A hybrid direction

MCP is the tool protocol direction. A2A-style subagent delegation may be supported later, but all delegation must preserve signed identity, scoped authority, Guard enforcement, and receipts.

## No blind trust

Remote tool descriptions, browser content, repo files, logs, and documents are untrusted input. The registry verifies cryptographic identity and pinned metadata; Guard decides whether a call is authorized.
