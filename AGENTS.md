# AGENTS.md

This repo is the public-safe build root for StealthEye Agent OS. Work on feature branches and PRs only. Do not push directly to `main`.

## Current build context

Build 8 adds `@stealtheye/browserops` and a minimal build automation engine. BrowserOps is fixture-only: it models sessions, page observations, evidence refs, action policies, action plans, Guard preflight, and Worker Fleet handoff templates. It does not run Playwright, launch browsers, visit real websites, use credentials, submit forms, send material externally, make purchases, mutate production, or perform destructive actions.

The build automation engine lives at `scripts/stealtheye-build.mjs` with phase specs under `scripts/phases/`. It generates public-safe state under `docs/generated/` and supports `--check` for CI.

## Autonomy model

Inside an approved mission envelope, proceed without repeated approval for ordinary delegated actions: reading public/authorized repo content, creating non-protected branches, writing scoped branch files, committing branch work, opening PRs, reading CI, rerunning allowed failed CI where scoped, and writing public-safe receipts/artifacts. Stop or escalate at hard boundaries.

## Hard stops

Do not implement or perform actions that enable deletion/destruction, raw secret exposure, money movement, purchases/payments, billing/subscription changes, production deploys, production data mutation, production-impacting migrations, auth/security-critical changes, protected branch mutation, force push/history rewrite, CI/test/security weakening, material external sends, legal commitments, live credentialed browsing, or platform-required confirmations.

## Verification

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

CI must stay truthful. Do not claim full security scanning, SBOM/provenance, deployment readiness, live browser testing, credentialed browsing testing, live queue readiness, live repo-write testing, or Playwright runtime readiness until those workflows exist.
