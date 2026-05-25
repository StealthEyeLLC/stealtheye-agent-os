import {
  BranchSummarySchema,
  FileMetadataSummarySchema,
  IssueSummarySchema,
  PullRequestSummarySchema,
  ReadOnlyGitHubClientConfigSchema,
  RepoStatusSchemaVersion,
  RepositorySummarySchema,
  RepositoryTargetSchema,
  WorkflowCheckSummarySchema,
  type BranchSummary,
  type FileMetadataSummary,
  type IssueSummary,
  type PullRequestSummary,
  type ReadOnlyGitHubClientConfig,
  type RepositorySummary,
  type RepositoryTarget,
  type WorkflowCheckSummary
} from "./schemas";

export const REPO_STATUS_TARGET_REPO = "StealthEyeLLC/stealtheye-agent-os";
export const REPO_STATUS_FIXTURE_NOW = "2026-01-01T00:00:00.000Z";

export const repoStatusFixtureTarget: RepositoryTarget = RepositoryTargetSchema.parse({
  schema_version: RepoStatusSchemaVersion.RepositoryTarget,
  owner: "StealthEyeLLC",
  repo: "stealtheye-agent-os",
  full_name: REPO_STATUS_TARGET_REPO,
  visibility: "public",
  allowlisted: true,
  live_capability_status: "fixture_only"
});

export const repoStatusPrivateTargetFixture: RepositoryTarget = RepositoryTargetSchema.parse({
  schema_version: RepoStatusSchemaVersion.RepositoryTarget,
  owner: "StealthEyeLLC",
  repo: "private-example",
  full_name: "StealthEyeLLC/private-example",
  visibility: "private",
  allowlisted: false,
  live_capability_status: "denied"
});

export const repoStatusFixtureClientConfig: ReadOnlyGitHubClientConfig = ReadOnlyGitHubClientConfigSchema.parse({
  schema_version: RepoStatusSchemaVersion.GitHubClientConfig,
  mode: "fixture",
  api_base_url: "https://api.github.com",
  allowlisted_repositories: [REPO_STATUS_TARGET_REPO],
  live_capability_status: "fixture_only",
  credentials_supported: false,
  write_methods_supported: false,
  browser_automation_supported: false
});

export const repoStatusLiveReadClientConfig: ReadOnlyGitHubClientConfig = ReadOnlyGitHubClientConfigSchema.parse({
  schema_version: RepoStatusSchemaVersion.GitHubClientConfig,
  mode: "public_unauthenticated_rest",
  api_base_url: "https://api.github.com",
  allowlisted_repositories: [REPO_STATUS_TARGET_REPO],
  live_capability_status: "read_only_live",
  credentials_supported: false,
  write_methods_supported: false,
  browser_automation_supported: false
});

export const repoStatusRepositoryFixture: RepositorySummary = RepositorySummarySchema.parse({
  schema_version: RepoStatusSchemaVersion.RepositorySummary,
  target: repoStatusFixtureTarget,
  default_branch: "main",
  description: "Public-safe foundation scaffold for StealthEye Agent OS.",
  archived: false,
  disabled: false,
  fork: false,
  open_issues_count: 1,
  visibility: "public",
  html_url: "https://github.com/StealthEyeLLC/stealtheye-agent-os",
  pushed_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  live_capability_status: "fixture_only"
});

export const repoStatusBranchFixture: BranchSummary = BranchSummarySchema.parse({
  schema_version: RepoStatusSchemaVersion.BranchSummary,
  target: repoStatusFixtureTarget,
  name: "main",
  commit_sha: "96e909f0d05059bc13a9d62d0b54f73c594495d5",
  protected: false,
  live_capability_status: "fixture_only"
});

export const repoStatusPullRequestsFixture: PullRequestSummary[] = [
  PullRequestSummarySchema.parse({
    schema_version: RepoStatusSchemaVersion.PullRequestSummary,
    target: repoStatusFixtureTarget,
    number: 11,
    title: "Build 10: MCP runtime dev-mode connection",
    state: "merged",
    draft: false,
    head_ref: "agent/mcp-runtime-devmode-connection",
    base_ref: "main",
    user_login: "stealtheye-fixture",
    updated_at: "2026-01-01T00:00:00.000Z",
    checks_summary: "fixture checks passed",
    live_capability_status: "fixture_only"
  })
];

export const repoStatusIssuesFixture: IssueSummary[] = [
  IssueSummarySchema.parse({
    schema_version: RepoStatusSchemaVersion.IssueSummary,
    target: repoStatusFixtureTarget,
    number: 1,
    title: "Master planning issue",
    state: "open",
    user_login: "stealtheye-fixture",
    labels: ["planning", "build-queue"],
    updated_at: "2026-01-01T00:00:00.000Z",
    pull_request: false,
    live_capability_status: "fixture_only"
  })
];

export const repoStatusWorkflowFixture: WorkflowCheckSummary[] = [
  WorkflowCheckSummarySchema.parse({
    schema_version: RepoStatusSchemaVersion.WorkflowCheckSummary,
    target: repoStatusFixtureTarget,
    ref: "main",
    run_id: 110011,
    name: "CI / Scaffold and package checks",
    status: "completed",
    conclusion: "success",
    updated_at: "2026-01-01T00:00:00.000Z",
    html_url: "https://github.com/StealthEyeLLC/stealtheye-agent-os/actions/runs/110011",
    live_capability_status: "fixture_only"
  })
];

export const repoStatusFileFixture: FileMetadataSummary = FileMetadataSummarySchema.parse({
  schema_version: RepoStatusSchemaVersion.FileMetadataSummary,
  target: repoStatusFixtureTarget,
  path: "README.md",
  ref: "main",
  type: "file",
  size: 2048,
  sha: "fixture-readme-sha",
  html_url: "https://github.com/StealthEyeLLC/stealtheye-agent-os/blob/main/README.md",
  content_excerpt: "# StealthEye Agent OS\n\nPublic-safe foundation scaffold.",
  encoding: "utf-8",
  live_capability_status: "fixture_only"
});

export const REPO_STATUS_PUBLIC_SAFE_FILE_CONTENT = "# StealthEye Agent OS\n\nPublic-safe foundation scaffold for tests.\n";
