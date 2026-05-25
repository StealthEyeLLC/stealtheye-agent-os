const shortMarker = `## Build 11 additive update: live read-only repo/status tools

Build 11 adds \`@stealtheye/repo-status\` and integrates read-only repo/status tools into \`@stealtheye/mcp-runtime\`.

The new surface observes public GitHub repository metadata, branch metadata, pull request metadata, issue metadata, workflow/check summaries, and public-safe file metadata/content when configured. Test coverage remains fixture-backed or mocked.

The runtime exposes only read-only repo/status tools. It does not add credentials, private repository access, branch creation, file writes, commits, pull request mutation, issue mutation, CI reruns, workflow dispatch, deployment, money movement, browser execution, production mutation, or customer-data workflows.

Additional verification for Build 11:

\`\`\`bash
node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check
\`\`\`

Next target after Build 11: **Build 12 — Memory Graph**.`;

const repoStatusDoc = `# Repo Status

Build 11 introduces the first live-capable read-only observation surface for public GitHub repository/status metadata.

The package path is \`packages/repo-status/\`. Runtime integration is in \`packages/mcp-runtime/src/repo-status-adapter.ts\`.

## Capability

\`@stealtheye/repo-status\` can observe public repository information when configured with the public unauthenticated REST client. CI keeps tests deterministic by using fixtures and mocked fetch calls.

Supported read categories:

- Public repository metadata.
- Public branch metadata.
- Public pull request metadata.
- Public issue metadata.
- Public workflow/check summary metadata.
- Public-safe file metadata and content.
- Public-safe repository status packet summaries.

## Runtime tools

The MCP runtime exposes these read-only tool names:

- \`repo.status.summary\`
- \`repo.metadata.read\`
- \`repo.branch.read\`
- \`repo.pr.list\`
- \`repo.pr.read\`
- \`repo.issue.list\`
- \`repo.issue.read\`
- \`repo.workflow.status.read\`
- \`repo.file.metadata.read\`
- \`repo.file.content.read\`

Each descriptor declares \`readOnly: true\`, \`liveWrite: false\`, \`destructive: false\`, \`externalSideEffect: false\`, and \`liveCapabilityStatus: read_only_live\`.

## Live client boundary

The optional live client uses no credentials, uses only GET requests, allows only \`https://api.github.com\`, requires an explicit public repository allowlist, and is not required for CI.

## Guard and receipts

Every repo/status read is evaluated by deterministic read-only policy and Guard. Every read helper returns a public-safe receipt preview with tool name, target repository, target ref/PR/issue/check/file when applicable, timestamp, Guard/policy reference, public-safe input/output summaries, and a no-write/no-side-effect statement.

## Explicit exclusions

Build 11 does not add credentials, private repository access, repository writes, branch creation, commits, pull request mutation, issue mutation, CI reruns, workflow dispatch, deployment, money movement, browser execution, production mutation, or customer-data workflows.`;

const adrDoc = `# ADR 0013: Live Read-Only Repo/Status Tools

## Status

Accepted for Build 11.

## Context

Build 10 introduced a local/dev MCP-style runtime that exposed preview-safe and fixture-backed App Host tools. Build 11 adds a limited live observation surface for the public GitHub repository while preserving hard stops around mutation, credentials, private data, production systems, and external effects.

## Decision

Add \`@stealtheye/repo-status\` as the owner of public GitHub repository/status observation contracts. Integrate it into \`@stealtheye/mcp-runtime\` as read-only repo/status tools.

The implementation includes Zod schemas, deterministic read-only policy helpers, Guard adapter integration, public-safe receipt previews, fixture client coverage, and an optional public unauthenticated GitHub REST client constrained to GET requests against \`https://api.github.com\` for an explicit public repository allowlist.

## Boundaries

Build 11 does not add branch creation, file writes, commits, PR creation or mutation, issue mutation, CI reruns, workflow dispatch, repository settings mutation, secret access, private repository access, browser execution, deployment, money movement, production mutation, or customer-data workflows.

CI remains fixture-backed or mocked and does not require credentials or live network stability.

## Consequences

The runtime can now summarize public repository status through Guard and receipt previews. This is the first live-capable read-only surface, but not a production deployment, durable ledger, public app submission, or write-capable automation layer.

## Next

Build 12 should start Memory Graph work using the Build 11 public-safe read/status pattern as a reference for bounded observation and receipt generation.`;

const llmsTxt = `# llms.txt

StealthEye Agent OS is a public-visible, locked-down TypeScript monorepo for mission-scoped autonomous-agent foundations.

Current build: Build 11 — Live Read-Only Repo/Status Tools through Guard + Receipts.

Key packages: agent-registry, guard, mission-os, app-host, worker-fleet, codeops, browserops, receipts-replay, mcp-runtime, repo-status.

Build 11 package: packages/repo-status.
Build 11 runtime integration: packages/mcp-runtime/src/repo-status-adapter.ts.
Build 11 phase spec: scripts/phases/build-011-live-readonly-repo-status.mjs.
Generated state: docs/generated/.

Allowed Build 11 live capability: read-only public GitHub repository/status observation if configured.
Forbidden: credentials, private repository access, writes/mutations, branch creation, commits, PR or issue mutation, CI reruns, workflow dispatch, deployment, money movement, browser execution, production mutation, customer-data workflows.

Next target: Build 12 — Memory Graph.`;

const llmsFull = `${llmsTxt}

## Build 11 details

Repo/status tools exposed by the MCP runtime: repo.status.summary, repo.metadata.read, repo.branch.read, repo.pr.list, repo.pr.read, repo.issue.list, repo.issue.read, repo.workflow.status.read, repo.file.metadata.read, repo.file.content.read.

Every repo/status read is policy checked, Guard evaluated, and returned with a public-safe receipt preview. CI uses fixture clients and mocked fetch; live public REST reads are optional configuration only.

Canonical generated files include build-011 manifest, acceptance checklist, handoff, receipt, project memory, known gaps, safety capability matrix, eval registry, tool inventory, and build state.`;

export default {
  build: 11,
  title: "Live Read-Only Repo/Status Tools through Guard + Receipts",
  branch: "agent/live-readonly-repo-status-tools",
  packageName: "@stealtheye/repo-status",
  strictGeneratedSync: true,
  packageSummary: "`@stealtheye/repo-status` adds the first live-capable read-only public GitHub observation surface with deterministic policy checks, Guard decisions, receipt previews, fixture tests, and an optional unauthenticated REST client constrained to GET calls against the public GitHub API for an explicit allowlist.",
  projectMemorySummary: "Build 11 crosses from fixture-only previews into limited live read-only public GitHub repository/status observation. It adds repo/status tools to the MCP runtime while preserving no-write, no-secret, no-private-repo, no-browser, no-production, no-money, and no-customer-data boundaries.",
  foundationPackages: ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", "@stealtheye/browserops", "@stealtheye/receipts-replay", "@stealtheye/mcp-runtime", "@stealtheye/repo-status"],
  importantFiles: ["packages/repo-status/package.json", "packages/repo-status/tsconfig.json", "packages/repo-status/src/index.ts", "packages/repo-status/src/schemas.ts", "packages/repo-status/src/github-client.ts", "packages/repo-status/src/read-policy.ts", "packages/repo-status/src/status-summary.ts", "packages/repo-status/src/guard-adapter.ts", "packages/repo-status/src/receipts.ts", "packages/repo-status/src/fixtures.ts", "packages/repo-status/test/repo-status.test.ts", "packages/mcp-runtime/package.json", "packages/mcp-runtime/src/repo-status-adapter.ts", "packages/mcp-runtime/src/schemas.ts", "packages/mcp-runtime/src/tool-router.ts", "packages/mcp-runtime/src/server.ts", "packages/mcp-runtime/src/transport.ts", "packages/mcp-runtime/src/fixtures.ts", "packages/mcp-runtime/src/resources.ts", "packages/mcp-runtime/src/dev-mode.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts", "scripts/phases/build-011-live-readonly-repo-status.mjs"],
  docsUpdated: ["README.md", "AGENTS.md", "llms.txt", "llms-full.txt", "docs/ARCHITECTURE.md", "docs/MCP_RUNTIME.md", "docs/CUSTOM_APPS.md", "docs/WORKFLOWS.md", "docs/RECEIPTS.md", "docs/REPLAY.md", "docs/EVALS.md", "docs/CONTROL_MATRIX.md", "docs/BUILD_PROMPTS.md", "docs/BUILD_AUTOMATION.md", "docs/SECURITY.md", "docs/REPO_STATUS.md", "docs/DECISIONS/0013-live-readonly-repo-status-tools.md"],
  markerBoundedHandAuthoredDocs: ["README.md", "AGENTS.md", "docs/ARCHITECTURE.md", "docs/MCP_RUNTIME.md", "docs/CUSTOM_APPS.md", "docs/WORKFLOWS.md", "docs/RECEIPTS.md", "docs/REPLAY.md", "docs/EVALS.md", "docs/CONTROL_MATRIX.md", "docs/BUILD_PROMPTS.md", "docs/BUILD_AUTOMATION.md", "docs/SECURITY.md"],
  markerBoundedDocUpdates: {
    "README.md": shortMarker,
    "AGENTS.md": shortMarker,
    "docs/ARCHITECTURE.md": shortMarker,
    "docs/MCP_RUNTIME.md": shortMarker,
    "docs/CUSTOM_APPS.md": shortMarker,
    "docs/WORKFLOWS.md": shortMarker,
    "docs/RECEIPTS.md": shortMarker,
    "docs/REPLAY.md": shortMarker,
    "docs/EVALS.md": shortMarker,
    "docs/CONTROL_MATRIX.md": shortMarker,
    "docs/BUILD_PROMPTS.md": shortMarker,
    "docs/BUILD_AUTOMATION.md": shortMarker,
    "docs/SECURITY.md": shortMarker
  },
  standaloneDocs: { "docs/REPO_STATUS.md": repoStatusDoc, "docs/DECISIONS/0013-live-readonly-repo-status-tools.md": adrDoc },
  llmContextUpdates: { "llms.txt": llmsTxt, "llms-full.txt": llmsFull },
  handAuthoredDocPolicy: "Preserve accumulated hand-authored docs. Generated sync may write docs/generated files, standalone generated docs, LLM context files, and Build 11 marker-bounded sections declared in the phase spec.",
  adr: "docs/DECISIONS/0013-live-readonly-repo-status-tools.md",
  testsAndEvals: ["repo/status schemas validate live capability status", "read-only policy allows public repo and PR/status reads", "read-only policy denies unsafe effects", "fixture client returns repo branch PR issue workflow file metadata and content", "Guard adapter allows public reads and denies unsafe or untrusted requests", "receipt previews are generated for each read category", "repo status packet summarizes current public-safe fixture status", "runtime lists repo read-only tools", "runtime repo.status.summary succeeds", "runtime repo.metadata.read succeeds", "runtime repo.pr.list succeeds", "runtime repo.workflow.status.read succeeds", "runtime rejects unsafe repo tool names", "mocked live REST client uses GET only and api.github.com only", "public-safe fixture and docs-facing scanner checks", "Build 11 marker-bounded docs sync from phase spec"],
  defaultEvalLocation: "packages/repo-status/test/repo-status.test.ts",
  ciRequiredFiles: ["pnpm install --no-frozen-lockfile", "pnpm typecheck", "pnpm test", "node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-009-receipts-replay.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-010-mcp-runtime-devmode.mjs --check", "node scripts/stealtheye-build.mjs scripts/phases/build-011-live-readonly-repo-status.mjs --check"],
  generatedArtifacts: ["docs/generated/build-011-manifest.json", "docs/generated/build-011-acceptance.md", "docs/generated/build-011-handoff.md", "docs/generated/build-011-receipt.json", "docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"],
  requiredFiles: ["packages/repo-status/package.json", "packages/repo-status/tsconfig.json", "packages/repo-status/src/index.ts", "packages/repo-status/src/schemas.ts", "packages/repo-status/src/github-client.ts", "packages/repo-status/src/read-policy.ts", "packages/repo-status/src/status-summary.ts", "packages/repo-status/src/guard-adapter.ts", "packages/repo-status/src/receipts.ts", "packages/repo-status/src/fixtures.ts", "packages/repo-status/test/repo-status.test.ts", "packages/mcp-runtime/src/repo-status-adapter.ts", "docs/REPO_STATUS.md", "docs/DECISIONS/0013-live-readonly-repo-status-tools.md"],
  scannerExtraPaths: ["packages/repo-status/src/fixtures.ts", "packages/repo-status/test/repo-status.test.ts", "packages/mcp-runtime/src/repo-status-adapter.ts", "packages/mcp-runtime/test/mcp-runtime.test.ts", "docs/REPO_STATUS.md"],
  acceptanceItems: ["`@stealtheye/repo-status` defines schemas for targets, client config, summaries, status packets, policy results, and receipt previews with explicit live capability status.", "Policy helpers allow only public read effects and deny unsafe effects.", "Guard integration evaluates repo/status reads against a read-only capability token and denies untrusted registry summaries.", "Every read category produces a public-safe receipt preview with target, timestamp, Guard or policy reference, input/output summaries, and no-write statement.", "Fixture client covers deterministic CI tests; optional public unauthenticated REST client uses no credentials, GET only, api.github.com only, and an explicit public repository allowlist.", "MCP runtime lists and calls repo/status read-only tools without exposing write tools.", "Predictable docs and generated state are declared in this phase spec and synced by scripts/stealtheye-build.mjs."],
  safetyBoundaries: ["No branch creation, file writes, commits, PR creation or mutation, issue mutation, CI reruns, workflow dispatch, repository settings mutation, deployment, money movement, browser execution, private repo access, secret access, customer-data workflow, production mutation, or material external send is added.", "Live GitHub behavior, when configured, is read-only public observation using unauthenticated GET requests against the official public GitHub REST API host for an explicit repository allowlist.", "CI tests remain fixture-backed or mocked and do not require credentials or live network stability.", "No durable ledger or production runtime deployment is included."],
  capabilityMatrix: [{ capability: "public_repo_metadata_read", status: "implemented_read_only_live_capable", guard_required: true, live_enabled: true }, { capability: "public_branch_metadata_read", status: "implemented_read_only_live_capable", guard_required: true, live_enabled: true }, { capability: "public_pr_issue_metadata_read", status: "implemented_read_only_live_capable", guard_required: true, live_enabled: true }, { capability: "public_workflow_status_read", status: "implemented_read_only_live_capable", guard_required: true, live_enabled: true }, { capability: "public_file_metadata_content_read", status: "implemented_read_only_live_capable", guard_required: true, live_enabled: true }, { capability: "repo_write_or_mutation", status: "blocked", guard_required: true, live_enabled: false }],
  toolInventory: [{ name: "Repo Status read-only tools", package: "@stealtheye/repo-status", mode: "public_read_only_guarded", live_external_effects: false }, { name: "MCP Runtime repo/status adapter", package: "@stealtheye/mcp-runtime", mode: "read_only_live_capable", live_external_effects: false }, { name: "App Host safe tools", package: "@stealtheye/app-host", mode: "read_only_preview_fixture", live_external_effects: false }],
  knownGaps: ["CI uses fixture clients and mocked fetch for stability; live public REST reads are optional configuration, not required for tests.", "No durable ledger is included for repo/status receipts; receipts are returned with in-memory tool results.", "No official MCP SDK transport, public endpoint, public ChatGPT app submission, or production deployment is included.", "No private repository, credentialed GitHub, GitHub App installation, OAuth, or write workflow is included.", "Memory Graph remains future work."],
  nextTarget: "Build 12 — Memory Graph"
};
