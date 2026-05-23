# Mission OS

Mission OS owns mission intake, Mission Language validation, normalization, authority envelopes, plans, status snapshots, receipt refs, and final-report expectations.

## Build 8 BrowserOps expectations

Mission-to-BrowserOps handoff should preserve mission ID, task ID, browser session refs, page observation refs, action plan refs, expected effects, evidence requirements, receipt requirements, risk tier, Guard preflight status, and Worker Fleet task refs.

Build 8 BrowserOps plans are fixture-only. Mission OS must not treat them as executable browser authority.

## Authority boundary

Mission OS may represent intended browser work, but Guard and BrowserOps policy must block or escalate credentialed browsing, external sends, purchases/payments, auth submits, destructive confirmations, production mutation, denied domains, denied actions, and untrusted registry summaries.

## Next path

Build 9 should add Receipts + Replay so Mission OS can reference durable BrowserOps preflight packets, evidence refs, action decisions, and final report state.
