import type { GuardDecision } from "@stealtheye/guard";
import type { ReadOnlyGitHubClient } from "./github-client";
import { createFixtureReadOnlyGitHubClient } from "./github-client";
import { evaluateRepoStatusGuard } from "./guard-adapter";
import { createRepoStatusReceiptPreview } from "./receipts";
import {
  RepoStatusPacketSchema,
  RepoStatusSchemaVersion,
  type BranchSummary,
  type FileMetadataSummary,
  type IssueSummary,
  type PullRequestSummary,
  type ReadOnlyGitHubEffect,
  type ReadOnlyPolicyResult,
  type ReadOnlyReceiptPreview,
  type RepoStatusPacket,
  type RepoStatusToolName,
  type RepositorySummary,
  type RepositoryTarget,
  type WorkflowCheckSummary
} from "./schemas";

export interface RepoStatusReadContext {
  client?: ReadOnlyGitHubClient | undefined;
  target: RepositoryTarget;
  liveCapable?: boolean | undefined;
}

export interface RepoStatusReadResult<T> {
  ok: boolean;
  result: T;
  policy: ReadOnlyPolicyResult;
  guard_decision: GuardDecision;
  receipt: ReadOnlyReceiptPreview;
}

function clientFor(context: RepoStatusReadContext): ReadOnlyGitHubClient {
  return context.client ?? createFixtureReadOnlyGitHubClient();
}

function assertAllowed(policy: ReadOnlyPolicyResult, decision: GuardDecision): void {
  if (!policy.allowed || decision.decision !== "allow") throw new Error(`${policy.summary} Guard decision: ${decision.decision}.`);
}

async function guardedRead<T>(context: RepoStatusReadContext, effect: ReadOnlyGitHubEffect, toolName: RepoStatusToolName, read: (client: ReadOnlyGitHubClient) => Promise<T>, outputSummary: (result: T) => string, options: { ref?: string; path?: string; pr?: number; issue?: number; check?: string; file?: string } = {}): Promise<RepoStatusReadResult<T>> {
  const guard = evaluateRepoStatusGuard({ effect, target: context.target, ref: options.ref, path: options.path, liveCapable: context.liveCapable ?? clientFor(context).config.live_capability_status === "read_only_live" });
  assertAllowed(guard.policy, guard.decision);
  const result = await read(clientFor(context));
  const receipt = createRepoStatusReceiptPreview({ toolName, target: context.target, policy: guard.policy, guardDecision: guard.decision, outputSummary: outputSummary(result), ref: options.ref, pr: options.pr, issue: options.issue, check: options.check, file: options.file });
  return { ok: true, result, policy: guard.policy, guard_decision: guard.decision, receipt };
}

export async function readRepositoryMetadata(context: RepoStatusReadContext): Promise<RepoStatusReadResult<RepositorySummary>> {
  return guardedRead(context, "read_public_repo_metadata", "repo.metadata.read", (client) => client.getRepository(context.target), (repo) => `Observed public repository metadata for ${repo.target.full_name} with default branch ${repo.default_branch}.`);
}

export async function readBranchMetadata(context: RepoStatusReadContext, branch = "main"): Promise<RepoStatusReadResult<BranchSummary>> {
  return guardedRead(context, "read_public_branch_metadata", "repo.branch.read", (client) => client.getBranch(context.target, branch), (summary) => `Observed public branch ${summary.name} at ${summary.commit_sha}.`, { ref: branch });
}

export async function listPullRequests(context: RepoStatusReadContext, state: "open" | "closed" | "all" = "open"): Promise<RepoStatusReadResult<PullRequestSummary[]>> {
  return guardedRead(context, "read_public_pr_metadata", "repo.pr.list", (client) => client.listPullRequests(context.target, state), (pulls) => `Observed ${pulls.length} public pull request summaries.`, { ref: state });
}

export async function readPullRequest(context: RepoStatusReadContext, number: number): Promise<RepoStatusReadResult<PullRequestSummary>> {
  return guardedRead(context, "read_public_pr_metadata", "repo.pr.read", (client) => client.getPullRequest(context.target, number), (pull) => `Observed public pull request #${pull.number}: ${pull.title}.`, { pr: number });
}

export async function listIssues(context: RepoStatusReadContext, state: "open" | "closed" | "all" = "open"): Promise<RepoStatusReadResult<IssueSummary[]>> {
  return guardedRead(context, "read_public_issue_metadata", "repo.issue.list", (client) => client.listIssues(context.target, state), (issues) => `Observed ${issues.length} public issue summaries.`, { ref: state });
}

export async function readIssue(context: RepoStatusReadContext, number: number): Promise<RepoStatusReadResult<IssueSummary>> {
  return guardedRead(context, "read_public_issue_metadata", "repo.issue.read", (client) => client.getIssue(context.target, number), (issue) => `Observed public issue #${issue.number}: ${issue.title}.`, { issue: number });
}

export async function readWorkflowStatus(context: RepoStatusReadContext, ref = "main"): Promise<RepoStatusReadResult<WorkflowCheckSummary[]>> {
  return guardedRead(context, "read_public_workflow_status", "repo.workflow.status.read", (client) => client.listWorkflowChecks(context.target, ref), (checks) => `Observed ${checks.length} public workflow/check summaries for ${ref}.`, { ref, check: "recent" });
}

export async function readFileMetadata(context: RepoStatusReadContext, path: string, ref = "main"): Promise<RepoStatusReadResult<FileMetadataSummary>> {
  return guardedRead(context, "read_public_file_metadata", "repo.file.metadata.read", (client) => client.getFileMetadata(context.target, path, ref), (file) => `Observed public file metadata for ${file.path} at ${file.ref}.`, { ref, path, file: path });
}

export async function readFileContent(context: RepoStatusReadContext, path: string, ref = "main"): Promise<RepoStatusReadResult<{ metadata: FileMetadataSummary; content: string }>> {
  return guardedRead(context, "read_public_file_content", "repo.file.content.read", (client) => client.getFileContent(context.target, path, ref), (file) => `Observed public file content for ${file.metadata.path} with ${file.content.length} characters.`, { ref, path, file: path });
}

export async function createRepoStatusPacket(context: RepoStatusReadContext, options: { branch?: string; filePath?: string } = {}): Promise<RepoStatusReadResult<RepoStatusPacket>> {
  const branchName = options.branch ?? "main";
  const filePath = options.filePath ?? "README.md";
  const guard = evaluateRepoStatusGuard({ effect: "read_public_repo_metadata", target: context.target, ref: branchName, liveCapable: context.liveCapable ?? clientFor(context).config.live_capability_status === "read_only_live" });
  assertAllowed(guard.policy, guard.decision);
  const client = clientFor(context);
  const repository = await client.getRepository(context.target);
  const default_branch = await client.getBranch(context.target, branchName);
  const pull_requests = await client.listPullRequests(context.target, "all");
  const issues = await client.listIssues(context.target, "open");
  const workflow_checks = await client.listWorkflowChecks(context.target, branchName);
  const file = await client.getFileMetadata(context.target, filePath, branchName);
  const summary = `Repository ${context.target.full_name} is public, default branch ${repository.default_branch}, ${pull_requests.length} PR summaries, ${issues.length} issue summaries, ${workflow_checks.length} workflow/check summaries observed.`;
  const receipt = createRepoStatusReceiptPreview({ toolName: "repo.status.summary", target: context.target, policy: guard.policy, guardDecision: guard.decision, outputSummary: summary, ref: branchName });
  const packet = RepoStatusPacketSchema.parse({
    schema_version: RepoStatusSchemaVersion.RepoStatusPacket,
    target: context.target,
    repository,
    default_branch,
    pull_requests,
    issues,
    workflow_checks,
    files: [file],
    generated_at: "2026-01-01T00:00:00.000Z",
    live_capability_status: guard.policy.live_capability_status,
    summary,
    receipts: [receipt],
    no_write_no_side_effect_statement: "Repo/status summary performed only read-only public observation and did not mutate GitHub, CI, deployment, money, browser, private repo, secret, or production state."
  });
  return { ok: true, result: packet, policy: guard.policy, guard_decision: guard.decision, receipt };
}
