# Workflows

StealthEye workflows convert mission intent into typed, authority-gated plans and future worker execution. Build 8 remains contract-first and fixture-only.

## Build flow

1. Branch from updated `main`.
2. Make coordinated package, tests, docs, CI, ADR, generated-state, LLM-context, and script changes.
3. Open a PR.
4. GitHub Actions runs install, typecheck, tests, required-file checks, basic secret-string guard, and build-engine check.
5. Stop at ready for verifier review when PR CI is green.

## BrowserOps workflow in Build 8

1. Create or validate a browser session.
2. Record a page observation with evidence references only.
3. Create an action plan using browser action kinds/categories.
4. Evaluate deterministic BrowserOps policy.
5. Convert action plans into Guard requested actions.
6. Convert action plans into Worker Fleet `future_browserops` task templates.
7. Run Guard preflight and produce a preflight summary.

No browser actions are executed.

## Build automation workflow

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```
