const memoryGraphDoc = `# Memory Graph

Build 12 adds fixture-only in-memory Memory Graph foundations. It models typed nodes, typed edges, provenance refs, evidence refs, receipt refs, confidence, recency, retention hints, deterministic query helpers, compaction helpers, retention reports, receipt previews, repo-status fixture conversion, and MCP runtime preview tools.

Allowed URI schemes are \`memory://fixture/\`, \`receipt://fixture/\`, \`artifact://fixture/\`, \`docs://\`, \`github://public/\`, and \`test://\`. Private, secret, local, database, tokenized, or storage-bucket schemes are rejected or flagged.

Runtime tools: \`memory.graph.preview\`, \`memory.node.search.preview\`, \`memory.context.preview\`, and \`memory.retention.preview\`. All are read-only, preview-only, fixture-only, non-destructive, side-effect-free, and live-write disabled.

Build 12 does not add production storage, vector search, embeddings, cloud storage, durable memory, private ingestion, live mutation, live memory service, secret storage, or production data workflows.
`;
const adrDoc = `# ADR 0014: Memory Graph Foundation

## Status

Accepted for Build 12.

## Decision

Add \`@stealtheye/memory-graph\` as a fixture-only in-memory package and add MCP runtime preview tools that read from fixtures only.

The package defines typed memory node schemas, typed memory edge schemas, source refs, evidence refs, receipt refs, confidence and retention fields, query helpers, compaction helpers, retention helpers, repo-status fixture conversion helpers, generated build-state fixture conversion, and receipt previews.

## Boundaries

Build 12 has no production database, vector database, embeddings provider, cloud storage, durable personal memory, live memory service, production mutation, live writes, private ingestion, or secret storage.

## Next

Build 13 should implement Live CodeOps Branch-Write Path through Guard + Receipts.
`;
export default {
  "build": 12,
  "title": "Memory Graph Foundations",
  "branch": "agent/memory-graph-foundation-v2",
  "packageName": "@stealtheye/memory-graph",
  "strictGeneratedSync": true,
  "packageSummary": "Fixture-only in-memory Memory Graph package and MCP runtime preview tools.",
  "projectMemorySummary": "Build 12 adds fixture-only Memory Graph foundations without durable storage, embeddings, live writes, private ingestion, or secret storage.",
  "handoffSummary": "Build 12 adds fixture-only Memory Graph foundations and MCP runtime preview tools.",
  "foundationPackages": ["@stealtheye/memory-graph", "@stealtheye/mcp-runtime"],
  "importantFiles": ["packages/memory-graph/src/schemas.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "scripts/phases/build-012-memory-graph.mjs"],
  "docsUpdated": ["docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md", "docs/generated/build-012-manifest.json", "docs/generated/build-012-acceptance.md", "docs/generated/build-012-handoff.md", "docs/generated/build-012-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  "markerBoundedHandAuthoredDocs": [],
  "handAuthoredDocPolicy": "Build 12 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 12 docs.",
  "adr": "docs/DECISIONS/0014-memory-graph-foundation.md",
  "testsAndEvals": ["memory graph package tests", "runtime memory preview tests", "Build 12 strict generated sync check"],
  "defaultEvalLocation": "packages/memory-graph/test/memory-graph.test.ts",
  "ciRequiredFiles": ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check"],
  "generatedArtifacts": ["docs/generated/build-012-manifest.json", "docs/generated/build-012-acceptance.md", "docs/generated/build-012-handoff.md", "docs/generated/build-012-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  "requiredFiles": ["packages/memory-graph/package.json", "packages/memory-graph/src/schemas.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md"],
  "scannerExtraPaths": ["packages/memory-graph/src/fixtures.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md"],
  "acceptanceItems": ["Memory Graph schemas, helpers, fixtures, and tests exist.", "Runtime exposes fixture-only memory preview tools.", "Strict generated sync is true.", "Protected docs are untouched."],
  "safetyBoundaries": ["No production database, vector database, embeddings provider, cloud storage, durable memory, live memory service, production mutation, live writes, private ingestion, or secret storage is added.", "Runtime memory tools are read-only, preview-only, fixture-only, non-destructive, side-effect-free, and live-write disabled.", "Retention helpers report only and never delete records."],
  "capabilityMatrix": [{ "capability": "memory_graph_foundation", "status": "implemented_fixture_only", "guard_required": true, "live_enabled": false }, { "capability": "live_memory_service", "status": "blocked_future_work", "guard_required": true, "live_enabled": false }],
  "toolInventory": [{ "name": "Memory Graph preview tools", "package": "@stealtheye/mcp-runtime", "mode": "fixture_only_preview", "live_external_effects": false }],
  "knownGaps": ["No durable persistence is included.", "No vector database or embedding provider is included.", "No private ingestion or live memory service is included."],
  "nextTarget": "Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts",
  "standaloneDocs": { "docs/MEMORY_GRAPH.md": memoryGraphDoc, "docs/DECISIONS/0014-memory-graph-foundation.md": adrDoc }
};
