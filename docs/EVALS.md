# Evals

## Philosophy

Every significant behavior should be measurable through evals. Failures become regression cases, not anecdotes.

## Build 2 initial eval-style tests

`packages/agent-registry/test/*` covers signed agent/tool manifest validation, canonicalization, digest stability, signature verification, manifest diffing, trust decisions, revocation, and no obvious real-secret material in fixtures.

## Build 3 Guard eval-style tests

`packages/guard/test/*` covers delegated repo actions, missing tokens, scope mismatch, production deploy, money movement, raw secret access, protected branch mutation, force push/history rewrite, CI/test weakening, untrusted registry decisions, digest mismatch, token lifecycle failures, trusted registry allow, receipt fields, and deterministic reason codes.

## Build 4 Mission OS eval-style tests

`packages/mission-os/test/*` covers Mission Language validation, mission compilation, authority envelopes, Guard-compatible outputs, plan dependencies, status transitions, receipt preservation, hard-stop previews, and public-safe fixtures.

## Build 5 App Host eval-style tests

`packages/app-host/test/*` covers host health, host capabilities, Mission Language validation/rejection, mission compile preview, hard-stop mission preview, Guard allow/escalate/deny previews, Guard receipt preview, Registry validation/trust/diff previews, hard-stop policy summaries, descriptor safety, no live write/destructive tool exposure, resource descriptors, and no obvious real-secret material in app-host fixtures or descriptors.

## Build 6 Worker Fleet eval-style tests

`packages/worker-fleet/test/*` covers worker task validation, Mission OS plan-step conversion, dependencies, leases/fencing, idempotency, retries, status transitions, runnable-task summaries, Guard preflight allow/block/escalate paths, untrusted registry blocking, worker receipt events, artifact refs, and no obvious real-secret material in worker fixtures.

## Build 7 CodeOps + CI Repair eval-style tests

`packages/codeops/test/*` covers:

- valid and invalid repository target validation;
- branch prefix acceptance and protected branch rejection;
- force push/history rewrite rejection;
- allowed and denied path matching;
- destructive delete detection;
- suspicious secret-bearing path detection;
- CI/test/security weakening detection;
- stable patch-plan fingerprinting;
- verification obligations for package and docs changes;
- CI log classification for typecheck, test, secret guard, flaky, and infrastructure failures;
- CI repair plan generation for deterministic failures;
- rerun-only eligibility for flaky/infrastructure failures;
- rerun denial as the sole fix for deterministic failures;
- Guard requested-action generation for safe CodeOps plans;
- Worker Fleet task-template generation for future CodeOps/CI Repair steps;
- Guard preflight allow/block behavior for safe branch work, protected branches, CI weakening, and untrusted registry summaries;
- PR evidence packet validation;
- no obvious real-secret material in CodeOps fixtures.

These are package-level eval fixtures. Future builds should promote them into broader runtime evals before enabling live branch creation, commits, PR creation, CI log fetching, CI reruns, or GitHub App write scopes.

## Build 9 Receipts + Replay eval-style tests

`packages/receipts-replay/test/*` covers valid and invalid receipt events, public-safe evidence URI validation, receipt bundle validation, deterministic timeline sort/group/gap detection, denial and escalation summaries, mission progress summaries, side-effect-free replay packets, verification packets, final report packets, integrity digest stability/mismatch detection, adapters from Guard/Worker Fleet/CodeOps/BrowserOps/generated state, and public-safe fixture references.

## Failure-to-eval loop

When the system fails, add an eval that reproduces the failure, documents expected behavior, and verifies the repair.

## Eval families

- Regression evals for known failure modes.
- Mission success evals for end-to-end task completion.
- Mission Language evals for compilation, authority envelopes, status, and receipt references.
- App Host evals for descriptor safety, schema conformance, preview outputs, resource metadata, and no-live-write exposure.
- Worker Fleet evals for task schemas, leases, fencing, idempotency, retries, status summaries, Guard preflight, artifacts, and receipt events.
- CodeOps evals for branch/path safety, patch plans, file-change contracts, verification obligations, PR evidence, and hard-stop denials.
- CI Repair evals for log classification, repair planning, rerun policy, and receipt-backed verification loops.
- Receipts + Replay evals for event completeness, replay order, side-effect-free reconstruction, integrity digests, verification packets, and final reports.
- Tool selection evals for correct routing and refusal.
- Registry trust evals for signed card/manifest verification, revocation, and diff review.
- Guard policy evals for capability-token matching, registry trust enforcement, hard stops, receipts, and lifecycle states.
- Security evals for hard stops and authority enforcement.
- Prompt injection and tool poisoning evals for untrusted content.
- Browser QA evals for screenshots, traces, and non-destructive validation.
- Receipt accuracy evals for complete, replayable evidence.

## Evidence

Each eval should declare fixtures, allowed tools, expected receipts, success criteria, and forbidden shortcuts. Future eval runners should add scenario ids, fixture metadata, expected receipt artifacts, worker event expectations, CodeOps/CI Repair evidence expectations, replay expectations, and dashboards.
