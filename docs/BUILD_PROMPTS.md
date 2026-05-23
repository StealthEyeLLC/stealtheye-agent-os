# Build Prompts

Build prompts are implementation contracts for StealthEye Agent OS. They must define scope, branch, package/docs/test/CI requirements, safety boundaries, and final reporting requirements.

## Standing requirements

Each build prompt should require branch work from updated `main`, no direct `main` pushes, coordinated code/tests/docs/CI/ADR/generated-state/LLM-context changes, truthful CI, public/private boundary preservation, PR creation, and stop at ready for verifier review after green CI.

## Build 8 outcome

Build 8 adds BrowserOps Foundations and a Minimal Build Automation Engine.

BrowserOps scope: schemas and deterministic helpers for browser sessions, page observations, evidence refs, action policies, action plans, Guard preflight, Worker Fleet handoff, public-safe fixtures, and tests.

Build automation scope: `scripts/stealtheye-build.mjs`, `scripts/phases/build-008-browserops.mjs`, generated state under `docs/generated/`, and `--check` mode.

## Next prompt target

Build 9 should implement Receipts + Replay.
