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

## Build 5 prompt outcome

Build 5 implements ChatGPT App / MCP Server Host Shell as package-level foundation work: app metadata, MCP-style tool descriptors, input/output schemas, static resource descriptors, fixture-backed preview handlers, and Vitest eval-style cases for host, Mission OS, Guard, Agent Registry, and policy families. It does not add production app servers, deployed MCP runtime, live repository mutation, worker queues, browser automation, real credentials, production endpoints, money movement, production deploys, customer data, private OAuth clients, or sensitive infrastructure.

## Discipline

Do not mix unrelated features. Do not add secrets or private infrastructure. Do not claim certification or open-source status without the required artifacts. Keep AGENTS.md concise and push detail into docs.

## Next target

Build 6 should implement Worker Fleet foundations.
