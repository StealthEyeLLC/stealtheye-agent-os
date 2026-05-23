# App Host

App Host owns the first ChatGPT App / MCP server host shell surface. Current behavior is static, fixture-backed, preview-only, and public-safe.

## Build 8 relationship

Build 8 does not change App Host runtime behavior. Future App Host surfaces may preview BrowserOps sessions, page observations, action plans, Guard preflight summaries, Worker Fleet task templates, and generated build-state packets.

Any future BrowserOps App Host surface must remain preview-only until Guard, Worker Fleet, BrowserOps isolation, Secrets Broker, receipts, and human approval boundaries are implemented for live runtime.

## Boundary

App Host must not expose live browser automation, credentialed browsing, material external sends, purchases/payments, destructive actions, production mutations, secret access, live repo mutation, or CI/test/security weakening.
