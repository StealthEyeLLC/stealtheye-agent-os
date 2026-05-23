# Receipts

Receipts are the future durable evidence ledger for StealthEye missions. Build 8 extends receipt expectations to BrowserOps and generated build state, but it does not add a production receipt ledger.

## BrowserOps receipt expectations

BrowserOps receipts should eventually capture sessions, page observations, evidence refs, action policies, action plans, Guard requested actions, Guard decisions, Worker Fleet task refs, denials, escalations, and fixture-completed outcomes.

Build 8 evidence is reference-only. Receipts may point to fixture refs for screenshots, DOM snapshots, accessibility trees, logs, traces, HARs, videos, and downloaded-file metadata, but no real browser artifact bytes are included.

## Generated state receipts

Build 8 generated state includes `docs/generated/build-008-receipt.json`. It is a source-controlled public-safe snapshot, not a production durable ledger entry.

## Next step

Build 9 should implement Receipts + Replay as first-class schemas and deterministic helpers across Mission OS, Guard, Worker Fleet, CodeOps, BrowserOps, generated build state, final reports, and verifier handoff packets.
