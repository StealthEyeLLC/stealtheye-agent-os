import {
  BranchSummarySchema,
  FileMetadataSummarySchema,
  IssueSummarySchema,
  PullRequestSummarySchema,
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
import {
  REPO_STATUS_PUBLIC_SAFE_FILE_CONTENT,
  repoStatusBranchFixture,
  repoStatusFileFixture,
  repoStatusFixtureClientConfig,
  repoStatusIssuesFixture,
  repoStatusPullRequestsFixture,
  repoStatusRepositoryFixture,
  repoStatusWorkflowFixture
} from "./fixtures";

export interface ReadOnlyGitHubClient {
  readonly config: ReadOnlyGitHubClientConfig;
  getRepository(target: RepositoryTarget): Promise<RepositorySummary>;
  getBranch(target: RepositoryTarget, branch: string): Promise<BranchSummary>;
  listPullRequests(target: RepositoryTarget, state?: "open" | "closed" | "all"): Promise<PullRequestSummary[]>;
  getPullRequest(target: RepositoryTarget, number: number): Promise<PullRequestSummary>;
  listIssues(target: RepositoryTarget, state?: "open" | "closed" | "all"): Promise<IssueSummary[]>;
  getIssue(target: RepositoryTarget, number: number): Promise<IssueSummary>;
  listWorkflowChecks(target: RepositoryTarget, ref: string): Promise<WorkflowCheckSummary[]>;
  getFileMetadata(target: RepositoryTarget, path: string, ref: string): Promise<FileMetadataSummary>;
  getFileContent(target: RepositoryTarget, path: string, ref: string): Promise<{ metadata: FileMetadataSummary; content: string }>;
}

function withTarget<T extends { target: RepositoryTarget }>(value: T, target: RepositoryTarget): T {
  return { ...value, target };
}

export class FixtureReadOnlyGitHubClient implements ReadOnlyGitHubClient {
  readonly config = repoStatusFixtureClientConfig;

  async getRepository(target: RepositoryTarget): Promise<RepositorySummary> {
    return RepositorySummarySchema.parse(withTarget(repoStatusRepositoryFixture, target));
  }

  async getBranch(target: RepositoryTarget, branch: string): Promise<BranchSummary> {
    return BranchSummarySchema.parse({ ...withTarget(repoStatusBranchFixture, target), name: branch });
  }

  async listPullRequests(target: RepositoryTarget): Promise<PullRequestSummary[]> {
    return repoStatusPullRequestsFixture.map((pull) => PullRequestSummarySchema.parse(withTarget(pull, target)));
  }

  async getPullRequest(target: RepositoryTarget, number: number): Promise<PullRequestSummary> {
    const pull = repoStatusPullRequestsFixture.find((item) => item.number === number) ?? { ...repoStatusPullRequestsFixture[0], number };
    return PullRequestSummarySchema.parse(withTarget(pull, target));
  }

  async listIssues(target: RepositoryTarget): Promise<IssueSummary[]> {
    return repoStatusIssuesFixture.map((issue) => IssueSummarySchema.parse(withTarget(issue, target)));
  }

  async getIssue(target: RepositoryTarget, number: number): Promise<IssueSummary> {
    const issue = repoStatusIssuesFixture.find((item) => item.number === number) ?? { ...repoStatusIssuesFixture[0], number };
    return IssueSummarySchema.parse(withTarget(issue, target));
  }

  async listWorkflowChecks(target: RepositoryTarget, ref: string): Promise<WorkflowCheckSummary[]> {
    return repoStatusWorkflowFixture.map((check) => WorkflowCheckSummarySchema.parse({ ...withTarget(check, target), ref }));
  }

  async getFileMetadata(target: RepositoryTarget, path: string, ref: string): Promise<FileMetadataSummary> {
    return FileMetadataSummarySchema.parse({ ...withTarget(repoStatusFileFixture, target), path, ref });
  }

  async getFileContent(target: RepositoryTarget, path: string, ref: string): Promise<{ metadata: FileMetadataSummary; content: string }> {
    return { metadata: await this.getFileMetadata(target, path, ref), content: REPO_STATUS_PUBLIC_SAFE_FILE_CONTENT };
  }
}

export interface GitHubFetchLike {
  (input: string | URL, init?: { method?: string; headers?: Record<string, string> }): Promise<{ ok: boolean; status: number; headers: { get(name: string): string | null }; json(): Promise<unknown> }>;
}

interface GitHubRepoResponse { default_branch?: unknown; description?: unknown; archived?: unknown; disabled?: unknown; fork?: unknown; open_issues_count?: unknown; visibility?: unknown; html_url?: unknown; pushed_at?: unknown; updated_at?: unknown; private?: unknown; }
interface GitHubBranchResponse { name?: unknown; commit?: { sha?: unknown }; protected?: unknown; }
interface GitHubPullResponse { number?: unknown; title?: unknown; state?: unknown; draft?: unknown; merged_at?: unknown; head?: { ref?: unknown }; base?: { ref?: unknown }; user?: { login?: unknown }; updated_at?: unknown; }
interface GitHubIssueResponse { number?: unknown; title?: unknown; state?: unknown; user?: { login?: unknown }; labels?: Array<string | { name?: unknown }>; updated_at?: unknown; pull_request?: unknown; }
interface GitHubWorkflowRunResponse { id?: unknown; name?: unknown; status?: unknown; conclusion?: unknown; updated_at?: unknown; html_url?: unknown; }
interface GitHubContentResponse { path?: unknown; type?: unknown; size?: unknown; sha?: unknown; html_url?: unknown; content?: unknown; encoding?: unknown; }

function asString(value: unknown, fallback = ""): string { return typeof value === "string" ? value : fallback; }
function asNullableString(value: unknown): string | null { return typeof value === "string" ? value : null; }
function asBoolean(value: unknown): boolean { return typeof value === "boolean" ? value : false; }
function asNumber(value: unknown): number { return typeof value === "number" && Number.isFinite(value) ? value : 0; }
function encodePath(path: string): string { return path.split("/").map(encodeURIComponent).join("/"); }

export class PublicUnauthenticatedGitHubRestClient implements ReadOnlyGitHubClient {
  readonly capturedRequests: Array<{ method: string; url: string }> = [];

  constructor(readonly config: ReadOnlyGitHubClientConfig, private readonly fetchImpl: GitHubFetchLike = globalThis.fetch as GitHubFetchLike) {}

  private assertTargetAllowed(target: RepositoryTarget): void {
    if (target.visibility !== "public" || !target.allowlisted || !this.config.allowlisted_repositories.includes(target.full_name)) {
      throw new Error(`Repository target is not allowed for public unauthenticated reads: ${target.full_name}`);
    }
  }

  private endpoint(path: string, params: Record<string, string | number | undefined> = {}): URL {
    const url = new URL(path, this.config.api_base_url);
    if (url.protocol !== "https:" || url.hostname !== "api.github.com") throw new Error("Only https://api.github.com is allowed for live read-only GitHub REST calls.");
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));
    return url;
  }

  private async getJson<T>(target: RepositoryTarget, path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
    this.assertTargetAllowed(target);
    const url = this.endpoint(path, params);
    this.capturedRequests.push({ method: "GET", url: url.toString() });
    const response = await this.fetchImpl(url, { method: "GET", headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" } });
    if (!response.ok) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      if (response.status === 403 && remaining === "0") throw new Error("GitHub public REST rate limit reached for unauthenticated read-only client.");
      throw new Error(`GitHub public REST read failed with status ${response.status}.`);
    }
    return await response.json() as T;
  }

  async getRepository(target: RepositoryTarget): Promise<RepositorySummary> {
    const data = await this.getJson<GitHubRepoResponse>(target, `/repos/${target.owner}/${target.repo}`);
    const visibility = data.private === true ? "private" : asString(data.visibility, "public") === "private" ? "private" : "public";
    return RepositorySummarySchema.parse({
      schema_version: "stealtheye-repo-status-repository-summary.v1",
      target: RepositoryTargetSchema.parse({ ...target, visibility, live_capability_status: "read_only_live" }),
      default_branch: asString(data.default_branch, "main"),
      description: asNullableString(data.description),
      archived: asBoolean(data.archived),
      disabled: asBoolean(data.disabled),
      fork: asBoolean(data.fork),
      open_issues_count: asNumber(data.open_issues_count),
      visibility,
      html_url: asString(data.html_url, `https://github.com/${target.full_name}`),
      pushed_at: asNullableString(data.pushed_at),
      updated_at: asNullableString(data.updated_at),
      live_capability_status: "read_only_live"
    });
  }

  async getBranch(target: RepositoryTarget, branch: string): Promise<BranchSummary> {
    const data = await this.getJson<GitHubBranchResponse>(target, `/repos/${target.owner}/${target.repo}/branches/${encodeURIComponent(branch)}`);
    return BranchSummarySchema.parse({ schema_version: "stealtheye-repo-status-branch-summary.v1", target: { ...target, live_capability_status: "read_only_live" }, name: asString(data.name, branch), commit_sha: asString(data.commit?.sha, "unknown"), protected: asBoolean(data.protected), live_capability_status: "read_only_live" });
  }

  async listPullRequests(target: RepositoryTarget, state: "open" | "closed" | "all" = "open"): Promise<PullRequestSummary[]> {
    const data = await this.getJson<GitHubPullResponse[]>(target, `/repos/${target.owner}/${target.repo}/pulls`, { state, per_page: 10 });
    return data.map((pull) => this.mapPull(target, pull));
  }

  async getPullRequest(target: RepositoryTarget, number: number): Promise<PullRequestSummary> {
    return this.mapPull(target, await this.getJson<GitHubPullResponse>(target, `/repos/${target.owner}/${target.repo}/pulls/${number}`));
  }

  async listIssues(target: RepositoryTarget, state: "open" | "closed" | "all" = "open"): Promise<IssueSummary[]> {
    const data = await this.getJson<GitHubIssueResponse[]>(target, `/repos/${target.owner}/${target.repo}/issues`, { state, per_page: 10 });
    return data.map((issue) => this.mapIssue(target, issue));
  }

  async getIssue(target: RepositoryTarget, number: number): Promise<IssueSummary> {
    return this.mapIssue(target, await this.getJson<GitHubIssueResponse>(target, `/repos/${target.owner}/${target.repo}/issues/${number}`));
  }

  async listWorkflowChecks(target: RepositoryTarget, ref: string): Promise<WorkflowCheckSummary[]> {
    const data = await this.getJson<{ workflow_runs?: GitHubWorkflowRunResponse[] }>(target, `/repos/${target.owner}/${target.repo}/actions/runs`, { branch: ref, per_page: 10 });
    return (data.workflow_runs ?? []).map((run) => WorkflowCheckSummarySchema.parse({ schema_version: "stealtheye-repo-status-workflow-check-summary.v1", target: { ...target, live_capability_status: "read_only_live" }, ref, run_id: asNumber(run.id), name: asString(run.name, "GitHub Actions workflow"), status: ["queued", "in_progress", "completed"].includes(asString(run.status)) ? asString(run.status) : "unknown", conclusion: ["success", "failure", "neutral", "cancelled", "skipped", "timed_out", "action_required"].includes(asString(run.conclusion)) ? asString(run.conclusion) : run.conclusion === null ? null : "unknown", updated_at: asNullableString(run.updated_at), html_url: asNullableString(run.html_url), live_capability_status: "read_only_live" }));
  }

  async getFileMetadata(target: RepositoryTarget, path: string, ref: string): Promise<FileMetadataSummary> {
    const data = await this.getJson<GitHubContentResponse>(target, `/repos/${target.owner}/${target.repo}/contents/${encodePath(path)}`, { ref });
    return this.mapFile(target, data, path, ref);
  }

  async getFileContent(target: RepositoryTarget, path: string, ref: string): Promise<{ metadata: FileMetadataSummary; content: string }> {
    const data = await this.getJson<GitHubContentResponse>(target, `/repos/${target.owner}/${target.repo}/contents/${encodePath(path)}`, { ref });
    const metadata = this.mapFile(target, data, path, ref);
    const encoding = asString(data.encoding);
    const contentRaw = asString(data.content);
    const content = encoding === "base64" ? Buffer.from(contentRaw.replace(/\n/g, ""), "base64").toString("utf8") : contentRaw;
    return { metadata: { ...metadata, content_excerpt: content.slice(0, 500), encoding: encoding || metadata.encoding }, content };
  }

  private mapPull(target: RepositoryTarget, pull: GitHubPullResponse): PullRequestSummary {
    const state = pull.merged_at ? "merged" : asString(pull.state, "open") === "closed" ? "closed" : "open";
    return PullRequestSummarySchema.parse({ schema_version: "stealtheye-repo-status-pr-summary.v1", target: { ...target, live_capability_status: "read_only_live" }, number: asNumber(pull.number), title: asString(pull.title, "Untitled pull request"), state, draft: asBoolean(pull.draft), head_ref: asString(pull.head?.ref), base_ref: asString(pull.base?.ref), user_login: asNullableString(pull.user?.login), updated_at: asNullableString(pull.updated_at), live_capability_status: "read_only_live" });
  }

  private mapIssue(target: RepositoryTarget, issue: GitHubIssueResponse): IssueSummary {
    const labels = (issue.labels ?? []).map((label) => typeof label === "string" ? label : asString(label.name)).filter((label) => label.length > 0);
    return IssueSummarySchema.parse({ schema_version: "stealtheye-repo-status-issue-summary.v1", target: { ...target, live_capability_status: "read_only_live" }, number: asNumber(issue.number), title: asString(issue.title, "Untitled issue"), state: asString(issue.state, "open") === "closed" ? "closed" : "open", user_login: asNullableString(issue.user?.login), labels, updated_at: asNullableString(issue.updated_at), pull_request: Boolean(issue.pull_request), live_capability_status: "read_only_live" });
  }

  private mapFile(target: RepositoryTarget, data: GitHubContentResponse, path: string, ref: string): FileMetadataSummary {
    const type = ["file", "dir", "symlink", "submodule"].includes(asString(data.type)) ? asString(data.type) : "unknown";
    return FileMetadataSummarySchema.parse({ schema_version: "stealtheye-repo-status-file-metadata-summary.v1", target: { ...target, live_capability_status: "read_only_live" }, path: asString(data.path, path), ref, type, size: asNumber(data.size), sha: asString(data.sha, "unknown"), html_url: asNullableString(data.html_url), encoding: asString(data.encoding, undefined as unknown as string), live_capability_status: "read_only_live" });
  }
}

export function createFixtureReadOnlyGitHubClient(): ReadOnlyGitHubClient {
  return new FixtureReadOnlyGitHubClient();
}

export function createPublicUnauthenticatedGitHubRestClient(config: ReadOnlyGitHubClientConfig, fetchImpl?: GitHubFetchLike): PublicUnauthenticatedGitHubRestClient {
  return new PublicUnauthenticatedGitHubRestClient(config, fetchImpl);
}
