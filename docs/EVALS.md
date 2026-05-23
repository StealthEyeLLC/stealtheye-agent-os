# Evals

Evals turn expected behavior and discovered failures into regression coverage. Build 8 adds BrowserOps eval-style tests and generated eval registry state.

## BrowserOps Build 8 eval coverage

`packages/browserops/test/browserops.test.ts` covers session validation, invalid sessions, allowed and denied domains, observation allowance, evidence refs, risky page-control detection, form-fill preview, external-send escalation, money/payment escalation, auth-submit escalation, destructive and production mutation denial/escalation, credentialed-browsing block, Guard requested-action conversion, Worker Fleet task-template conversion, Guard preflight allow/block behavior, untrusted registry blocking, no live browser capability exports, and fixture public-safety checks.

## Generated eval registry

Build 8 generates `docs/generated/eval-registry.json` from the phase spec. This is an orientation artifact and not yet a full eval runner.

## Future eval needs

Browser prompt-injection simulations, credential broker hard-stop evals, isolated browser runtime safety evals before live browser execution, receipt replay regression cases, workflow-compiler DAG evals, and semantic firewall evals.
