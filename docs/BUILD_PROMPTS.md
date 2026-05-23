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

CI should be truthful about what is actually checked. Do not claim full security scanning, production readiness, SBOM generation, supply-chain attestation, live queue testing, or production worker readiness until those workflows exist.

## Build 6 prompt outcome

Build 6 implements Worker Fleet Foundation as package-level foundation work: typed worker tasks, task statuses and types, leases with fencing tokens, idempotency records, stable action fingerprints, retry policies, task status summaries, artifact references, worker receipt events, Guard preflight integration, Mission OS plan-to-worker-task conversion, public-safe fixtures, and Vitest eval-style cases.

It does not add a live Redis/BullMQ queue, production worker runtime, distributed lock service, live tool execution, repo mutation, browser automation, production deployment, customer-data workflows, money movement, live queue configuration, or private infrastructure.

## Discipline

Do not mix unrelated features. Do not add sensitive operational material or private infrastructure. Do not claim certification, production readiness, runtime worker readiness, or open-source status without the required artifacts. Keep AGENTS.md concise and push detail into docs.

## Next target

Build 7 should implement CodeOps + CI Repair foundations.
