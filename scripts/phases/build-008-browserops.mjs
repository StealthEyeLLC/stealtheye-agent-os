export default {
  build: 8,
  title: "BrowserOps Foundations + Minimal Build Automation Engine",
  branch: "agent/browserops-foundation",
  packageName: "@stealtheye/browserops",
  importantFiles: [
    "packages/browserops/package.json",
    "packages/browserops/tsconfig.json",
    "packages/browserops/src/index.ts",
    "packages/browserops/src/schemas.ts",
    "packages/browserops/src/session.ts",
    "packages/browserops/src/page-state.ts",
    "packages/browserops/src/evidence.ts",
    "packages/browserops/src/action-policy.ts",
    "packages/browserops/src/action-plan.ts",
    "packages/browserops/src/preflight.ts",
    "packages/browserops/src/fixtures.ts",
    "packages/browserops/test/browserops.test.ts",
    "scripts/stealtheye-build.mjs",
    "scripts/phases/build-008-browserops.mjs"
  ],
  docsUpdated: ["README.md", "AGENTS.md", "llms.txt", "llms-full.txt", "docs/ARCHITECTURE.md", "docs/WORKFLOWS.md", "docs/RECEIPTS.md", "docs/EVALS.md", "docs/CONTROL_MATRIX.md", "docs/BUILD_PROMPTS.md", "docs/SECURITY.md", "docs/WORKER_FLEET.md", "docs/APP_HOST.md", "docs/MISSION_OS.md", "docs/BROWSEROPS.md", "docs/BUILD_AUTOMATION.md"],
  adr: "docs/DECISIONS/0010-browserops-build-automation.md",
  testsAndEvals: ["packages/browserops/test/browserops.test.ts", "Browser session validation", "Page observation risky-control detection", "Evidence reference validation", "Browser action policy decisions", "Guard requested-action conversion", "Worker Fleet task-template conversion", "Guard preflight allow/block/escalate coverage", "Fixture public-safety checks"],
  ciRequiredFiles: [".github/workflows/ci.yml", "pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check"],
  generatedArtifacts: ["docs/generated/build-008-manifest.json", "docs/generated/build-008-acceptance.md", "docs/generated/build-008-handoff.md", "docs/generated/build-008-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  safetyBoundaries: [
    "BrowserOps is fixture-only and reference-only in Build 8.",
    "No Playwright runtime execution or live browser automation is added.",
    "No credentialed browsing, real cookies, real storage state, live website login, or secret access is added.",
    "No material external sends, purchases, money movement, destructive actions, or production mutation are enabled.",
    "Browser evidence uses public-safe references only; no real screenshots, DOM snapshots, HARs, videos, traces, or downloaded file bytes are included.",
    "The build automation engine generates public-safe state only and is not a deployment system."
  ],
  knownGaps: [
    "Live BrowserOps runtime, Playwright integration, browser isolation infrastructure, and credential broker flows remain future work.",
    "Build automation is a minimal deterministic generator/checker, not a full workflow compiler or provenance system.",
    "Generated build-state files are source-controlled snapshots, not durable mission receipts from a production ledger.",
    "Scanner is conservative and public-safe but does not replace full secret scanning, SBOM generation, or supply-chain attestation.",
    "Worker Fleet handoff remains task-template modeling only; no queue, executor, or browser worker is created."
  ],
  nextTarget: "Build 9 — Receipts + Replay"
};
