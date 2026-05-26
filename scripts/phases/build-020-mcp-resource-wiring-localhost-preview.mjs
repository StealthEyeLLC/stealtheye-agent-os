const testsAndEvals = [
  "MCP server lists UI resources",
  "MCP server reads UI resources",
  "MCP server lists render resources",
  "MCP server reads rendered shell resources",
  "rendered resource contains deterministic static HTML",
  "rendered resource includes boundary banner",
  "rendered resource includes receipt preview",
  "localhost preview metadata schema validates",
  "disabled preview mode allowed",
  "static fixture preview mode allowed",
  "localhost config-required mode allowed",
  "localhost bound future blocked",
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
  "unsafe resource URI scheme denied",
  "remote asset denied",
  "server binding by default denied",
  "external network access denied",
  "tunnel provider live enablement denied",
  "missing fixture/preview/read-only flags denied",
  "missing receipt refs denied",
  "unknown resource/preview mode denied",
  "resource read receipt preview generated",
  "existing MCP server resources still list/read",
  "generated state strict sync passes",
  "protected docs unchanged",
  "no tokens/customer data/private endpoints in fixtures/docs",
  "no remote asset/script/style material",
  "no default server binding"
];

const importantFiles = [
  "packages/mcp-server/package.json",
  "packages/mcp-server/src/ui-resource-adapter.ts",
  "packages/mcp-server/src/localhost-preview.ts",
  "packages/mcp-server/src/resource-registry.ts",
  "packages/mcp-server/src/index.ts",
  "packages/mcp-server/test/mcp-server-resource-wiring.test.ts",
  "scripts/phases/build-020-mcp-resource-wiring-localhost-preview.mjs"
];

const generatedArtifacts = [
  "docs/generated/build-020-manifest.json",
  "docs/generated/build-020-acceptance.md",
  "docs/generated/build-020-handoff.md",
  "docs/generated/build-020-receipt.json",
  "docs/generated/project-memory.json",
  "docs/generated/known-gaps.json",
  "docs/generated/safety-capability-matrix.json",
  "docs/generated/eval-registry.json",
  "docs/generated/tool-inventory.json",
  "docs/generated/build-state.json"
];

const docsUpdated = [
  "docs/MCP_RESOURCE_WIRING_LOCALHOST_PREVIEW.md",
  "docs/DECISIONS/0022-mcp-resource-wiring-localhost-preview.md",
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
  "node scripts/stealtheye-build.mjs scripts/phases/build-020-mcp-resource-wiring-localhost-preview.mjs --check"
];

const foundationPackages = [
  "@stealtheye/agent-registry",
  "@stealtheye/guard",
  "@stealtheye/mission-os",
  "@stealtheye/app-host",
  "@stealtheye/worker-fleet",
  "@stealtheye/codeops",
  "@stealtheye/browserops",
  "@stealtheye/receipts-replay",
  "@stealtheye/mcp-runtime",
  "@stealtheye/repo-status",
  "@stealtheye/memory-graph",
  "@stealtheye/mcp-server",
  "@stealtheye/dev-endpoint",
  "@stealtheye/chatgpt-dev-connection",
  "@stealtheye/control-plane-app",
  "@stealtheye/control-plane-ui",
  "@stealtheye/local-dev-ui-shell"
];

const packageSummary = "MCP Server Resource Wiring package extension that lists and reads Control Plane UI resources, deterministic Local Dev UI Shell render resources, and controlled localhost-preview metadata through @stealtheye/mcp-server without binding a server by default or adding remote assets.";
const handAuthoredDocPolicy = "Build 20 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 20 docs.";
const nextTarget = "Build 21 - Controlled Localhost Preview Command / Developer-Mode Resource Connection";

const safetyBoundaries = [
  "No production frontend deployment is created.",
  "No public app submission is performed.",
  "No production OAuth credential, real app identifier, production domain, public deployed app URL, real hosted endpoint, tunnel credential, cloud credential, credential material, or customer/private data workflow is added.",
  "No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, remote script/style/asset, external network access, default server binding, tunnel live enablement, or money movement path is exposed.",
  "The MCP resource wiring remains static/local/fixture/preview-only."
];

const knownGaps = [
  "No production frontend, hosted app, real app auth, public app submission, production OAuth, real app IDs, production domains, real public endpoints, or tunnel credentials exist.",
  "No customer data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, credential entry path, external side effect path, remote asset path, external network path, default server binding path, tunnel live enablement path, or money movement path exists.",
  "No explicit controlled localhost preview command is added yet.",
  "No developer-mode resource connection command is added yet.",
  "No durable UI receipt ledger is added."
];

const phase = {
  build: 20,
  title: "MCP Server Resource Wiring / Controlled Localhost Preview",
  branch: "agent/mcp-resource-wiring-localhost-preview",
  packageName: "@stealtheye/mcp-server",
  strictGeneratedSync: true,
  generatedAt: "2026-01-01T00:00:00.000Z",
  importantFiles,
  docsUpdated,
  testsAndEvals,
  adr: "docs/DECISIONS/0022-mcp-resource-wiring-localhost-preview.md",
  ciRequiredFiles,
  safetyBoundaries,
  generatedArtifacts,
  knownGaps,
  nextTarget,
  foundationPackages,
  packageSummary,
  projectMemorySummary: packageSummary,
  handoffSummary: "Build 20 wires local UI shell resources into the MCP server resource layer while preserving static/local/fixture/preview-only boundaries and no default server binding.",
  handAuthoredDocPolicy,
  acceptanceItems: [
    "@stealtheye/mcp-server lists existing resources, Control Plane UI resources, Local Dev UI Shell render resources, and localhost-preview metadata resources.",
    "@stealtheye/mcp-server reads UI resources, rendered shell resources, and localhost-preview metadata resources through the same resource API.",
    "Rendered shell resources contain deterministic static HTML, the boundary banner, and receipt previews.",
    "Controlled localhost preview metadata validates for disabled, static_fixture_preview, and localhost_config_required modes.",
    "localhost_bound_future and hosted_future remain blocked/future.",
    "Safety policy denies production deployment, public app submission, real OAuth clients, real app IDs, production domains, real public endpoints, unrestricted live writes, protected branch mutation, destructive actions, production mutation, customer/private data, money movement, material external sends, credential entry/storage, external side effects, unsafe URI schemes, remote scripts/styles/assets, server binding by default, external network access, tunnel provider live enablement, hosted/public mode, missing flags, missing receipt references, and unknown modes.",
    "Official docs checked are documented in docs/MCP_RESOURCE_WIRING_LOCALHOST_PREVIEW.md and ADR 0022.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  toolInventory: [
    { name: "mcp_server.list_ui_resources", package: "@stealtheye/mcp-server", mode: "static_fixture_resource_listing", live_external_effects: false },
    { name: "mcp_server.read_ui_resource", package: "@stealtheye/mcp-server", mode: "static_fixture_resource_read", live_external_effects: false },
    { name: "mcp_server.read_rendered_shell_resource", package: "@stealtheye/mcp-server", mode: "deterministic_static_html_render_read", live_external_effects: false },
    { name: "mcp_server.localhost_preview_metadata", package: "@stealtheye/mcp-server", mode: "readonly_config_required_metadata", live_external_effects: false },
    { name: "mcp_server.resource_read_receipt_preview", package: "@stealtheye/mcp-server", mode: "fixture_receipt_preview", live_external_effects: false }
  ],
  capabilityMatrix: [
    { capability: "mcp_ui_resource_listing", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "mcp_ui_resource_reading", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "deterministic_render_resource_reading", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "localhost_preview_disabled_metadata", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "localhost_config_required_metadata", status: "implemented", guard_required: true, live_enabled: false },
    { capability: "localhost_bound_preview", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "hosted_public_preview", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "production_frontend_deployment", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "remote_scripts_styles_assets", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "external_network_access", status: "blocked", guard_required: true, live_enabled: false }
  ],
  defaultEvalLocation: "packages/mcp-server/test",
  scannerExtraPaths: [
    "packages/mcp-server/src/ui-resource-adapter.ts",
    "packages/mcp-server/src/localhost-preview.ts",
    "packages/mcp-server/src/resource-registry.ts",
    "packages/mcp-server/test/mcp-server-resource-wiring.test.ts"
  ],
  requiredFiles: [
    ...importantFiles,
    ...docsUpdated,
    ".github/workflows/build-020-mcp-resource-wiring-localhost-preview.yml"
  ]
};

export default phase;
