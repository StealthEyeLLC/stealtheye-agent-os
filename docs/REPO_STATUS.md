# Repo Status

Build 11 introduces the first live-capable read-only observation surface for public GitHub repository/status metadata.

The package path is `packages/repo-status/`. Runtime integration is in `packages/mcp-runtime/src/repo-status-adapter.ts`.

## Capability

`@stealtheye/repo-status` can observe public repository information when configured with the public unauthenticated REST client. CI keeps tests deterministic by using fixtures and mocked fetch calls.

Supported read categories:

- Public repository metadata.
- Public branch metadata.
- Public pull request metadata.
- Public issue metadata.
- Public workflow/check summary metadata.
- Public-safe file metadata and content.
- Public-safe repository status packet summaries.

## Runtime tools

The MCP runtime exposes these read-only tool names:

- `repo.status.summary`
- `repo.metadata.read`
- `repo.branch.read`
- `repo.pr.list`
- `repo.pr.read`
- `repo.issue.list`
- `repo.issue.read`
- `repo.workflow.status.read`
- `repo.file.metadata.read`
- `repo.file.content.read`

Each descriptor declares `readOnly: true`, `liveWrite: false`, `destructive: false`, `externalSideEffect: false`, and `liveCapabilityStatus: read_only_live`.

## Live client boundary

The optional live client:

- Uses no credentials.
- Uses only GET requests.
- Allows only `https://api.github.com`.
- Requires an explicit public repository allowlist, initially `StealthEyeLLC/stealtheye-agent-os`.
- Handles public unauthenticated rate-limit failure without retrying mutation paths.
- Is not required for CI.

## Guard and policy

Every repo/status read is evaluated by deterministic read-only policy and Guard. The policy only allows explicit public-read effects and blocks unsafe operations by default. Guard evaluates a mission-scoped read-only capability token and blocks untrusted registry summaries.

## Receipts

Every read helper returns a public-safe receipt preview with:

- Tool name.
- Target repository.
- Target ref, pull request, issue, check, or file when applicable.
- Timestamp.
- Guard decision reference or read-policy reference.
- Public-safe input and output summaries.
- A no-write/no-side-effect statement.

Receipts are returned with tool results only. Build 11 does not add a durable ledger.

## Explicit exclusions

Build 11 does not add credentials, private repository access, repository writes, branch creation, commits, pull request mutation, issue mutation, CI reruns, workflow dispatch, deployment, money movement, browser execution, production mutation, or customer-data workflows.
