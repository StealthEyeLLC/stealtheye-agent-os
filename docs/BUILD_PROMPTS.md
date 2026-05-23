# Build Prompts

## Quick build flow

1. Jamie opens a new ChatGPT tab for the next build prompt.
2. Builder completes focused work in the repo.
3. Builder updates docs, AGENTS.md, llms.txt, llms-full.txt, evals, receipts/evidence expectations, and verification checklist where applicable.
4. Jamie returns to verifier chat with PR/branch/commit.
5. Verifier checks work.
6. Verifier updates issue #1.
7. Verifier provides next prompt.

## Standing build prompt requirements

A build prompt should state the branch, scope, allowed paths, forbidden paths, hard stops, expected files, verification commands, receipt requirements, eval expectations, final response format, and next recommended target.

## Package verification commands

For TypeScript package builds, require CI verification of:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

CI should be truthful about what is actually checked. Do not claim full security scanning, production readiness, SBOM generation, or supply-chain attestation until those workflows exist.

## Build 4 prompt outcome

Build 4 implements Mission OS + StealthEye Mission Language as package-level foundation work: Mission Language schema, normalized mission schema, authority envelopes, lightweight plan structures, status inspection, receipt references, Guard capability-token templates, requested-action generation, fixtures, and Vitest cases. It does not add production app servers, live worker queues, real credentials, production endpoints, money movement, production deploys, customer data, private OAuth clients, or sensitive infrastructure.

## Discipline

Do not mix unrelated features. Do not add secrets or private infrastructure. Do not claim certification or open-source status without the required artifacts. Keep AGENTS.md concise and push detail into docs.

## Next target

Build 5 should implement ChatGPT App / MCP Server Host Shell.
