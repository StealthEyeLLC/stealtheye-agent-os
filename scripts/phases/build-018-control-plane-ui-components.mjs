const testsAndEvals = [
  "UI component schema validates",
  "UI resource schema validates",
  "UI template schema validates",
  "UI metadata schema validates",
  "hydration payload schema validates",
  "fixture bundle validates",
  "all required component types exist",
  "resource URIs use allowed ui://stealtheye/control-plane/... scheme",
  "no production URL resources",
  "no public domain resources",
  "safety policy allows fixture/read-only components",
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
  "missing fixture/preview/read-only flags denied",
  "missing receipt refs denied",
  "unknown component type denied",
  "resource reader can list/read UI resources",
  "hydration payload includes control-plane state snapshot",
  "generated state strict sync passes",
  "protected docs unchanged",
  "no secrets/tokens/customer data/private endpoints in fixtures/docs"
];

const importantFiles = [
  "packages/control-plane-ui/package.json",
  "packages/control-plane-ui/tsconfig.json",
  "packages/control-plane-ui/src/index.ts",
  "packages/control-plane-ui/src/schemas.ts",
  "packages/control-plane-ui/src/components.ts",
  "packages/control-plane-ui/src/resources.ts",
  "packages/control-plane-ui/src/templates.ts",
  "packages/control-plane-ui/src/metadata.ts",
  "packages/control-plane-ui/src/hydration.ts",
  "packages/control-plane-ui/src/safety.ts",
  "packages/control-plane-ui/src/fixtures.ts",
  "packages/control-plane-ui/test/control-plane-ui.test.ts",
  "scripts/phases/build-018-control-plane-ui-components.mjs"
];

const generatedArtifacts = [
  "docs/generated/build-018-manifest.json",
  "docs/generated/build-018-acceptance.md",
  "docs/generated/build-018-handoff.md",
  "docs/generated/build-018-receipt.json",
  "docs/generated/project-memory.json",
  "docs/generated/known-gaps.json",
  "docs/generated/safety-capability-matrix.json",
  "docs/generated/eval-registry.json",
  "docs/generated/tool-inventory.json",
  "docs/generated/build-state.json"
];

const docsUpdated = [
  "docs/CONTROL_PLANE_UI_COMPONENTS.md",
  "docs/DECISIONS/0020-control-plane-ui-components.md",
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
  "node scripts/stealtheye-build.mjs scripts/phases/build-018-control-plane-ui-components.mjs --check"
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
  "@stealtheye/control-plane-ui"
];

const packageSummary = "Control Plane UI Component Resources package that models Apps SDK-style static component/resource descriptors, templates, metadata, hydration contracts, fixtures, and UI safety decisions around @stealtheye/control-plane-app without deploying a frontend or adding live app material.";
const handAuthoredDocPolicy = "Build 18 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 18 docs.";
const nextTarget = "Build 19 — Local Dev UI Shell / Resource Rendering";

const safetyBoundaries = [
  "No production frontend deployment is created.",
  "No public app submission is performed.",
  "No production OAuth credential, real app identifier, production domain, public deployed app URL, real hosted endpoint, tunnel token, cloud credential, private key, or customer/private data workflow is added.",
  "No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, or money movement path is exposed.",
  "The control plane UI resources remain model/static/fixture/preview-only."
];

const knownGaps = [
  "No production frontend, hosted app, real app auth, public app submission, production OAuth, real app IDs, production domains, or real public endpoints exist.",
  "No real user data, customer/private data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, credential entry path, external side effect path, or money movement path exists.",
  "No local dev UI shell or resource renderer is added in Build 18.",
  "No durable UI receipt ledger is added."
];

const phase = {
  build: 18,
  title: "Control Plane UI Component Resources",
  branch: "agent/control-plane-ui-components",
  packageName: "@stealtheye/control-plane-ui",
  strictGeneratedSync: true,
  generatedAt: "2026-01-01T00:00:00.000Z",
  importantFiles,
  docsUpdated,
  testsAndEvals,
  adr: "docs/DECISIONS/0020-control-plane-ui-components.md",
  ciRequiredFiles,
  safetyBoundaries,
  generatedArtifacts,
  knownGaps,
  nextTarget,
  foundationPackages,
  packageSummary,
  projectMemorySummary: packageSummary,
  handoffSummary: "Build 18 creates the first Control Plane UI Component Resources while preserving the no-secret, no-production, no-public-submission, no-real-auth, no-customer-data, no-unrestricted-live-write boundary.",
  handAuthoredDocPolicy,
  acceptanceItems: [
    "@stealtheye/control-plane-ui package exists with schemas, helpers, fixtures, and Vitest coverage.",
    "Component, resource, template, metadata, hydration payload, safety policy, safety decision, and fixture bundle schemas validate.",
    "UI component/resource descriptors cover overview_dashboard, mission_list, mission_detail, agent_registry, tool_inventory, guard_decisions, receipt_timeline, replay_report, memory_context, repo_status, codeops_panel, browserops_panel, worker_fleet, mcp_server_status, dev_endpoint_status, chatgpt_developer_mode_status, and safe_settings.",
    "Resource URIs use the local app-safe ui://stealtheye/control-plane/... scheme only.",
    "Hydration payloads include control-plane state snapshot, navigation, views, panels, actions, safety inventory, receipt previews, and known gaps.",
    "Safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe resource URI schemes, missing read-only/preview/fixture flags, missing receipt references, and unknown component/resource types.",
    "Official docs checked are documented in docs/CONTROL_PLANE_UI_COMPONENTS.md and ADR 0020.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  toolInventory: [
    { name: "control_plane_ui.list_resources", package: "@stealtheye/control-plane-ui", mode: "static_fixture_resource_listing", live_external_effects: false },
    { name: "control_plane_ui.read_resource", package: "@stealtheye/control-plane-ui", mode: "static_fixture_resource_read", live_external_effects: false },
    { name: "control_plane_ui.render_template_preview", package: "@stealtheye/control-plane-ui", mode: "fixture_template_preview", live_external_effects: false },
    { name: "control_plane_ui.hydration_payload", package: "@stealtheye/control-plane-ui", mode: "readonly_fixture_hydration", live_external_effects: false },
    { name: "control_plane_ui.safe_settings_summary", package: "@stealtheye/control-plane-ui", mode: "readonly_summary", live_external_effects: false }
  ],
  capabilityMatrix: [
    { capability: "apps_sdk_style_component_resource_descriptors", status: "modeled", guard_required: true, live_enabled: false },
    { capability: "fixture_only_hydration_payload", status: "modeled", guard_required: true, live_enabled: false },
    { capability: "read_only_preview_panels", status: "modeled", guard_required: true, live_enabled: false },
    { capability: "receipt_preview_display", status: "modeled", guard_required: true, live_enabled: false },
    { capability: "production_frontend_deployment", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "public_app_submission", status: "blocked", guard_required: true, live_enabled: false },
    { capability: "unrestricted_live_write_tools", status: "blocked", guard_required: true, live_enabled: false }
  ],
  defaultEvalLocation: "packages/control-plane-ui/test",
  scannerExtraPaths: [
    "packages/control-plane-ui/src/safety.ts",
    "packages/control-plane-ui/src/components.ts",
    "packages/control-plane-ui/src/resources.ts",
    "packages/control-plane-ui/src/hydration.ts",
    "packages/control-plane-ui/test/control-plane-ui.test.ts"
  ],
  requiredFiles: [
    ...importantFiles,
    ...docsUpdated,
    ".github/workflows/build-018-control-plane-ui-components.yml"
  ]
};

export default phase;
