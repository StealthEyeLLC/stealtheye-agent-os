const memoryGraphDoc = `# Memory Graph

Build 12 introduces \`@stealtheye/memory-graph\` as a fixture-only, in-memory foundation package for typed memory nodes, typed relationships, provenance/source refs, evidence and receipt refs, confidence, recency, retention hints, query helpers, compaction helpers, and retention reports.

It does not add a production database, vector database, embeddings provider, cloud storage, private or customer data ingestion, durable personal memory, live memory service, production mutation, or secret storage. Runtime tools are read-only, preview-only, fixture-only, no-storage, and no-embeddings.
`;
const adrDoc = `# ADR 0014: Memory Graph Foundation

## Status

Accepted for Build 12.

## Decision

Add \`@stealtheye/memory-graph\` as a fixture-only in-memory schema/helper foundation. Add fixture-only MCP runtime preview tools. Set \`strictGeneratedSync: true\` for Build 12 so generated/synced output drift fails CI.

## Boundaries

No production database, vector DB, embeddings, cloud storage, private/customer data ingestion, durable personal memory, live memory service, live writes, deployment, or secret storage.

## Next

Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
`;
const llmsTxt = `# llms.txt

Current build: Build 12 — Memory Graph Foundations.

Package: \`packages/memory-graph\`. Runtime integration: \`packages/mcp-runtime/src/memory-graph-adapter.ts\`. Phase spec: \`scripts/phases/build-012-memory-graph.mjs\`.

Build 12 is fixture-only and in-memory. It adds typed memory graph schemas/helpers/fixtures/tests and preview-only runtime tools. It adds no production storage, vector DB, embeddings, private/customer data ingestion, durable personal memory, live memory service, or secrets.

Next target: Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts.
`;
const llmsFull = `${llmsTxt}
Memory node types cover mission, task, agent, tool, repo, branch, pull_request, issue, workflow_run, file, receipt_event, evidence_ref, build, decision, capability, policy, gap, fact, and summary. Runtime preview tools are memory.graph.preview, memory.node.search.preview, memory.context.preview, and memory.retention.preview.
`;
export default {
  build: 12,
  title: "Memory Graph Foundations",
  branch: "agent/memory-graph-foundation",
  packageName: "@stealtheye/memory-graph",
  strictGeneratedSync: true,
  generatedAt: "2026-01-01T00:00:00.000Z",
  packageSummary: "`@stealtheye/memory-graph` defines fixture-only, deterministic, in-memory Memory Graph schemas, helpers, fixtures, tests, and preview-only runtime tools.",
  projectMemorySummary: "Build 12 adds Memory Graph foundations and strict generated sync.",
  foundationPackages: ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime", "@stealtheye/repo-status", "@stealtheye/memory-graph"],
  importantFiles: ["packages/memory-graph/src/schemas.ts", "packages/memory-graph/src/query.ts", "packages/memory-graph/src/compaction.ts", "packages/memory-graph/src/retention.ts", "packages/memory-graph/src/receipts.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "scripts/phases/build-012-memory-graph.mjs"],
  docsUpdated: ["llms.txt", "llms-full.txt", "docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md"],
  adr: "docs/DECISIONS/0014-memory-graph-foundation.md",
  testsAndEvals: ["memory graph package tests", "runtime memory preview tools tests", "strict generated sync check"],
  defaultEvalLocation: "packages/memory-graph/test/memory-graph.test.ts",
  ciRequiredFiles: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check"],
  generatedArtifacts: ["docs/generated/build-012-manifest.json", "docs/generated/build-012-acceptance.md", "docs/generated/build-012-handoff.md", "docs/generated/build-012-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  requiredFiles: ["packages/memory-graph/package.json", "packages/memory-graph/tsconfig.json", "packages/memory-graph/src/index.ts", "packages/memory-graph/src/schemas.ts", "packages/memory-graph/src/nodes.ts", "packages/memory-graph/src/edges.ts", "packages/memory-graph/src/provenance.ts", "packages/memory-graph/src/query.ts", "packages/memory-graph/src/compaction.ts", "packages/memory-graph/src/retention.ts", "packages/memory-graph/src/receipts.ts", "packages/memory-graph/src/fixtures.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md"],
  scannerExtraPaths: ["packages/memory-graph/src/fixtures.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md"],
  acceptanceItems: ["Memory Graph schemas/helpers/fixtures/tests exist.", "Runtime Memory Graph preview tools are read-only preview-only fixture-only.", "Build 12 strict generated sync is enabled."],
  safetyBoundaries: ["Fixture-only and in-memory.", "No production database, vector DB, embeddings, cloud storage, private/customer data ingestion, durable personal memory, live memory service, or secret storage.", "Retention and compaction helpers report/model only and delete nothing."],
  capabilityMatrix: [{ capability: "memory_graph_foundation", status: "implemented_fixture_only", guard_required: false, live_enabled: false }, { capability: "durable_memory_storage", status: "blocked_future_work", guard_required: true, live_enabled: false }],
  toolInventory: [{ name: "Memory Graph preview tools", package: "@stealtheye/memory-graph", mode: "fixture_only_preview", live_external_effects: false }],
  knownGaps: ["No durable memory storage, vector search, embeddings, private/customer data ingestion, or live memory service.", "Runtime memory tools are fixture-only previews."],
  nextTarget: "Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts",
  handAuthoredDocPolicy: "Preserve hand-authored docs. Build 12 predictable standalone docs, LLM context, and generated state are declared in this phase spec.",
  markerBoundedHandAuthoredDocs: [],
  markerBoundedDocUpdates: {},
  standaloneDocs: { "docs/MEMORY_GRAPH.md": memoryGraphDoc, "docs/DECISIONS/0014-memory-graph-foundation.md": adrDoc },
  llmContextUpdates: { "llms.txt": llmsTxt, "llms-full.txt": llmsFull }
};
