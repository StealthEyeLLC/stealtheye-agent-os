# Build Prompts

## Quick build flow

1. Jamie opens a new ChatGPT tab for the next build prompt.
2. Builder completes focused work in the repo on a feature branch.
3. Builder updates docs, AGENTS.md, llms.txt, llms-full.txt, evals, receipts/evidence expectations, and verification checklist where applicable.
4. Builder opens a PR and waits for PR CI to complete.
5. Jamie returns to verifier chat with PR/branch/commit.
6. Verifier checks work, merges accepted green PRs, updates issue #1, and provides the next prompt.

## Standing build prompt requirements

A build prompt should state the branch, scope, allowed paths, forbidden paths, hard stops, expected files, verification commands, receipt requirements, eval expectations, final response format, and next recommended target.

## Package verification commands

For TypeScript package builds, require CI verification of:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
```

CI should be truthful about what is actually checked. Do not claim full security scanning, production readiness, SBOM generation, supply-chain attestation, live queue testing, live repo-write testing, live CI rerun testing, or production worker readiness until those workflows exist.

## Build 6 prompt outcome

Build 6 implements Worker Fleet Foundation as package-level foundation work: typed worker tasks, task statuses and types, leases with fencing tokens, idempotency records, stable action fingerprints, retry policies, task status summaries, artifact references, worker receipt events, Guard preflight integration, Mission OS plan-to-worker-task conversion, public-safe fixtures, and Vitest eval-style cases.

It does not add a live Redis/BullMQ queue, production worker runtime, distributed lock service, live tool execution, repo mutation, browser automation, production deployment, customer-data workflows, money movement, live queue configuration, or private infrastructure.

## Build 7 prompt outcome

Build 7 implements CodeOps + CI Repair Foundations in `@stealtheye/codeops`: repository targets, branch/path safety helpers, patch plans, file-change contracts, verification plans, CI log summaries/classifiers, repair plans, rerun eligibility, PR evidence packets, Guard requested-action adapters, Worker Fleet task templates, public-safe fixtures, and Vitest eval-style cases.

It does not add live GitHub mutation, branch creation, commits, PR creation, live CI log fetching, live CI reruns, protected-branch writes, force pushes, CI/test/security weakening, browser automation, production deployment, customer-data workflows, money movement, secrets access, or private infrastructure.

## Discipline

Do not mix unrelated features. Do not add sensitive operational material or private infrastructure. Do not claim certification, production readiness, runtime worker readiness, live CodeOps readiness, live CI Repair readiness, or open-source status without the required artifacts. Keep AGENTS.md concise and push detail into docs.

## Next target

Build 8 should implement BrowserOps foundations.
