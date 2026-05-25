# Memory Graph

Build 12 adds fixture-only in-memory Memory Graph foundations. It models typed nodes, typed edges, provenance refs, evidence refs, receipt refs, confidence, recency, retention hints, deterministic query helpers, compaction helpers, retention reports, receipt previews, repo-status fixture conversion, and MCP runtime preview tools.

Allowed URI schemes are `memory://fixture/`, `receipt://fixture/`, `artifact://fixture/`, `docs://`, `github://public/`, and `test://`. Private, secret, local, database, tokenized, or storage-bucket schemes are rejected or flagged.

Runtime tools: `memory.graph.preview`, `memory.node.search.preview`, `memory.context.preview`, and `memory.retention.preview`. All are read-only, preview-only, fixture-only, non-destructive, side-effect-free, and live-write disabled.

Build 12 does not add production storage, vector search, embeddings, cloud storage, durable memory, private ingestion, live mutation, live memory service, secret storage, or production data workflows.
