# CodeOps Live Write Boundary

Build 13 adds the first branch-safe CodeOps write-path foundation through Guard and receipt previews.

The implemented path is fixture-first. CI uses only fixture and dry-run behavior. Optional live GitHub branch-write behavior is modeled behind a config-required interface and is disabled by default.

## Allowed Build 13 scope

- Non-protected branches with allowed prefixes.
- The allowlisted public repository target.
- Small public-safe generated, test fixture, or documentation changes.
- Preview and fixture write results.
- Policy, Guard, and receipt preview events.
- Verification commands and receipt expectations on every plan.

## Denied scope

- Direct writes to `main`, `master`, default branches, or protected branches.
- Force push or history rewrite.
- GitHub workflow mutation through the branch-write writer.
- CI, test, or security weakening.
- Credential-like paths, secret-bearing paths, private-data paths, or customer-data paths.
- Production deployment paths or production mutation.
- Destructive deletion. Build 13 models delete as `delete_prohibited` only.
- Durable receipt ledger writes.

## Runtime tools

- `codeops.write.plan.preview` previews plan, policy, and Guard decisions.
- `codeops.branch.write.preview` returns a dry-run branch-write result.
- `codeops.branch.write.fixture` executes the fixture-only writer with no external side effect.
- `codeops.write.receipt.preview` returns receipt preview events.

Preview tools are preview-only. The fixture execution tool is fixture-only, non-destructive, and has no external side effect. No unrestricted live write tool is exposed.

## GitHub API documentation checked

Before modeling optional live behavior, Build 13 checked current official GitHub REST documentation for repository contents create/update, Git references, pull request creation, and branch protection. The code does not embed credentials and does not run live GitHub write tests in CI.

## Known gaps

- Optional live GitHub writer is config-required and not executed by CI.
- No durable receipt ledger exists yet.
- Pull request creation is modeled as preview/future behavior, not a live runtime tool.
- Official MCP SDK/server transport alignment remains future work for Build 14.
