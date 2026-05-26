const phase = {
  "build": 16,
  "title": "Connect from ChatGPT Developer Mode",
  "branch": "agent/chatgpt-developer-mode-connection",
  "packageName": "@stealtheye/chatgpt-dev-connection",
  "strictGeneratedSync": true,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "importantFiles": [
    "packages/chatgpt-dev-connection/package.json",
    "packages/chatgpt-dev-connection/tsconfig.json",
    "packages/chatgpt-dev-connection/src/index.ts",
    "packages/chatgpt-dev-connection/src/schemas.ts",
    "packages/chatgpt-dev-connection/src/connection-plan.ts",
    "packages/chatgpt-dev-connection/src/checklist.ts",
    "packages/chatgpt-dev-connection/src/manifest.ts",
    "packages/chatgpt-dev-connection/src/safety.ts",
    "packages/chatgpt-dev-connection/src/receipt.ts",
    "packages/chatgpt-dev-connection/src/fixtures.ts",
    "packages/chatgpt-dev-connection/test/chatgpt-dev-connection.test.ts",
    "scripts/phases/build-016-chatgpt-developer-mode-connection.mjs"
  ],
  "docsUpdated": [
    "docs/CHATGPT_DEVELOPER_MODE.md",
    "docs/DECISIONS/0018-chatgpt-developer-mode-connection.md",
    "docs/generated/build-016-manifest.json",
    "docs/generated/build-016-acceptance.md",
    "docs/generated/build-016-handoff.md",
    "docs/generated/build-016-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "testsAndEvals": [
    "connection plan schema validates",
    "connection checklist schema validates",
    "connection manifest schema validates",
    "safety policy allows fixture-only local/dev plan",
    "safety policy allows tunnel-config-required placeholder plan",
    "production app submission denied",
    "real app ID denied",
    "real OAuth client denied",
    "production domain denied",
    "real public endpoint denied",
    "tunnel auth value denied",
    "cloud credential denied",
    "unrestricted live write inventory denied",
    "destructive tool inventory denied",
    "production mutation inventory denied",
    "protected branch mutation inventory denied",
    "customer/private data inventory denied",
    "money movement inventory denied",
    "missing endpoint readiness denied",
    "missing MCP server safety inventory denied",
    "manifest contains no secrets",
    "manifest contains no production endpoint",
    "manifest contains no real public domain",
    "manifest contains no real app ID",
    "readiness report ready_for_local_developer_mode_plan",
    "readiness report ready_for_manual_chatgpt_dev_connection_later",
    "readiness report blocked_for_public_submission",
    "readiness report blocked_for_production",
    "receipt preview generated",
    "dev endpoint and MCP server integration can produce connection manifest metadata",
    "generated state strict sync passes",
    "protected docs unchanged",
    "no secrets/tokens/customer data/private endpoints in fixtures/docs"
  ],
  "adr": "docs/DECISIONS/0018-chatgpt-developer-mode-connection.md",
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
    "node scripts/stealtheye-build.mjs scripts/phases/build-016-chatgpt-developer-mode-connection.mjs --check"
  ],
  "safetyBoundaries": [
    "No real ChatGPT connection is performed.",
    "No public ChatGPT app is submitted.",
    "No production OAuth credential, tunnel auth value, cloud credential, private key, real app identifier, production domain, or public deployed app URL is added.",
    "No unrestricted live write, destructive, protected branch mutation, production mutation, customer/private data, material external send, or money movement tool is exposed.",
    "Developer-mode connection remains local/dev, fixture-only, or future manual configuration."
  ],
  "generatedArtifacts": [
    "docs/generated/build-016-manifest.json",
    "docs/generated/build-016-acceptance.md",
    "docs/generated/build-016-handoff.md",
    "docs/generated/build-016-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json"
  ],
  "knownGaps": [
    "No real ChatGPT developer-mode connection is performed in Build 16.",
    "No reachable public dev endpoint, tunnel credential, production domain, real app ID, OAuth production client, or public app submission is added.",
    "Future manual connection remains blocked until a safe reachable dev endpoint exists and verifier approval is granted.",
    "No durable developer-mode connection receipt ledger is added."
  ],
  "nextTarget": "Build 17 — Core Control Plane App",
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
    "@stealtheye/chatgpt-dev-connection"
  ],
  "packageSummary": "Developer-mode connection planning package around @stealtheye/mcp-server and @stealtheye/dev-endpoint with schemas, checklist, manifest, safety decisions, readiness reports, fixture data, and receipt previews.",
  "acceptanceItems": [
    "@stealtheye/chatgpt-dev-connection package exists with schemas, helpers, fixtures, and Vitest coverage.",
    "Connection stages validate for prerequisites, endpoint_ready, app_manifest_ready, connect_from_chatgpt, test_integration, and submit_app_future.",
    "Safety policy allows fixture-only local/dev plans and placeholder-only tunnel-config-required plans.",
    "Safety policy denies production submission, real app IDs, production OAuth clients/secrets, production domains, real public endpoints, tunnel auth tokens, cloud credentials, unrestricted live write tools, destructive tools, production mutation tools, protected branch mutation tools, customer/private data, money movement, missing endpoint readiness, missing MCP safety inventory, missing receipt preview, and missing boundary statements.",
    "Manifest/readiness/receipt helpers summarize @stealtheye/mcp-server and @stealtheye/dev-endpoint without performing a real ChatGPT connection.",
    "Official docs checked are documented in docs/CHATGPT_DEVELOPER_MODE.md and ADR 0018.",
    "Strict generated sync is true.",
    "Protected docs are untouched."
  ],
  "toolInventory": [
    {
      "name": "chatgpt.developer_mode.connection_plan",
      "package": "@stealtheye/chatgpt-dev-connection",
      "mode": "fixture_planning",
      "live_external_effects": false
    },
    {
      "name": "chatgpt.developer_mode.connection_checklist",
      "package": "@stealtheye/chatgpt-dev-connection",
      "mode": "fixture_planning",
      "live_external_effects": false
    },
    {
      "name": "chatgpt.developer_mode.connection_manifest",
      "package": "@stealtheye/chatgpt-dev-connection",
      "mode": "fixture_planning",
      "live_external_effects": false
    },
    {
      "name": "chatgpt.developer_mode.readiness_report",
      "package": "@stealtheye/chatgpt-dev-connection",
      "mode": "fixture_planning",
      "live_external_effects": false
    },
    {
      "name": "chatgpt.developer_mode.receipt_preview",
      "package": "@stealtheye/chatgpt-dev-connection",
      "mode": "fixture_planning",
      "live_external_effects": false
    }
  ],
  "capabilityMatrix": [
    {
      "capability": "fixture_only_connection_plan",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "local_dev_manifest",
      "status": "modeled",
      "guard_required": true,
      "live_enabled": false
    },
    {
      "capability": "manual_chatgpt_dev_connection_later",
      "status": "blocked_future",
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
      "capability": "production_deployment",
      "status": "blocked",
      "guard_required": true,
      "live_enabled": false
    }
  ],
  "defaultEvalLocation": "packages/chatgpt-dev-connection/test",
  "scannerExtraPaths": [
    "packages/chatgpt-dev-connection/src/safety.ts",
    "packages/chatgpt-dev-connection/src/manifest.ts",
    "packages/chatgpt-dev-connection/test/chatgpt-dev-connection.test.ts"
  ],
  "requiredFiles": [
    "packages/chatgpt-dev-connection/package.json",
    "packages/chatgpt-dev-connection/tsconfig.json",
    "packages/chatgpt-dev-connection/src/index.ts",
    "packages/chatgpt-dev-connection/src/schemas.ts",
    "packages/chatgpt-dev-connection/src/connection-plan.ts",
    "packages/chatgpt-dev-connection/src/checklist.ts",
    "packages/chatgpt-dev-connection/src/manifest.ts",
    "packages/chatgpt-dev-connection/src/safety.ts",
    "packages/chatgpt-dev-connection/src/receipt.ts",
    "packages/chatgpt-dev-connection/src/fixtures.ts",
    "packages/chatgpt-dev-connection/test/chatgpt-dev-connection.test.ts",
    "scripts/phases/build-016-chatgpt-developer-mode-connection.mjs",
    "docs/CHATGPT_DEVELOPER_MODE.md",
    "docs/DECISIONS/0018-chatgpt-developer-mode-connection.md",
    "docs/generated/build-016-manifest.json",
    "docs/generated/build-016-acceptance.md",
    "docs/generated/build-016-handoff.md",
    "docs/generated/build-016-receipt.json",
    "docs/generated/project-memory.json",
    "docs/generated/known-gaps.json",
    "docs/generated/safety-capability-matrix.json",
    "docs/generated/eval-registry.json",
    "docs/generated/tool-inventory.json",
    "docs/generated/build-state.json",
    ".github/workflows/build-016-chatgpt-developer-mode-connection.yml"
  ],
  "handAuthoredDocPolicy": "Build 16 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 16 docs.",
  "handoffSummary": "Build 16 models the ChatGPT developer-mode connection workflow while preserving the no-secret, no-production, no-public-submission, no-real-connection, no-unrestricted-live-write boundary.",
  "projectMemorySummary": "Build 16 adds @stealtheye/chatgpt-dev-connection as a fixture/planning package for future manual ChatGPT developer-mode connection around the MCP server and dev endpoint."
};

export default phase;
