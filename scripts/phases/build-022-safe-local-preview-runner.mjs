const testsAndEvals = [
  "safe local preview runner config schema validates",
  "runner readiness report schema validates",
  "manual run checklist schema validates",
  "manual developer-mode connection checklist schema validates",
  "receipt preview schema validates",
  "allowed runner modes are allowed",
  "blocked/future runner modes are denied",
  "unknown runner mode is denied",
  "production deployment is denied",
  "public app submission is denied",
  "real OAuth client is denied",
  "real app ID is denied",
  "production domain is denied",
  "real public endpoint is denied",
  "unrestricted live write is denied",
  "protected branch mutation is denied",
  "destructive action is denied",
  "production mutation is denied",
  "customer/private data is denied",
  "money movement is denied",
  "material external send is denied",
  "credential entry/storage is denied",
  "external side effects are denied",
  "unsafe command string is denied",
  "unsafe working directory is denied",
  "unsafe host is denied",
  "unsafe port is denied",
  "unsafe resource URI scheme is denied",
  "remote asset/script/style is denied",
  "server binding by default is denied",
  "process start in CI/default mode is denied",
  "external network access is denied",
  "tunnel provider live enablement is denied",
  "hosted/public mode is denied",
  "auto-start mode is denied",
  "missing read-only/preview/manual-gating flags are denied",
  "missing receipt refs are denied",
  "manual checklist includes no-secret/no-production/no-public-submission/no-tunnel/no-default-binding/no-process-start checks",
  "developer-mode checklist does not create a real ChatGPT app",
  "developer-mode checklist does not include a real app ID",
  "developer-mode checklist does not include a production OAuth client",
  "developer-mode checklist does not include a real public URL",
  "MCP resources list includes Build 22 resources",
  "MCP resources read returns read-only Build 22 metadata",
  "existing Build 21 resources still list/read",
  "generated state strict sync behavior is represented",
  "protected docs are unchanged by the PR",
  "no secrets/tokens/customer data/private endpoints are present in fixtures/docs",
  "no prohibited remote asset/script/style material is present",
  "no default server binding appears in Build 22 implementation/generated state",
  "no process start appears in CI/default implementation path"
];
const importantFiles = ["packages/mcp-server/src/safe-local-preview-runner.ts", "packages/mcp-server/src/manual-developer-mode-checklist.ts", "packages/mcp-server/src/resource-registry.ts", "packages/mcp-server/src/index.ts", "packages/mcp-server/test/safe-local-preview-runner.test.ts", "scripts/phases/build-022-safe-local-preview-runner.mjs"];
const generatedArtifacts = ["docs/generated/build-022-manifest.json", "docs/generated/build-022-acceptance.md", "docs/generated/build-022-handoff.md", "docs/generated/build-022-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"];
const docsUpdated = ["docs/SAFE_LOCAL_PREVIEW_RUNNER.md", "docs/DECISIONS/0024-safe-local-preview-runner.md", ...generatedArtifacts];
const ciRequiredFiles = ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-013-live-codeops-branch-write.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-014-official-mcp-server-transport.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-015-reachable-dev-deployment-endpoint.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-016-chatgpt-developer-mode-connection.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-017-core-control-plane-app.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-018-control-plane-ui-components.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-019-local-dev-ui-shell.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-020-mcp-resource-wiring-localhost-preview.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-021-controlled-localhost-preview-command.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-022-safe-local-preview-runner.mjs --check"];
const foundationPackages = ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime", "@stealtheye/repo-status", "@stealtheye/memory-graph", "@stealtheye/mcp-server", "@stealtheye/dev-endpoint", "@stealtheye/chatgpt-dev-connection", "@stealtheye/control-plane-app", "@stealtheye/control-plane-ui", "@stealtheye/local-dev-ui-shell"];
const packageSummary = "Safe local preview runner model and manual developer-mode connection checklist inside @stealtheye/mcp-server. Build 22 adds schema-validated runner metadata, manual checklists, safety decisions, receipt previews, and read-only MCP resources without binding a server, starting a process, enabling a tunnel, creating a real ChatGPT app, or exposing a public endpoint.";
const handAuthoredDocPolicy = "Build 22 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 22 docs.";
const nextTarget = "Build 23 - Durable Public-Safe Preview Receipt Ledger / Verifier-Reviewed Manual Preview Evidence";
const safetyBoundaries = ["No server is bound by default.", "No process starts in CI or default mode.", "No tunnel, public endpoint, production OAuth, real app ID, production domain, real ChatGPT app creation, public app submission, unrestricted live write, protected branch mutation, destructive action, customer/private data workflow, money movement, material external send, or external side effect is added.", "Runner and connection metadata remains local/dev, preview-only, fixture-safe, manually gated, read-only by default, and public-safe."];
const knownGaps = ["No real ChatGPT app is created.", "No public app submission exists.", "No production OAuth exists.", "No real app ID exists.", "No production domain exists.", "No public endpoint exists.", "No tunnel live enablement exists.", "No default server binding exists.", "No process start occurs in CI/default mode.", "Manual local preview execution remains gated and config-required.", "Developer-mode connection remains manual and checklist-based.", "No customer/private data workflow exists.", "No unrestricted live write path exists.", "No durable live preview ledger exists beyond public-safe receipt preview metadata."];
const toolInventory = [
  { name: "mcp_server.safe_local_preview_runner_readiness", package: "@stealtheye/mcp-server", mode: "readonly_runner_readiness_metadata", live_external_effects: false },
  { name: "mcp_server.safe_local_preview_runner_manual_run_checklist", package: "@stealtheye/mcp-server", mode: "readonly_manual_checklist_metadata", live_external_effects: false },
  { name: "mcp_server.manual_developer_mode_connection_checklist", package: "@stealtheye/mcp-server", mode: "readonly_developer_mode_checklist_metadata", live_external_effects: false },
  { name: "mcp_server.safe_local_preview_runner_receipt_preview", package: "@stealtheye/mcp-server", mode: "fixture_receipt_preview", live_external_effects: false }
];
const capabilityMatrix = [
  { capability: "safe_local_preview_runner_model", status: "implemented", guard_required: true, live_enabled: false },
  { capability: "manual_developer_mode_connection_checklist", status: "implemented", guard_required: true, live_enabled: false },
  { capability: "read_only_mcp_build22_resources", status: "implemented", guard_required: true, live_enabled: false },
  { capability: "default_server_binding", status: "blocked", guard_required: true, live_enabled: false },
  { capability: "process_start_in_ci_or_default_mode", status: "blocked", guard_required: true, live_enabled: false },
  { capability: "tunnel_or_public_endpoint", status: "blocked", guard_required: true, live_enabled: false }
];
const phase = { build: 22, title: "Safe Local Preview Runner / Manual Developer-Mode Connection Checklist", branch: "agent/safe-local-preview-runner", packageName: "@stealtheye/mcp-server", strictGeneratedSync: true, generatedAt: "2026-01-01T00:00:00.000Z", importantFiles, docsUpdated, testsAndEvals, adr: "docs/DECISIONS/0024-safe-local-preview-runner.md", ciRequiredFiles, safetyBoundaries, generatedArtifacts, knownGaps, nextTarget, foundationPackages, packageSummary, projectMemorySummary: packageSummary, handoffSummary: "Build 22 adds a safe local preview runner model and manual developer-mode connection checklist while preserving the Build 21 public-safe local/dev boundary.", handAuthoredDocPolicy, acceptanceItems: ["Safe local preview runner schemas, helpers, safety decisions, readiness report, manual-run checklist, and receipt preview validate.", "Manual developer-mode connection checklist and manifest schemas validate.", "Allowed runner modes are metadata-only and blocked/future runner modes are denied.", "MCP resources expose Build 22 readiness, manual-run checklist, developer-mode checklist, and receipt-preview metadata as read-only public-safe resources.", "Generated sync is strict and deterministic for Build 22.", "Protected docs are untouched."], toolInventory, capabilityMatrix, defaultEvalLocation: "packages/mcp-server/test", scannerExtraPaths: ["packages/mcp-server/src/safe-local-preview-runner.ts", "packages/mcp-server/src/manual-developer-mode-checklist.ts", "packages/mcp-server/src/resource-registry.ts"], requiredFiles: [...importantFiles, ...docsUpdated, ".github/workflows/build-022-safe-local-preview-runner.yml"] };
export default phase;
