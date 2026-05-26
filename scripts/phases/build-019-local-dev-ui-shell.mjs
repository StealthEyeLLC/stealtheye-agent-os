const phase = {
  "build": 19,
  "title": "Local Dev UI Shell / Resource Rendering",
  "branch": "agent/local-dev-ui-shell",
  "packageName": "@stealtheye/local-dev-ui-shell",
  "strictGeneratedSync": true,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "importantFiles": [
    "packages/local-dev-ui-shell/package.json",
    "packages/local-dev-ui-shell/tsconfig.json",
    "packages/local-dev-ui-shell/src/index.ts",
    "packages/local-dev-ui-shell/src/schemas.ts",
    "packages/local-dev-ui-shell/src/shell.ts",
    "packages/local-dev-ui-shell/src/renderer.ts",
    "packages/local-dev-ui-shell/src/routes.ts",
    "packages/local-dev-ui-shell/src/static-assets.ts",
    "packages/local-dev-ui-shell/src/resource-loader.ts",
    "packages/local-dev-ui-shell/src/hydration.ts",
    "packages/local-dev-ui-shell/src/safety.ts",
    "packages/local-dev-ui-shell/src/receipts.ts",
    "packages/local-dev-ui-shell/src/fixtures.ts",
    "packages/local-dev-ui-shell/test/local-dev-ui-shell.test.ts",
    "scripts/phases/build-019-local-dev-ui-shell.mjs"
  ],
  "docsUpdated": [
    "docs/LOCAL_DEV_UI_SHELL.md",
    "docs/DECISIONS/0021-local-dev-ui-shell.md",
    "docs/generated/build-019-manifest.json",
    "docs/generated/build-019-acceptance.md",
    "docs/generated/build-019-handoff.md",
    "docs/generated/build-019-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "testsAndEvals": [
    "shell schema validates",
    "route schema validates",
    "render request schema validates",
    "render result schema validates",
    "static asset schema validates",
    "resource load schema validates",
    "hydration result schema validates",
    "fixture bundle validates",
    "all required routes exist",
    "routes map to allowed ui://stealtheye/control-plane/... resources",
    "no production URL routes/resources/assets",
    "no public domain routes/resources/assets",
    "no external CDN/script/style asset",
    "safety policy allows static fixture rendering",
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
    "unsafe route path denied",
    "unsafe resource URI scheme denied",
    "remote asset denied",
    "server binding by default denied",
    "missing fixture/preview/read-only flags denied",
    "missing receipt refs denied",
    "unknown route/component/resource type denied",
    "resource loader reads Control Plane UI resources",
    "renderer produces deterministic static HTML",
    "render output includes boundary banner",
    "render output includes receipt preview",
    "hydration payload includes control-plane state snapshot",
    "generated state strict sync passes",
    "protected docs unchanged",
    "no secrets/tokens/customer data/private endpoints in fixtures/docs"
  ],
  "adr": "docs/DECISIONS/0021-local-dev-ui-shell.md",
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
    "node scripts/stealtheye-build.mjs scripts/phases/build-017-core-control-plane-app.mjs --check",
    "node scripts/stealtheye-build.mjs scripts/phases/build-018-control-plane-ui-components.mjs --check",
    "node scripts/stealtheye-build.mjs scripts/phases/build-019-local-dev-ui-shell.mjs --check"
  ],
  "safetyBoundaries": [
    "No production frontend deployment is created.",
    "No public app submission is performed.",
    "No production OAuth credential, real app identifier, production domain, public deployed app URL, real hosted endpoint, tunnel token, cloud credential, private key, or customer/private data workflow is added.",
    "No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, credential entry/storage, external side effect, remote script/style/asset, default server binding, or money movement path is exposed.",
    "The local dev UI shell remains static/local/fixture/preview-only."
  ],
  "generatedArtifacts": [
    "docs/generated/build-019-manifest.json",
    "docs/generated/build-019-acceptance.md",
    "docs/generated/build-019-handoff.md",
    "docs/generated/build-019-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "knownGaps": [
    "No production frontend, hosted app, real app auth, public app submission, production OAuth, real app IDs, production domains, or real public endpoints exist.",
    "No customer data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, credential entry path, external side effect path, remote asset path, default server binding path, or money movement path exists.",
    "No MCP server or dev endpoint resource-serving integration is added in Build 19.",
    "No controlled localhost preview command is added yet.",
    "No durable UI receipt ledger is added."
  ],
  "nextTarget": "Build 20 \u2014 MCP Server Resource Wiring / Controlled Localhost Preview",
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
    "@stealtheye/control-plane-app",
    "@stealtheye/control-plane-ui",
    "@stealtheye/local-dev-ui-shell"
  ],
  "packageSummary": "Local Dev UI Shell package that renders @stealtheye/control-plane-ui static fixture resources into deterministic HTML/resource previews, readiness summaries, hydration summaries, and receipt previews without binding a server by default or adding remote assets.",
  "projectMemorySummary": "Local Dev UI Shell package that renders @stealtheye/control-plane-ui static fixture resources into deterministic HTML/resource previews, readiness summaries, hydration summaries, and receipt previews without binding a server by default or adding remote assets.",
  "handoffSummary": "Build 19 creates a local/dev-only UI shell and deterministic resource renderer while preserving the no-secret, no-production, no-public-submission, no-real-auth, no-customer-data, no-unrestricted-live-write, no-remote-asset, no-default-server-binding boundary.",
  "handAuthoredDocPolicy": "Build 19 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 19 docs.",
  "acceptanceItems": [
    "@stealtheye/local-dev-ui-shell package exists with schemas, helpers, fixtures, deterministic renderer, and Vitest coverage.",
    "LocalDevUiShell, route, render request/result, static asset, resource load result, hydration result, safety policy/decision, receipt preview, and fixture bundle schemas validate.",
    "Routes cover /, /overview, /missions, /agents, /tools, /guard, /receipts, /replay, /memory, /repo-status, /codeops, /browserops, /worker-fleet, /mcp-server, /dev-endpoint, /chatgpt-developer-mode, and /settings.",
    "Routes map only to local app-safe ui://stealtheye/control-plane/... resources from @stealtheye/control-plane-ui.",
    "Renderer loads resources, templates, hydration payloads, safety decisions, and receipt previews to produce deterministic static HTML.",
    "Static assets use only ui-asset://stealtheye/control-plane/... or ui://stealtheye/control-plane/... fixture-safe schemes.",
    "Safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe route paths, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, missing read-only/preview/fixture flags, missing receipt references, and unknown route/component/resource types.",
    "Official docs checked are documented in docs/LOCAL_DEV_UI_SHELL.md and ADR 0021.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  "toolInventory": [
    {
      "name": "local_dev_ui_shell.list_routes",
      "package": "@stealtheye/local-dev-ui-shell",
      "mode": "static_fixture_route_listing",
      "live_external_effects": false
    },
    {
      "name": "local_dev_ui_shell.load_resource",
      "package": "@stealtheye/local-dev-ui-shell",
      "mode": "static_fixture_resource_load",
      "live_external_effects": false
    },
    {
      "name": "local_dev_ui_shell.render_resource",
      "package": "@stealtheye/local-dev-ui-shell",
      "mode": "deterministic_static_html_render",
      "live_external_effects": false
    },
    {
      "name": "local_dev_ui_shell.hydrate_resource",
      "package": "@stealtheye/local-dev-ui-shell",
      "mode": "readonly_fixture_hydration",
      "live_external_effects": false
    },
    {
      "name": "local_dev_ui_shell.receipt_preview",
      "package": "@stealtheye/local-dev-ui-shell",
      "mode": "fixture_receipt_preview",
      "live_external_effects": false
    }
  ],
  "capabilityMatrix": [
    {
      "capability": "static_fixture_ui_shell",
      "status": "implemented",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "deterministic_resource_rendering",
      "status": "implemented",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "fixture_only_hydration_summary",
      "status": "implemented",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "local_app_safe_resource_loading",
      "status": "implemented",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "receipt_preview_generation",
      "status": "implemented",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "localhost_dev_preview",
      "status": "modeled_future",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "hosted_future",
      "status": "blocked",
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
    },
    {
      "capability": "remote_scripts_styles_assets",
      "status": "blocked",
      "guard_required": true,
      "live_enabled": false
    }
  ],
  "defaultEvalLocation": "packages/local-dev-ui-shell/test",
  "scannerExtraPaths": [
    "packages/local-dev-ui-shell/src/safety.ts",
    "packages/local-dev-ui-shell/src/routes.ts",
    "packages/local-dev-ui-shell/src/renderer.ts",
    "packages/local-dev-ui-shell/src/static-assets.ts",
    "packages/local-dev-ui-shell/test/local-dev-ui-shell.test.ts"
  ],
  "requiredFiles": [
    "packages/local-dev-ui-shell/package.json",
    "packages/local-dev-ui-shell/tsconfig.json",
    "packages/local-dev-ui-shell/src/index.ts",
    "packages/local-dev-ui-shell/src/schemas.ts",
    "packages/local-dev-ui-shell/src/shell.ts",
    "packages/local-dev-ui-shell/src/renderer.ts",
    "packages/local-dev-ui-shell/src/routes.ts",
    "packages/local-dev-ui-shell/src/static-assets.ts",
    "packages/local-dev-ui-shell/src/resource-loader.ts",
    "packages/local-dev-ui-shell/src/hydration.ts",
    "packages/local-dev-ui-shell/src/safety.ts",
    "packages/local-dev-ui-shell/src/receipts.ts",
    "packages/local-dev-ui-shell/src/fixtures.ts",
    "packages/local-dev-ui-shell/test/local-dev-ui-shell.test.ts",
    "scripts/phases/build-019-local-dev-ui-shell.mjs",
    "docs/LOCAL_DEV_UI_SHELL.md",
    "docs/DECISIONS/0021-local-dev-ui-shell.md",
    "docs/generated/build-019-manifest.json",
    "docs/generated/build-019-acceptance.md",
    "docs/generated/build-019-handoff.md",
    "docs/generated/build-019-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json",
    ".github/workflows/build-019-local-dev-ui-shell.yml"
  ]
};

export default phase;
