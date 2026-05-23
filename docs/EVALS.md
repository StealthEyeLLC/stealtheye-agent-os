# Evals

## Philosophy

Every significant behavior should be measurable through evals. Failures become regression cases, not anecdotes.

## Build 2 initial eval-style tests

`packages/agent-registry/test/*` covers signed agent/tool manifest validation, canonicalization, digest stability, signature verification, manifest diffing, trust decisions, revocation, and no obvious real-secret material in fixtures.

## Build 3 Guard eval-style tests

`packages/guard/test/*` covers delegated repo actions, missing tokens, scope mismatch, production deploy, money movement, raw secret access, protected branch mutation, force push/history rewrite, CI/test weakening, untrusted registry decisions, digest mismatch, token lifecycle failures, trusted registry allow, receipt fields, and deterministic reason codes.

## Build 4 Mission OS eval-style tests

`packages/mission-os/test/*` covers:

- valid Mission Language object validation;
- invalid Mission Language object validation;
- compiling Mission Language to normalized mission objects;
- compiling Mission Language to authority envelopes;
- authority-envelope output compatible with Guard capability-token fields;
- mission plan step dependency preservation;
- requested repo write action generation from plan steps;
- Guard allowing a safe planned action with matching authority;
- Guard escalating or denying hard-stop planned action;
- mission status transition happy path;
- invalid mission status transition rejection;
- mission status summaries including blockers and next actions;
- receipt/evidence reference preservation;
- fixture coverage for invalid target constraints and missing verification plans;
- no obvious real-secret material in fixtures.

Build 4 fixtures include normal repo feature mission, CI repair mission, browser QA mission, hard-stop production deploy mission, hard-stop money movement mission, invalid target constraints mission, and missing verification plan mission.

## Failure-to-eval loop

When the system fails, add an eval that reproduces the failure, documents expected behavior, and verifies the repair.

## Eval families

- Regression evals for known failure modes.
- Mission success evals for end-to-end task completion.
- Mission Language evals for compilation, authority envelopes, status, and receipt references.
- Tool selection evals for correct routing and refusal.
- Registry trust evals for signed card/manifest verification, revocation, and diff review.
- Guard policy evals for capability-token matching, registry trust enforcement, hard stops, receipts, and lifecycle states.
- Security evals for hard stops and authority enforcement.
- Prompt injection and tool poisoning evals for untrusted content.
- CI repair evals for diagnosis and safe remediation.
- Browser QA evals for screenshots, traces, and non-destructive validation.
- Receipt accuracy evals for complete, replayable evidence.

## Evidence

Each eval should declare fixtures, allowed tools, expected receipts, success criteria, and forbidden shortcuts. Future eval runners should add scenario ids, fixture metadata, expected receipt artifacts, and dashboards.
