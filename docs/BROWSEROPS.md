# BrowserOps

BrowserOps is the future browser/computer-use layer for authorized online workflows where an API or first-party tool path is insufficient. Build 8 implements the foundation only: typed contracts, deterministic helpers, public-safe fixtures, Guard preflight, and Worker Fleet handoff templates.

## Build 8 scope

`@stealtheye/browserops` includes browser session schemas, page observation schemas, browser evidence refs, action kinds/categories, deterministic action-policy helpers, action plan schemas, Guard requested-action conversion, Worker Fleet `future_browserops` task-template conversion, preflight summaries, public-safe fixtures, and Vitest coverage.

## Session model

A browser session records mission/task/worker identity, browser context identity, isolation mode, allowed/denied domains, allowed/denied actions, credential mode, storage/network policy refs, evidence refs, receipt refs, timestamps, and status. Build 8 supports `fixture_only` as the active mode. Future isolation modes are schema values only.

Credential mode must be `none` for Build 8 plans. Future credential modes are modeled only so policies can block them until a Secrets Broker and browser isolation runtime exist.

## Page observations and evidence

Page observations record URL/domain/title and references to DOM snapshots, screenshots, accessibility trees, console/network/storage logs, detected forms, and risky controls. They do not include real screenshots, DOM, HARs, traces, videos, cookies, storage state, credentials, or downloaded bytes.

Evidence refs include evidence ID, session ID, task ID, kind, URI, digest, summary, sensitivity, creation time, and retention hint. Fixture URIs must remain public-safe, such as `test://...`, `artifact://fixture/...`, or `example.test` references.

## Action policy

Policy helpers enforce allowed-domain matching, denied-domain override, allowed/denied action matching, fixture-only observation/preview on allowed domains, external-send escalation, money/payment escalation, auth-submit escalation, destructive denial/escalation, production-mutation denial/escalation, and credentialed-browsing block.

## Guard and Worker Fleet integration

Browser action plans convert to Guard requested actions and Worker Fleet `future_browserops` task templates. Build 8 never executes browser actions.

## Explicit non-goals

Build 8 does not add live browser automation, Playwright runtime execution, browser launch, website navigation, credentialed browsing, cookie/storage-state handling, real screenshots, real DOM capture, real HAR/video/trace capture, real downloaded files, external sends, purchases/payments, destructive actions, production mutations, customer-data workflows, or secret access.
