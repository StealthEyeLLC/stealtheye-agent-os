# Worker Fleet

Worker Fleet owns durable execution contracts for future workers. It models tasks, leases, idempotency, retry policy/state, status, artifacts, receipts, and Guard preflight. It does not run a live queue or executor in current builds.

## Build 8 BrowserOps handoff

`@stealtheye/browserops` creates Worker Fleet task templates for browser action plans. These templates use task type `future_browserops`, include Guard requested actions, preserve mission/plan/action identity, and remain queued model objects only.

BrowserOps task templates must not launch browsers, execute Playwright, submit forms, send material externally, make purchases, mutate production, perform destructive actions, use credentials, or touch real websites.

## Deferred runtime work

Durable queue backend, worker runtime, browser worker isolation, artifact storage integration, lease persistence, and runtime Tool Router integration remain future work.
