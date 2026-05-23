# Evals

## Philosophy

Every significant behavior should be measurable through evals. Failures become regression cases, not anecdotes.

## Build 2 initial eval-style tests

`packages/agent-registry/test/*` currently covers:

- valid signed agent card validation;
- invalid agent card validation;
- valid signed tool manifest validation;
- invalid tool manifest validation;
- deterministic canonicalization;
- digest stability;
- signature verification;
- manifest diff detection for capability/risk/auth/tool/side-effect changes;
- trusted fixture acceptance;
- untrusted fixture rejection;
- revoked fixture rejection;
- no obvious real-secret material in fixtures.

These tests are the initial eval substrate. Future builds should register them in a dedicated eval runner with fixture metadata, expected receipts, and regression dashboards.

## Build 3 Guard eval-style tests

`packages/guard/test/*` currently covers:

- normal delegated repo action allowed inside mission-scoped authority;
- denied action with no capability token;
- denied action outside repo, path, or branch scope;
- production deployment escalated;
- money movement escalated;
- raw secret access escalated;
- direct protected branch mutation denied;
- force push/history rewrite denied;
- CI/test weakening denied;
- untrusted manifest/agent denied;
- pinned digest mismatch denied;
- expired token denied;
- revoked or suspended token denied;
- trusted registry decision allowed;
- Guard receipt fields populated;
- deterministic reason codes for important denials.

These tests are the initial Guard eval substrate. Future dedicated eval runners should add fixture metadata, scenario ids, expected receipts, and regression dashboards, but the current tests intentionally keep fixtures public-safe and local.

## Failure-to-eval loop

When the system fails, add an eval that reproduces the failure, documents expected behavior, and verifies the repair.

## Eval families

- Regression evals for known failure modes.
- Mission success evals for end-to-end task completion.
- Tool selection evals for correct routing and refusal.
- Registry trust evals for signed card/manifest verification, revocation, and diff review.
- Guard policy evals for capability-token matching, registry trust enforcement, hard stops, receipts, and lifecycle states.
- Security evals for hard stops and authority enforcement.
- Prompt injection and tool poisoning evals for untrusted content.
- CI repair evals for diagnosis and safe remediation.
- Browser QA evals for screenshots, traces, and non-destructive validation.
- Receipt accuracy evals for complete, replayable evidence.

## Evidence

Each eval should declare fixtures, allowed tools, expected receipts, success criteria, and forbidden shortcuts.
