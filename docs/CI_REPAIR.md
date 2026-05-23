# CI Repair

CI Repair is the package-level foundation for CI/check-run interpretation, failure classification, repair planning, rerun eligibility, and receipt-backed verification loops. Build 7 implements typed schemas, deterministic helpers, fixtures, and tests only. It does not rerun live jobs, dispatch workflows, weaken CI, delete tests, access secrets, mutate protected branches, deploy, or patch customer data.

## Build 7 package

`packages/codeops` includes CI Repair contracts for:

- CI log/check-run summaries with provider, workflow, run id, job id, check name, status, conclusion, failed step, short public-safe excerpts, detected failure categories, evidence refs, and fetch timestamp;
- deterministic fixture-log classification for typecheck, test, lint, formatting, dependency install, missing file, secret guard, workflow syntax, timeout, flaky, infrastructure, and unknown failures;
- repair plan schemas with mission/task identity, CI summary refs, failure categories, suspected files, proposed patch plans, verification commands, rerun eligibility, non-retryable reasons, risk tier, status, evidence refs, and receipt refs;
- rerun policy helpers that allow rerun-only handling for flaky/infrastructure failures, allow rerun after patch for deterministic code failures, deny rerun as sole fix for typecheck/test/lint/format failures, deny CI/test/security weakening, deny protected-branch mutation, and require evidence/receipt refs.

## Failure categories

Build 7 categories are:

- `typecheck_failure`
- `test_failure`
- `lint_failure`
- `formatting_failure`
- `dependency_install_failure`
- `missing_file_failure`
- `secret_guard_failure`
- `workflow_syntax_failure`
- `timeout`
- `flaky_failure`
- `infrastructure_failure`
- `unknown_failure`

Classifiers are deterministic and conservative. Unknown or ambiguous logs remain `unknown_failure` until a future build adds stronger evidence and evals.

## Rerun policy

Rerun-only is eligible only when evidence indicates infrastructure, flaky, or timeout failure without deterministic code-failure categories. Deterministic failures require a patch plan and verification before rerun. Rerun is denied when the plan weakens CI/tests/security, requires protected branch mutation, lacks evidence refs, or lacks receipt refs.

## Evidence and receipts

CI Repair evidence must remain public-safe. Log excerpts are short and must not include secrets. Repair plans reference CI summaries, suspected files, proposed patch plans, verification commands, rerun policy outcome, evidence refs, and receipt refs so future live loops can be replayed.

## Boundary

Build 7 does not add live GitHub Actions rerun calls, workflow dispatch, job-log scraping, external API clients, production credentials, private endpoints, or any mutation path. Future live CI Repair tools must pass Guard preflight, respect Worker Fleet task boundaries, emit receipts, and preserve truthful CI rather than weakening it.

## Evals

`packages/codeops/test/codeops.test.ts` includes fixture logs for typecheck failure, test failure, secret guard failure, and flaky/infrastructure failure. It also covers repair plan generation, rerun-only eligibility, denial of rerun as sole deterministic-code fix, CI/test weakening denial, and no-secret fixtures.
