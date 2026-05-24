export default {
  build: 10,
  title: "MCP Runtime + ChatGPT App Dev-Mode Connection",
  branch: "agent/mcp-runtime-devmode-connection",
  packageName: "@stealtheye/mcp-runtime",
  packageSummary: "`@stealtheye/mcp-runtime` exposes the existing safe App Host tools through an in-process MCP-style local/dev runtime with resources, metadata, capabilities, dev-mode connection metadata, and receipt previews.",
  projectMemorySummary: "Build 10 crosses from package-only contracts into a runnable local/dev MCP-style runtime surface for safe read-only and preview-only App Host tools. Memory Graph is moved after the first runtime/app connection.",
  foundationPackages: ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime"],
  importantFiles: ["packages/mcp-runtime/package.json", "packages/mcp-runtime/tsconfig.json", "packages/mcp-runtime/src/index.ts", "packages/mcp-runtime/src/schemas.ts", "packages/mcp-runtime/src/server.ts", "packages/mcp-runtime/src/transport.ts", "packages/mcp-runtime/src/app-host-adapter.ts", "packages/mcp-runtime/src/tool-router.ts", "packages/mcp-runtime/src/resources.ts", "packages/mcp-runtime/src/receipts.ts", "packages/mcp-runtime/src/dev-mode.ts", "packages/mcp-runtime/src/fixtures.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts", "scripts/phases/build-010-mcp-runtime-devmode.mjs"],
  docsUpdated: ["docs/MCP_RUNTIME.md", "docs/DEV_MODE_CONNECTION.md", "docs/DECISIONS/0012-mcp-runtime-devmode-connection.md", "README.md", "AGENTS.md", "llms.txt", "llms-full.txt", "docs/ARCHITECTURE.md", "docs/APP_HOST.md", "docs/CUSTOM_APPS.md", "docs/WORKFLOWS.md", "docs/RECEIPTS.md", "docs/REPLAY.md", "docs/EVALS.md", "docs/CONTROL_MATRIX.md", "docs/BUILD_PROMPTS.md", "docs/BUILD_AUTOMATION.md", "docs/SECURITY.md"],
  markerBoundedHandAuthoredDocs: [],
  handAuthoredDocPolicy: "Preserve accumulated hand-authored docs. Generated sync may write docs/generated files and any hand-authored updates must remain additive and marker-bounded for Build 10.",
  adr: "docs/DECISIONS/0012-mcp-runtime-devmode-connection.md",
  testsAndEvals: ["packages/mcp-runtime/test/mcp-runtime.test.ts", "runtime health local-dev status", "runtime capabilities safe families", "tool descriptor safety invariants", "safe App Host tool call routing", "invalid tool and invalid input rejection", "resource listing and reading", "receipt preview generation", "dev-mode metadata fixture safety", "no live write destructive money prod browser repo mutation exposure"],
  defaultEvalLocation: "packages/mcp-runtime/test/mcp-runtime.test.ts",
  ciRequiredFiles: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check"],
  generatedArtifacts: ["docs/generated/build-010-manifest.json", "docs/generated/build-010-acceptance.md", "docs/generated/build-010-handoff.md", "docs/generated/build-010-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  scannerExtraPaths: ["packages/mcp-runtime/src/fixtures.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts"],
  acceptanceItems: ["Runtime exposes list tools, call tool, list resources, read resource, health, capabilities, metadata, and dev-mode connection info.", "All exposed tools are read-only, preview-only, or fixture-only with disabled live capability status.", "Runtime routes App Host safe tools without exposing CodeOps, BrowserOps, Worker Fleet, repo mutation, money movement, credentials, production mutation, or destructive tools.", "Tool calls return public-safe receipt previews using Receipts + Replay event contracts.", "Resources are static or fixture-backed and public-safe."],
  safetyBoundaries: ["No live write actions, repo mutation, branch creation, commits, PR creation, CI reruns, BrowserOps execution, worker execution, replay execution, deployment, money movement, secret access, customer-data workflow, OAuth production credential, or public app submission is added.", "Runtime is local/dev and in-process testable; deployment and official SDK transport wiring are deferred.", "All fixtures and docs remain public-safe."],
  capabilityMatrix: [
    { capability: "mcp_style_list_tools", status: "implemented_local_dev", guard_required: false, live_enabled: false },
    { capability: "mcp_style_call_tool", status: "implemented_preview_only", guard_required: true, live_enabled: false },
    { capability: "runtime_resources", status: "implemented_fixture_only", guard_required: false, live_enabled: false },
    { capability: "dev_mode_connection_metadata", status: "implemented_fixture_only", guard_required: false, live_enabled: false },
    { capability: "live_write_tools", status: "blocked", guard_required: true, live_enabled: false }
  ],
  toolInventory: [
    { name: "MCP Runtime", package: "@stealtheye/mcp-runtime", mode: "local_dev_preview", live_external_effects: false },
    { name: "App Host safe tools", package: "@stealtheye/app-host", mode: "read_only_preview_fixture", live_external_effects: false }
  ],
  knownGaps: ["Official MCP SDK transport wiring is deferred; Build 10 uses a truthful MCP-style in-process wrapper.", "No public ChatGPT app submission, production deployment, public endpoint, or OAuth production credential is included.", "No live repo/status reads are included until Build 11.", "Durable ledger, durable Mission OS storage, Memory Graph, and production app registration remain future work."],
  nextTarget: "Build 11 — Live Read-Only Repo/Status Tools through Guard + Receipts"
};
