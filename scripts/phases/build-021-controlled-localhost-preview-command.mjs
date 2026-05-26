const testsAndEvals = [
  "command schema validates",
  "config schema validates",
  "plan schema validates",
  "readiness report schema validates",
  "developer-mode connection manifest schema validates",
  "disabled command mode allowed",
  "dry-run plan mode allowed",
  "static fixture preview mode allowed",
  "localhost config-required mode allowed",
  "localhost command future blocked",
  "hosted future blocked",
  "production deployment denied",
  "public app submission denied",
  "real OAuth client denied",
  "real app ID denied",
  "production domain denied",
  "real public endpoint denied",
  "unrestricted live write denied",
  "protected branch mutation denied",
  "destructive action denied",
  "production mutation denied",
  "customer/private data denied",
  "money movement denied",
  "material external send denied",
  "credential entry/storage denied",
  "external side effects denied",
  "unsafe command string denied",
  "unsafe working directory denied",
  "unsafe host denied",
  "unsafe port denied",
  "unsafe resource URI scheme denied",
  "remote asset denied",
  "server binding by default denied",
  "starts process in CI/default mode denied",
  "external network access denied",
  "tunnel provider live enablement denied",
  "missing fixture/preview/read-only flags denied",
  "missing receipt refs denied",
  "unknown command/connection mode denied",
  "command-plan receipt preview generated",
  "developer-mode resource connection manifest generated",
  "manifest includes MCP server resource inventory",
  "manifest includes UI/render resource inventory",
  "existing MCP server resources still list/read",
  "generated state strict sync passes",
  "protected docs unchanged",
  "no secrets/tokens/customer data/private endpoints in fixtures/docs",
  "no remote asset/script/style material",
  "no default server binding",
  "no process start in tests"
];

const importantFiles = [
  "packages/mcp-server/src/controlled-localhost-command.ts",
  "packages/mcp-server/src/developer-mode-resource-connection.ts",
  "packages/mcp-server/src/resource-registry.ts",
  "packages/mcp-server/src/index.ts",
  "packages/mcp-server/test/controlled-localhost-command.test.ts",
  "scripts/phases/build-021-controlled-localhost-preview-command.mjs"
];

const generatedArtifacts = [
  "docs/generated/build-021-manifest.json",
  "docs/generated/build-021-acceptance.md",
  "docs/generated/build-021-handoff.md",
  "docs/generated/build-021-receipt.json",
  "docs/generated/project-memory.json",
  "docs/generated/known-gaps.json",
  "docs/generated/safety-capability-matrix.json",
  "docs/generated/eval-registry.json",
  "docs/generated/tool-inventory.json",
  "docs/generated/build-state.json"
];

const docsUpdated = [
  "docs/CONTROLLED_LOCALHOST_PREVIEW.md",
  "docs/DECISIONS/0023-controlled-localhost-preview-command.md",
  ...generatedArtifacts
];

const ciRequiredFiles = [
  "pnpm install --no-frozen-lockfile",
  "pnpm typecheck",
  "pnpm test",
  "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-013-live-codeops-branch-write.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-014-official-mcp-server-transport.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-015-reachable-dev-deployment-endpoint.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-016-chatgpt-developer-mode-connection.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-017-core-control-plane-app.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-018-control-plane-ui-components.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-019-local-dev-ui-shell.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-020-mcp-resource-wiring-localhost-preview.mjs --check",
  "node scripts/stealtheye-build.mjs scripts/phases/build-021-controlled-localhost-preview-command.mjs --check"
];

const foundationPackages = ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime", "@stealtheye/repo-status", "@stealtheye/memory-graph", "@stealtheye/mcp-server", "@stealtheye/dev-endpoint", "@stealtheye/chatgpt-dev-connection", "@stealtheye/control-plane-app", "@stealtheye/control-plane-ui", "@stealtheye/local-dev-ui-shell"];

const packageSummary = "Controlled localhost preview command model and developer-mode resource connection metadata inside @stealtheye/mcp-server. Build 21 adds schema-validated command plans, readiness reports, safety decisions, and receipt previews without binding a server, starting a process, enabling a tunnel, or creating a real ChatGPT app.";
const handAuthoredDocPolicy = "Build 21 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 21 docs.";
const nextTarget = "Build 22 - Safe Local Preview Runner / Manual Developer-Mode Connection Checklist";

const safetyBoundaries = [
  "No server is bound by default.",
  "No process starts in CI or default mode.",
  "No production frontend deployment, production endpoint, production domain, public app submission, production OAuth credential, real app identifier, real public URL, tunnel credential, cloud credential, or customer/private data workflow is added.",
  "No unrestricted live write, protected branch mutation, destructive action, production mutation, material external send, credential entry/storage, external network access, tunnel live enablement, hosted public mode, remote script/style/asset, or money movement path is exposed.",
  "Command and connection metadata remains dry-run, config-required, fixture-only, preview-only, and read-only."
];

const knownGaps = [
  "No controlled local preview runner exists yet; Build 21 only models readiness and command plans.",
  "No real ChatGPT app, public app submission, production OAuth, real app ID, production domain, public endpoint, or tunnel credential exists.",
  "No production frontend, default server binding, process start in CI/default mode, external network access, hosted preview, or tunnel live enablement exists.",
  "No unrestricted live write path, protected branch mutation path, destructive path, production mutation path, customer/private data path, material external send path, credential entry path, or money movement path exists.",
  "No durable localhost preview ledger exists yet; Build 21 produces receipt previews only."
];

const phase = {
  build: 21,
  title: "Controlled Localhost Preview Command / Developer-Mode Resource Connection",
  branch: "agent/controlled-localhost-preview-command",
  packageName: "@stealtheye/mcp-server",
  strictGeneratedSync: true,
  generatedAt: "2026-01-01T00:00:00.000Z",
  importantFiles,
  docsUpdated,
  testsAndEvals,
  adr: "docs/DECISIONS/0023-controlled-localhost-preview-command.md",
  ciRequiredFiles,
  safetyBoundaries,
  generatedArtifacts,
  knownGaps,
  nextTarget,
  foundationPackages,
  packageSummary,
  projectMemorySummary: packageSummary,
  handoffSummary: "Build 21 adds a controlled localhost preview command/readiness layer and developer-mode resource connection metadata while preserving the local/dev public-safe boundary.",
  handAuthoredDocPolicy,
  acceptanceItems: [
    "ControlledLocalhostPreviewCommand, config, plan, readiness report, safety policy, safety decision, receipt preview, and developer-mode connection schemas validate.",
    "disabled, dry_run_plan, static_fixture_preview, and localhost_config_required modes are allowed as metadata-only modes.",
    "localhost_command_future and hosted_future remain blocked/future.",
    "Developer-mode resource connection manifest includes MCP server, dev endpoint, localhost preview, UI resource, and render resource summaries.",
    "Receipt previews include command mode, config summary, resource inventory summary, developer-mode connection stage, safety decision, read-only/fixture/preview status, no-secret/no-production/no-public-submission/no-money statements, and result status.",
    "Existing MCP server resources still list and read.",
    "Official docs checked are documented in docs/CONTROLLED_LOCALHOST_PREVIEW.md and ADR 0023.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  toolInventory: [
    { name: "mcp_server.controlled_localhost_preview_readiness", package: "@stealtheye/mcp-server", mode: "readonly_command_readiness_metadata", live_external_effects: false },
    { name: "mcp_server.controlled_localhost_preview_plan", package: "@stealtheye/mcp-server", mode: "dry_run_fixture_plan", live_external_effects: false },
    { name: "mcp_server.developer_mode_resource_connection_manifest", package: "@stealtheye/mcp-server", mode: "readonly_config_required_connection_metadata", live_external_effects: false },
    { name: "mcp_server.command_plan_receipt_preview", package: "@stealtheye/mcp-server", mode: "fixture_receipt_preview", live_external_effects: false }
  ],
  capabilityMatrix: [
    { capability: "controlled_localhost_preview_command_model", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "developer_mode_resource_connection_metadata", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "dry_run_plan_mode", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "static_fixture_preview_mode", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "localhost_config_required_mode", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "localhost_command_future", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "hosted_public_preview", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "server_binding_by_default", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "process_start_in_ci_or_default_mode", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "remote_scripts_styles_assets", status: "blocked", guard_required: true, live_enabled: false }
  ],
  defaultEvalLocation: "packages/mcp-server/test",
  scannerExtraPaths: [
    "packages/mcp-server/src/controlled-localhost-command.ts",
    "packages/mcp-server/src/developer-mode-resource-connection.ts",
    "packages/mcp-server/src/resource-registry.ts",
    "packages/mcp-server/test/controlled-localhost-command.test.ts"
  ],
  requiredFiles: [
    ...importantFiles,
    ...docsUpdated,
    ".github/workflows/build-021-controlled-localhost-preview-command.yml"
  ]
};

export default phase;
