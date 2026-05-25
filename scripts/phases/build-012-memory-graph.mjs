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
const llmsFull = `# llms-full.txt

## Project summary

StealthEye Agent OS is a foundation for broad delegated autonomy: authorized online-task agents operating through ChatGPT custom apps/MCP, durable workers, Mission OS, app-host surfaces, mission-scoped authority, signed manifests, Guard decisions, CodeOps, CI Repair, evals, receipts, replayable evidence, Memory Graph context, and compliance-ready controls. This public repo contains non-sensitive architecture, specs, governance, scaffolding, eval templates, generated build state, and compliance planning only.

## Current build state

Build 1 established the public-visible, locked-down repo posture, baseline docs, branch/PR workflow, public/private boundary, and no-secrets foundation for later packages.

Build 2 adds \`@stealtheye/agent-registry\`: signed agent/tool manifests, JSON Schema export, deterministic canonicalization, SHA-256 digesting, Ed25519 signing/verification helpers, risk-relevant diffing, in-memory trust registry, revocation lists, public fixtures, and Vitest eval-style cases.

Build 3 adds \`@stealtheye/guard\`: capability-token schemas, requested actions, Guard decisions/receipts, lifecycle helpers, deterministic token/action matching, hard-stop evaluation, registry trust checks, public fixtures, and Vitest eval-style cases.

Build 4 adds \`@stealtheye/mission-os\`: StealthEye Mission Language, normalized mission schemas, authority envelopes, lightweight mission plans, status snapshots, receipt references, compiler outputs for Guard capability-token templates and requested actions, public fixtures, and Vitest eval-style cases.

Build 5 adds \`@stealtheye/app-host\`: app metadata, MCP-style preview tool descriptors, input/output schemas, resource descriptors, fixture-backed handlers, and Vitest eval-style tests for host, mission, Guard, registry, and policy tool families. All Build 5 tools are read-only, fixture-only, or preview-only.

Build 6 adds \`@stealtheye/worker-fleet\`: typed worker task schemas, task types/statuses, lease schemas with fencing tokens, idempotency records and stable action fingerprints, retry policy/state helpers, task status summaries, artifact references, worker receipt events, Guard preflight helpers, Mission OS plan-to-worker-task conversion, fixtures, and Vitest eval-style tests.

Build 7 adds \`@stealtheye/codeops\`: CodeOps + CI Repair schemas, repository targets, branch/path safety helpers, patch plans, file-change contracts, verification plans, CI log summaries/classifiers, repair plans, rerun eligibility policy, PR evidence packets, Guard requested-action adapters, Worker Fleet task templates, fixtures, and Vitest eval-style tests.

Build 8 adds \`@stealtheye/browserops\`: fixture-only browser sessions, page observations, evidence refs, action policies, action plans, Guard preflight, Worker Fleet task templates, public-safe fixtures, generated build state, and marker-bounded hand-authored doc preservation.

Build 9 adds \`@stealtheye/receipts-replay\`: receipt event schemas, evidence refs, receipt bundles, mission timeline helpers, descriptive replay packets, verification packets, final report packets, deterministic integrity digests, adapters from existing subsystem fixtures, and generated build state.

Build 10 adds \`@stealtheye/mcp-runtime\`: a local/dev in-process MCP-style runtime wrapper around the safe App Host tool surface. It adds runtime metadata, health/capabilities, tool listing/calls, resource listing/reads, dev-mode connection information, transport-style request handling, and public-safe receipt previews.

Build 11 adds \`@stealtheye/repo-status\`: Guard-gated public GitHub repository/status observation plus read-only repo/status tools in \`@stealtheye/mcp-runtime\`. It models public repo metadata, branch metadata, PR/issue metadata, workflow/check summaries, public-safe file metadata/content, read policy, Guard adapter decisions, receipt previews, fixture clients, and an optional unauthenticated public REST client constrained to GET requests against \`https://api.github.com\` for an explicit public repository allowlist.

Build 12 adds \`@stealtheye/memory-graph\`: fixture-only, deterministic, in-memory Memory Graph schemas, helpers, fixtures, tests, generated-state declarations, and preview-only runtime tools. It defines typed memory nodes and edges, provenance/source references, evidence and receipt refs, confidence, recency, retention hints, query helpers, compaction helpers, retention reports, public-safe context summaries, receipt previews, generated build-state refs, and fixture-backed conceptual integration with Mission OS, Receipts + Replay, Repo Status, MCP Runtime, and build automation.

## Architecture overview

The default stack remains a TypeScript monorepo with Node.js MCP runtimes, future durable mission/control/evidence state, future worker queues, future artifact storage, future guarded repository auth, future BrowserOps execution, OpenAI Responses API + Apps SDK integration, and Zod + JSON Schema for mission/tool/workflow/receipt/authority/agent-card/worker/codeops/memory schemas.

Key systems: Mission OS, App Host, Agent Registry, Guard, Capability Tokens, Worker Fleet, CodeOps, CI Repair, BrowserOps, Receipts + Replay, MCP Runtime, Repo Status, Memory Graph, Evals, Workflow Compiler, Semantic Firewall, A2A Subagent Network, Agent Arena, StagingOps/Observability, and domain ops apps.

## Memory Graph model

Memory Graph is the durable-knowledge model foundation, but Build 12 is deliberately storage-free. It models nodes such as mission, task, agent, tool, repo, branch, pull_request, issue, workflow_run, file, receipt_event, evidence_ref, build, decision, capability, policy, gap, fact, and summary. It models edges such as derived_from, supports, contradicts, supersedes, references, produced_by, verified_by, blocked_by, depends_on, belongs_to, related_to, summarizes, observed_in, and governed_by.

Build 12 helpers validate graph bundles, retrieve nodes, list nodes by type, list edges, find connected nodes, search by tag/text, filter by source type/confidence/sensitivity, produce mission/task context packets, produce public-safe summaries, compact related summary nodes, detect stale or superseded facts, and produce retention reports. It keeps provenance and receipt references through compaction and retention reporting and does not delete anything.

## Public/private boundary

Public: architecture, public specs, non-sensitive schemas, app/tool scaffolding, worker-fleet contracts, CodeOps/CI Repair contracts, BrowserOps contracts, Receipts + Replay contracts, MCP Runtime local/dev contracts, Repo Status public-read contracts, Memory Graph fixture-only contracts, generated build state, examples/mock data, eval templates, governance and compliance docs. Private: sensitive operational material, production infrastructure, deployed runtime configuration, production receipt ledgers, artifact storage credentials, durable memory storage, and internal accounts.

## Verification commands

\`\`\`bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check
node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check
node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check
node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check
\`\`\`

## Next target

Build 13: Live CodeOps Branch-Write Path through Guard + Receipts.
`;
const build12Marker = `## Build 12 additive update: Memory Graph Foundations

Build 12 adds \`@stealtheye/memory-graph\` as a fixture-only, deterministic, in-memory foundation`;
const build12PromptMarker = `## Build 12 prompt outcome

Build 12 implements Memory Graph Foundations in \`@stealtheye/memory-graph\``;
const markerDocs = ["README.md", "AGENTS.md", "docs/ARCHITECTURE.md", "docs/MCP_RUNTIME.md", "docs/RECEIPTS.md", "docs/REPLAY.md", "docs/BUILD_PROMPTS.md", "docs/SECURITY.md"];
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
  docsUpdated: ["llms.txt", "llms-full.txt", "docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md", ...markerDocs],
  adr: "docs/DECISIONS/0014-memory-graph-foundation.md",
  testsAndEvals: ["memory graph package tests", "runtime memory preview tools tests", "strict generated sync check"],
  defaultEvalLocation: "packages/memory-graph/test/memory-graph.test.ts",
  ciRequiredFiles: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check"],
  generatedArtifacts: ["docs/generated/build-012-manifest.json", "docs/generated/build-012-acceptance.md", "docs/generated/build-012-handoff.md", "docs/generated/build-012-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  requiredFiles: ["packages/memory-graph/package.json", "packages/memory-graph/tsconfig.json", "packages/memory-graph/src/index.ts", "packages/memory-graph/src/schemas.ts", "packages/memory-graph/src/nodes.ts", "packages/memory-graph/src/edges.ts", "packages/memory-graph/src/provenance.ts", "packages/memory-graph/src/query.ts", "packages/memory-graph/src/compaction.ts", "packages/memory-graph/src/retention.ts", "packages/memory-graph/src/receipts.ts", "packages/memory-graph/src/fixtures.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md", "docs/DECISIONS/0014-memory-graph-foundation.md", ...markerDocs],
  scannerExtraPaths: ["packages/memory-graph/src/fixtures.ts", "packages/memory-graph/test/memory-graph.test.ts", "packages/mcp-runtime/src/memory-graph-adapter.ts", "docs/MEMORY_GRAPH.md"],
  acceptanceItems: ["Memory Graph schemas/helpers/fixtures/tests exist.", "Runtime Memory Graph preview tools are read-only preview-only fixture-only.", "Build 12 strict generated sync is enabled."],
  safetyBoundaries: ["Fixture-only and in-memory.", "No production database, vector DB, embeddings, cloud storage, private/customer data ingestion, durable personal memory, live memory service, or secret storage.", "Retention and compaction helpers report/model only and delete nothing."],
  capabilityMatrix: [{ capability: "memory_graph_foundation", status: "implemented_fixture_only", guard_required: false, live_enabled: false }, { capability: "durable_memory_storage", status: "blocked_future_work", guard_required: true, live_enabled: false }],
  toolInventory: [{ name: "Memory Graph preview tools", package: "@stealtheye/memory-graph", mode: "fixture_only_preview", live_external_effects: false }],
  knownGaps: ["No durable memory storage, vector search, embeddings, private/customer data ingestion, or live memory service.", "Runtime memory tools are fixture-only previews."],
  nextTarget: "Build 13 — Live CodeOps Branch-Write Path through Guard + Receipts",
  handAuthoredDocPolicy: "Preserve hand-authored docs. Build 12 predictable standalone docs, LLM context, and generated state are declared in this phase spec.",
  markerBoundedHandAuthoredDocs: markerDocs,
  markerBoundedDocUpdates: {
    "README.md": build12Marker,
    "AGENTS.md": build12Marker,
    "docs/ARCHITECTURE.md": build12Marker,
    "docs/MCP_RUNTIME.md": build12Marker,
    "docs/RECEIPTS.md": build12Marker,
    "docs/REPLAY.md": build12Marker,
    "docs/BUILD_PROMPTS.md": build12PromptMarker,
    "docs/SECURITY.md": build12Marker
  },
  standaloneDocs: { "docs/MEMORY_GRAPH.md": memoryGraphDoc, "docs/DECISIONS/0014-memory-graph-foundation.md": adrDoc },
  llmContextUpdates: { "llms.txt": llmsTxt, "llms-full.txt": llmsFull }
};
