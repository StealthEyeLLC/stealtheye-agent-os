# Build 11 acceptance checklist: Live Read-Only Repo/Status Tools through Guard + Receipts

## Package foundation

- `@stealtheye/repo-status` defines schemas for targets, client config, summaries, status packets, policy results, and receipt previews with explicit live capability status.
- Policy helpers allow only public read effects and deny write, mutation, private repo, secret, deployment, external-send, and money effects.
- Guard integration evaluates repo/status reads against a read-only capability token and denies untrusted registry summaries.
- Every read category produces a public-safe receipt preview with target, timestamp, Guard or policy reference, input/output summaries, and no-write statement.
- Fixture client covers deterministic CI tests; optional public unauthenticated REST client uses no credentials, GET only, api.github.com only, and an explicit public repository allowlist.
- MCP runtime lists and calls repo/status read-only tools without exposing write tools.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in --check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No branch creation, file writes, commits, PR creation or mutation, issue mutation, CI reruns, workflow dispatch, repository settings mutation, deployment, money movement, browser execution, private repo access, secret access, customer-data workflow, production mutation, or material external send is added.
- Live GitHub behavior, when configured, is read-only public observation using unauthenticated GET requests against the official public GitHub REST API host for an explicit repository allowlist.
- CI tests remain fixture-backed or mocked and do not require credentials or live network stability.
- No durable ledger or production runtime deployment is included.

## Next target

- Build 12 — Memory Graph.
