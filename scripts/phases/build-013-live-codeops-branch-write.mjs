const codeopsLiveWriteDoc = `# CodeOps Live Write Boundary

Build 13 adds the first branch-safe CodeOps write-path foundation through Guard and receipt previews.

The implemented path is fixture-first. CI uses only fixture and dry-run behavior. Optional live GitHub branch-write behavior is modeled behind a config-required interface and is disabled by default.

## Allowed Build 13 scope

- Non-protected branches with allowed prefixes.
- The allowlisted public repository target.
- Small public-safe generated, test fixture, or documentation changes.
- Preview and fixture write results.
- Policy, Guard, and receipt preview events.
- Verification commands and receipt expectations on every plan.

## Denied scope

- Direct writes to \`main\`, \`master\`, default branches, or protected branches.
- Force push or history rewrite.
- GitHub workflow mutation through the branch-write writer.
- CI, test, or security weakening.
- Credential-like paths, secret-bearing paths, private-data paths, or customer-data paths.
- Production deployment paths or production mutation.
- Destructive deletion. Build 13 models delete as \`delete_prohibited\` only.
- Durable receipt ledger writes.

## Runtime tools

- \`codeops.write.plan.preview\` previews plan, policy, and Guard decisions.
- \`codeops.branch.write.preview\` returns a dry-run branch-write result.
- \`codeops.branch.write.fixture\` executes the fixture-only writer with no external side effect.
- \`codeops.write.receipt.preview\` returns receipt preview events.

Preview tools are preview-only. The fixture execution tool is fixture-only, non-destructive, and has no external side effect. No unrestricted live write tool is exposed.

## GitHub API documentation checked

Before modeling optional live behavior, Build 13 checked current official GitHub REST documentation for repository contents create/update, Git references, pull request creation, and branch protection. The code does not embed credentials and does not run live GitHub write tests in CI.

## Known gaps

- Optional live GitHub writer is config-required and not executed by CI.
- No durable receipt ledger exists yet.
- Pull request creation is modeled as preview/future behavior, not a live runtime tool.
- Official MCP SDK/server transport alignment remains future work for Build 14.
`;
const adrDoc = `# ADR 0015: Live CodeOps Branch-Write Path through Guard and Receipts

## Status

Accepted for Build 13.

## Decision

Add a guarded CodeOps branch-write foundation that validates branch-write plans, applies explicit branch-write policy, maps plan stages into Guard requested actions, and emits receipt previews for every attempted preview or fixture write.

The writer surface is fixture-first. CI uses fixtures and mocks only. Optional GitHub branch-write support is modeled behind a config-required interface and remains disabled by default.

## Safety boundaries

Build 13 denies protected branch writes, direct default branch writes, force push, workflow mutation, CI/test/security weakening, credential-like paths, production deployment paths, private/customer data paths, and destructive deletion.

Delete is modeled only as \`delete_prohibited\` in Build 13.

## Runtime exposure

The MCP runtime exposes CodeOps write preview tools and one fixture-only execution tool. No unrestricted live write tool is exposed.

## GitHub API documentation basis

Optional live behavior was modeled only after checking official GitHub REST documentation for repository contents create/update, Git references, pull request creation, and branch protection concepts. No credential is added to the repository and no CI test requires live GitHub write access.

## Consequences

This establishes a safe bridge from CodeOps planning to future branch-scoped writing while preserving the public/private boundary and generated receipt trail.

## Next

Build 14 should align the official MCP server transport and SDK integration.
`;
export default {
  build: 13,
  title: "Live CodeOps Branch-Write Path through Guard + Receipts",
  branch: "agent/live-codeops-branch-write",
  packageName: "@stealtheye/codeops",
  strictGeneratedSync: true,
  packageSummary: "Guarded CodeOps branch-write schemas, policy, receipt previews, fixture writer, config-required GitHub writer interface, and MCP runtime tools.",
  projectMemorySummary: "Build 13 adds the first guarded branch-write foundation for CodeOps through policy, Guard requested actions, receipt previews, fixture-only execution, and config-required optional GitHub writer modeling. CI remains fixture-backed and no protected branch, workflow, credential, production, or customer-data write path is exposed.",
  handoffSummary: "Build 13 bridges CodeOps planning into a guarded branch-safe write path through Guard and Receipts while keeping CI fixture-only and live GitHub writing config-required.",
  foundationPackages: ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime", "@stealtheye/repo-status", "@stealtheye/memory-graph"],
  importantFiles: ["packages/codeops/src/branch-write.ts", "packages/codeops/src/live-write-policy.ts", "packages/codeops/src/write-receipts.ts", "packages/codeops/src/write-fixtures.ts", "packages/codeops/src/fixture-writer.ts", "packages/codeops/src/github-writer.ts", "packages/codeops/test/codeops-branch-write.test.ts", "packages/mcp-runtime/src/codeops-write-adapter.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts", "scripts/phases/build-013-live-codeops-branch-write.mjs"],
  docsUpdated: ["docs/CODEOPS_LIVE_WRITE.md", "docs/DECISIONS/0015-live-codeops-branch-write.md", "docs/generated/build-013-manifest.json", "docs/generated/build-013-acceptance.md", "docs/generated/build-013-handoff.md", "docs/generated/build-013-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  markerBoundedHandAuthoredDocs: [],
  handAuthoredDocPolicy: "Build 13 preserves README.md, AGENTS.md, and docs/ARCHITECTURE.md unchanged. Generated sync writes only declared generated files and standalone Build 13 docs.",
  adr: "docs/DECISIONS/0015-live-codeops-branch-write.md",
  testsAndEvals: ["branch-write schemas validate", "branch-write policy deny and allow matrix", "Guard integration for safe and unsafe branch-write plans", "branch-write receipt previews", "fixture writer preview and execute results", "runtime lists and calls CodeOps write tools", "protected docs unchanged", "Build 13 strict generated sync check"],
  defaultEvalLocation: "packages/codeops/test/codeops-branch-write.test.ts",
  evalLocations: { "runtime lists and calls CodeOps write tools": "packages/mcp-runtime/test/mcp-runtime.test.ts", "Build 13 strict generated sync check": "scripts/phases/build-013-live-codeops-branch-write.mjs" },
  ciRequiredFiles: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-012-memory-graph.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-013-live-codeops-branch-write.mjs --check"],
  generatedArtifacts: ["docs/generated/build-013-manifest.json", "docs/generated/build-013-acceptance.md", "docs/generated/build-013-handoff.md", "docs/generated/build-013-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  requiredFiles: ["packages/codeops/src/branch-write.ts", "packages/codeops/src/live-write-policy.ts", "packages/codeops/src/write-receipts.ts", "packages/codeops/src/write-fixtures.ts", "packages/codeops/src/fixture-writer.ts", "packages/codeops/src/github-writer.ts", "packages/codeops/test/codeops-branch-write.test.ts", "packages/mcp-runtime/src/codeops-write-adapter.ts", "docs/CODEOPS_LIVE_WRITE.md", "docs/DECISIONS/0015-live-codeops-branch-write.md"],
  scannerExtraPaths: ["packages/codeops/src/write-fixtures.ts", "packages/codeops/test/codeops-branch-write.test.ts", "packages/mcp-runtime/src/codeops-write-adapter.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts", "docs/CODEOPS_LIVE_WRITE.md"],
  acceptanceItems: ["Branch-write schemas and helpers exist.", "Policy denies protected branches, invalid prefixes, workflow mutation, CI/security weakening, secret paths, production paths, delete, oversized patches, missing verification, and missing receipts.", "Guard requested actions cover repo branch read, branch create, file write, commit, PR open preview, and receipt write stages.", "Receipt previews cover policy, Guard, target repo/branch, file summaries, verification commands, safety statements, mode, and final result.", "Fixture writer preview and execution results are implemented and tested.", "MCP runtime exposes CodeOps write preview tools and one fixture-only execution tool without unrestricted live write tools.", "Strict generated sync is true.", "Protected docs are untouched."],
  safetyBoundaries: ["No direct protected branch, default branch, main, or master write is allowed.", "No force push, history rewrite, workflow mutation, CI/test/security weakening, destructive deletion, production mutation, credential path, or customer/private data path is allowed.", "CI uses fixtures and mocks only; optional GitHub writer behavior is disabled/config-required and never uses credentials in tests.", "Receipts are preview events only; no durable ledger is added."],
  capabilityMatrix: [{ capability: "codeops_branch_write_policy", status: "implemented_fixture_and_dry_run", guard_required: true, live_enabled: false }, { capability: "codeops_fixture_branch_writer", status: "implemented_fixture_only", guard_required: true, live_enabled: false }, { capability: "optional_github_branch_writer", status: "modeled_config_required_disabled_by_default", guard_required: true, live_enabled: false }, { capability: "unrestricted_live_repo_write", status: "blocked", guard_required: true, live_enabled: false }],
  toolInventory: [{ name: "CodeOps branch-write package", package: "@stealtheye/codeops", mode: "fixture_and_dry_run_guarded", live_external_effects: false }, { name: "CodeOps MCP write preview tools", package: "@stealtheye/mcp-runtime", mode: "preview_and_fixture_only", live_external_effects: false }],
  knownGaps: ["Optional live GitHub writer remains config-required and is not exercised in CI.", "No durable receipt ledger is included.", "Pull request opening is modeled as preview/future behavior and not exposed as an unrestricted live runtime tool.", "Official MCP SDK/server transport alignment remains future work."],
  nextTarget: "Build 14 — Official MCP Server Transport / SDK Alignment",
  standaloneDocs: { "docs/CODEOPS_LIVE_WRITE.md": codeopsLiveWriteDoc, "docs/DECISIONS/0015-live-codeops-branch-write.md": adrDoc }
};
