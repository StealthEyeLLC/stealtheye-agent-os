# ADR 0015: Live CodeOps Branch-Write Path through Guard and Receipts

## Status

Accepted for Build 13.

## Decision

Add a guarded CodeOps branch-write foundation that validates branch-write plans, applies explicit branch-write policy, maps plan stages into Guard requested actions, and emits receipt previews for every attempted preview or fixture write.

The writer surface is fixture-first. CI uses fixtures and mocks only. Optional GitHub branch-write support is modeled behind a config-required interface and remains disabled by default.

## Safety boundaries

Build 13 denies protected branch writes, direct default branch writes, force push, workflow mutation, CI/test/security weakening, credential-like paths, production deployment paths, private/customer data paths, and destructive deletion.

Delete is modeled only as `delete_prohibited` in Build 13.

## Runtime exposure

The MCP runtime exposes CodeOps write preview tools and one fixture-only execution tool. No unrestricted live write tool is exposed.

## GitHub API documentation basis

Optional live behavior was modeled only after checking official GitHub REST documentation for repository contents create/update, Git references, pull request creation, and branch protection concepts. No credential is added to the repository and no CI test requires live GitHub write access.

## Consequences

This establishes a safe bridge from CodeOps planning to future branch-scoped writing while preserving the public/private boundary and generated receipt trail.

## Next

Build 14 should align the official MCP server transport and SDK integration.
