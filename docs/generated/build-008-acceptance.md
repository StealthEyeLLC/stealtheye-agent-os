# Build 8 acceptance checklist: BrowserOps Foundations + Minimal Build Automation Engine

## BrowserOps foundation

- [ ] BrowserOps schemas, helpers, fixtures, and tests exist.
- [ ] Browser sessions, page observations, evidence refs, action policies, and action plans validate.
- [ ] Guard requested-action conversion and Worker Fleet task-template conversion are covered.
- [ ] Safe observation can pass preflight with matching authority.
- [ ] Denied domain, untrusted registry, credentialed browsing, external send, money, auth, destructive, and production mutation paths block or escalate.

## Build automation engine

- [ ] `scripts/stealtheye-build.mjs` reads the phase spec and writes/checks generated state.
- [ ] `scripts/phases/build-008-browserops.mjs` declares Build 8 scope.
- [ ] Generated files exist under `docs/generated/`.
- [ ] Public-safe/no-live scanner runs in `--check` mode.

## Boundary

- [ ] No live browser automation, credentialed browsing, material external sends, purchases/payments, destructive actions, production mutation, secrets, or private endpoints are added.

## Next target

- [ ] Build 9 — Receipts + Replay.
