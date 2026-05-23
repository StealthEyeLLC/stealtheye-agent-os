# Evidence Model

Evidence must make autonomous work inspectable, replayable, and auditable.

## Evidence objects

Mission record, authority envelope, agent/tool identity, manifest digest, tool-call receipt, approval/denial, diff, log, screenshot, trace, artifact, CI result, browser QA result, eval result, and final report.

## Storage direction

Postgres stores durable state and ledger metadata. S3/R2-compatible object storage stores artifacts. Receipts reference artifacts by digest and URI without exposing secrets.

## Integrity

Future builds should add content digests, manifest signatures, append-only receipt semantics, and replay verification.
