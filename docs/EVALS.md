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

`packages/app-host/test/*` covers:

- host health returning foundation-shell status;
- host capabilities listing expected tool families;
- valid Mission Language fixture accepted;
- invalid Mission Language fixture rejected;
- mission compile preview returning mission, authority envelope, plan, status, receipt expectations, capability-token template, and requested-action templates;
- hard-stop mission preview marked appropriately;
- Guard preview allowing safe fixture action;
- Guard preview escalating or denying hard-stop fixture action;
- Guard receipt preview returning receipt-friendly fields;
- Registry agent-card validation accepting trusted fixture;
- Registry tool-manifest validation accepting trusted fixture;
- risky manifest diff preview requiring review;
- trusted registry preview returning trusted/approved decision;
- hard-stop policy summary returning required categories;
- every Build 5 descriptor being read-only or preview-only;
- no live write/destructive tool exposure;
- resource descriptors exposing static app-host content;
- no obvious real-secret material in app-host fixtures or descriptors.

## Failure-to-eval loop

When the system fails, add an eval that reproduces the failure, documents expected behavior, and verifies the repair.

## Eval families

- Regression evals for known failure modes.
- Mission success evals for end-to-end task completion.
- Mission Language evals for compilation, authority envelopes, status, and receipt references.
- App Host evals for descriptor safety, schema conformance, preview outputs, resource metadata, and no-live-write exposure.
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
