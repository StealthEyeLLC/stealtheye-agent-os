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

`packages/worker-fleet/test/*` covers:

- valid and invalid worker task validation;
- Mission OS plan-step to Worker Fleet task conversion;
- dependency preservation from plan steps;
- lease creation, active checks, expiry detection, heartbeat updates, and stale/fenced update rejection;
- stable idempotency fingerprints, duplicate detection, completed-result refs, and collision detection;
- fixed and exponential retry backoff and retry exhaustion;
- valid and invalid task status transitions;
- next-runnable task detection, blocker summaries, mission worker summaries, and retryable-failure detection;
- Guard preflight allow path for safe delegated work;
- Guard preflight block/escalation path for hard-stop work;
- Guard preflight block path for untrusted registry summaries;
- worker receipt event required fields;
- public-safe artifact reference validation;
- no obvious real-secret material in worker fixtures.

The initial Worker Fleet tests are package-level eval fixtures. Future builds should promote them into a broader durable-execution eval suite once a live worker runtime, queue backend, receipt ledger, and artifact store exist.

## Failure-to-eval loop

When the system fails, add an eval that reproduces the failure, documents expected behavior, and verifies the repair.

## Eval families

- Regression evals for known failure modes.
- Mission success evals for end-to-end task completion.
- Mission Language evals for compilation, authority envelopes, status, and receipt references.
- App Host evals for descriptor safety, schema conformance, preview outputs, resource metadata, and no-live-write exposure.
- Worker Fleet evals for task schemas, leases, fencing, idempotency, retries, status summaries, Guard preflight, artifacts, and receipt events.
- Tool selection evals for correct routing and refusal.
- Registry trust evals for signed card/manifest verification, revocation, and diff review.
- Guard policy evals for capability-token matching, registry trust enforcement, hard stops, receipts, and lifecycle states.
- Security evals for hard stops and authority enforcement.
- Prompt injection and tool poisoning evals for untrusted content.
- CI repair evals for diagnosis and safe remediation.
- Browser QA evals for screenshots, traces, and non-destructive validation.
- Receipt accuracy evals for complete, replayable evidence.

## Evidence

Each eval should declare fixtures, allowed tools, expected receipts, success criteria, and forbidden shortcuts. Future eval runners should add scenario ids, fixture metadata, expected receipt artifacts, worker event expectations, and dashboards.
