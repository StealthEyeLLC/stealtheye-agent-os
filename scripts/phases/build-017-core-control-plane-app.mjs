const phase = {
  "build": 17,
  "title": "Core Control Plane App",
  "branch": "agent/core-control-plane-app",
  "packageName": "@stealtheye/control-plane-app",
  "strictGeneratedSync": true,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "importantFiles": [
    "packages/control-plane-app/package.json",
    "packages/control-plane-app/tsconfig.json",
    "packages/control-plane-app/src/index.ts",
    "packages/control-plane-app/src/schemas.ts",
    "packages/control-plane-app/src/app-model.ts",
    "packages/control-plane-app/src/navigation.ts",
    "packages/control-plane-app/src/views.ts",
    "packages/control-plane-app/src/actions.ts",
    "packages/control-plane-app/src/state.ts",
    "packages/control-plane-app/src/safety.ts",
    "packages/control-plane-app/src/receipts.ts",
    "packages/control-plane-app/src/fixtures.ts",
    "packages/control-plane-app/test/control-plane-app.test.ts",
    "scripts/phases/build-017-core-control-plane-app.mjs"
  ],
  "docsUpdated": [
    "docs/CONTROL_PLANE_APP.md",
    "docs/DECISIONS/0019-core-control-plane-app.md",
    "docs/generated/build-017-manifest.json",
    "docs/generated/build-017-acceptance.md",
    "docs/generated/build-017-handoff.md",
    "docs/generated/build-017-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "testsAndEvals": [
    "control plane app schema validates",
    "navigation schema validates",
    "view schema validates",
    "panel schema validates",
    "action schema validates",
    "state snapshot schema validates",
    "safety policy allows navigation actions",
    "safety policy allows fixture preview actions",
    "production deployment denied",
    "public app submission denied",
    "real OAuth client denied",
    "real app ID denied",
    "production domain denied",
    "real public endpoint denied",
    "unrestricted live write action denied",
    "protected branch mutation action denied",
    "destructive action denied",
    "production mutation action denied",
    "customer/private data action denied",
    "money movement action denied",
    "material external send denied",
    "credential entry/storage denied",
    "unknown action category denied",
    "receipt preview generated",
    "overview view includes major subsystems",
    "missions view includes Mission OS status",
    "guard view includes Guard status",
    "memory view includes Memory Graph status",
    "repo status view includes Repo Status capability",
    "mcp server view includes MCP Server status",
    "dev endpoint view includes Dev Endpoint readiness",
    "ChatGPT developer-mode view includes connection readiness",
    "actions are preview/fixture/read-only only",
    "generated state strict sync passes",
    "protected docs unchanged",
    "no secrets/tokens/customer data/private endpoints in fixtures/docs"
  ],
  "adr": "docs/DECISIONS/0019-core-control-plane-app.md",
  "ciRequiredFiles": [
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
    "node scripts/stealtheye-build.mjs scripts/phases/build-017-core-control-plane-app.mjs --check"
  ],
  "safetyBoundaries": [
    "No production frontend deployment is created.",
    "No public app submission is performed.",
    "No production OAuth credential, tunnel auth value, cloud credential, private key, real app identifier, production domain, public deployed app URL, or real hosted endpoint is added.",
    "No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, or money movement action is exposed.",
    "The control plane app remains model/fixture/preview-only."
  ],
  "generatedArtifacts": [
    "docs/generated/build-017-manifest.json",
    "docs/generated/build-017-acceptance.md",
    "docs/generated/build-017-handoff.md",
    "docs/generated/build-017-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "knownGaps": [
    "No production frontend, hosted app, real app auth, public app submission, or production OAuth exists.",
    "No real user data, customer/private data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, or money movement path exists.",
    "First UI/component resources remain future Build 18 work.",
    "No durable control-plane receipt ledger is added."
  ],
  "nextTarget": "Build 18 — Control Plane UI Component Resources",
  "foundationPackages": [
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
    "@stealtheye/control-plane-app"
  ],
  "packageSummary": "Core Control Plane App model package that organizes missions, agents, tools, receipts, replay, memory, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server, Dev Endpoint, and ChatGPT developer-mode readiness into a coherent fixture/preview control surface.",
  "acceptanceItems": [
    "@stealtheye/control-plane-app package exists with schemas, helpers, fixtures, and Vitest coverage.",
    "Navigation, views, panels, actions, state snapshot, safety policy, safety decisions, and receipt previews validate.",
    "Views cover overview, missions, agents, tools, guard, receipts, replay, memory, repo_status, codeops, browserops, worker_fleet, mcp_server, dev_endpoint, chatgpt_developer_mode, and settings_safe.",
    "Actions are fixture/model/preview-only; no real live execution, destructive action, production mutation, protected branch mutation, credential entry/storage, customer/private data workflow, material external send, or money movement path is added.",
    "Official docs checked are documented in docs/CONTROL_PLANE_APP.md and ADR 0019.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  "toolInventory": [
    {
      "name": "control_plane.view_navigation",
      "package": "@stealtheye/control-plane-app",
      "mode": "navigation_readonly",
      "live_external_effects": false
    },
    {
      "name": "control_plane.fixture_preview",
      "package": "@stealtheye/control-plane-app",
      "mode": "fixture_preview",
      "live_external_effects": false
    },
    {
      "name": "control_plane.state_snapshot",
      "package": "@stealtheye/control-plane-app",
      "mode": "readonly_summary",
      "live_external_effects": false
    },
    {
      "name": "control_plane.receipt_preview",
      "package": "@stealtheye/control-plane-app",
      "mode": "fixture_receipt_preview",
      "live_external_effects": false
    },
    {
      "name": "control_plane.safe_settings_summary",
      "package": "@stealtheye/control-plane-app",
      "mode": "readonly_summary",
      "live_external_effects": false
    }
  ],
  "capabilityMatrix": [
    {
      "capability": "control_plane_navigation",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "fixture_preview_actions",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "state_snapshot_display",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "receipt_preview_generation",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "production_frontend_deployment",
      "status": "blocked",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "public_app_submission",
      "status": "blocked",
      "guard_required": true,
      "live_enabled": false
    }
  ],
  "defaultEvalLocation": "packages/control-plane-app/test",
  "scannerExtraPaths": [
    "packages/control-plane-app/src/safety.ts",
    "packages/control-plane-app/src/app-model.ts",
    "packages/control-plane-app/src/state.ts",
    "packages/control-plane-app/test/control-plane-app.test.ts"
  ],
  "requiredFiles": [
    "packages/control-plane-app/package.json",
    "packages/control-plane-app/tsconfig.json",
    "packages/control-plane-app/src/index.ts",
    "packages/control-plane-app/src/schemas.ts",
    "packages/control-plane-app/src/app-model.ts",
    "packages/control-plane-app/src/navigation.ts",
    "packages/control-plane-app/src/views.ts",
    "packages/control-plane-app/src/actions.ts",
    "packages/control-plane-app/src/state.ts",
    "packages/control-plane-app/src/safety.ts",
    "packages/control-plane-app/src/receipts.ts",
    "packages/control-plane-app/src/fixtures.ts",
    "packages/control-plane-app/test/control-plane-app.test.ts",
    "scripts/phases/build-017-core-control-plane-app.mjs",
    "docs/CONTROL_PLANE_APP.md",
    "docs/DECISIONS/0019-core-control-plane-app.md",
    "docs/generated/build-017-manifest.json",
    "docs/generated/build-017-acceptance.md",
    "docs/generated/build-017-handoff.md",
    "docs/generated/build-017-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json",
    ".github/workflows/build-017-core-control-plane-app.yml"
  ],
  "handAuthoredDocPolicy": "Build 17 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 17 docs.",
  "handoffSummary": "Build 17 creates the first Core Control Plane App model while preserving the no-secret, no-production, no-public-submission, no-real-auth, no-customer-data, no-unrestricted-live-write boundary.",
  "projectMemorySummary": "Build 17 adds @stealtheye/control-plane-app as a fixture/preview app model that organizes mission, agent, tool, receipt, replay, memory, repo status, operations, endpoint, and ChatGPT developer-mode readiness into one public-safe control surface."
};

export default phase;
