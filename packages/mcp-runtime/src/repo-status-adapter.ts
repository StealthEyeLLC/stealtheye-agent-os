import {
  RepositoryTargetSchema,
  createFixtureReadOnlyGitHubClient,
  createRepoStatusPacket,
  listIssues,
  listPullRequests,
  readBranchMetadata,
  readFileContent,
  readFileMetadata,
  readIssue,
  readPullRequest,
  readRepositoryMetadata,
  readWorkflowStatus,
  repoStatusFixtureTarget,
  type ReadOnlyGitHubClient,
  type ReadOnlyGitHubEffect,
  type RepoStatusToolName,
  type RepositoryTarget
} from "@stealtheye/repo-status";
import { McpRuntimeSchemaVersion, RuntimeToolDescriptorSchema, type RuntimeToolDescriptor } from "./schemas";

export interface RepoStatusRuntimeOptions {
  repoStatusClient?: ReadOnlyGitHubClient | undefined;
}

interface RepoStatusRuntimeInput {
  target?: Partial<RepositoryTarget> | undefined;
  branch?: string | undefined;
  ref?: string | undefined;
  state?: "open" | "closed" | "all" | undefined;
  number?: number | undefined;
  path?: string | undefined;
}

const inputSchema = { type: "object", additionalProperties: true };
const outputSchema = { type: "object", additionalProperties: true };

const repoTools: Array<{ name: RepoStatusToolName; description: string; effects: ReadOnlyGitHubEffect[] }> = [
  { name: "repo.status.summary", description: "Summarize public-safe repository status through Guard and receipt previews.", effects: ["read_public_repo_metadata", "read_public_branch_metadata", "read_public_pr_metadata", "read_public_issue_metadata", "read_public_workflow_status", "read_public_file_metadata"] },
  { name: "repo.metadata.read", description: "Read public repository metadata for the allowlisted repository.", effects: ["read_public_repo_metadata"] },
  { name: "repo.branch.read", description: "Read public branch metadata for the allowlisted repository.", effects: ["read_public_branch_metadata"] },
  { name: "repo.pr.list", description: "List public pull request metadata for the allowlisted repository.", effects: ["read_public_pr_metadata"] },
  { name: "repo.pr.read", description: "Read one public pull request metadata record for the allowlisted repository.", effects: ["read_public_pr_metadata"] },
  { name: "repo.issue.list", description: "List public issue metadata for the allowlisted repository.", effects: ["read_public_issue_metadata"] },
  { name: "repo.issue.read", description: "Read one public issue metadata record for the allowlisted repository.", effects: ["read_public_issue_metadata"] },
  { name: "repo.workflow.status.read", description: "Read public workflow/check status summaries for the allowlisted repository.", effects: ["read_public_workflow_status"] },
  { name: "repo.file.metadata.read", description: "Read public-safe file metadata from the allowlisted repository.", effects: ["read_public_file_metadata"] },
  { name: "repo.file.content.read", description: "Read public-safe file content from the allowlisted repository.", effects: ["read_public_file_content"] }
];

export function listRepoStatusRuntimeTools(): RuntimeToolDescriptor[] {
  return repoTools.map((tool) => RuntimeToolDescriptorSchema.parse({
    schema_version: McpRuntimeSchemaVersion.RuntimeToolDescriptor,
    name: tool.name,
    description: tool.description,
    inputSchema,
    outputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    riskTier: "low",
    safety: {
      readOnly: true,
      previewOnly: false,
      fixtureOnly: false,
      destructive: false,
      live: true,
      liveWrite: false,
      externalSideEffect: false,
      liveCapabilityStatus: "read_only_live",
      allowedEffects: tool.effects,
      hardStopCategories: ["raw_secrets_credentials", "money_billing_subscriptions", "production_deploy_or_data_mutation", "protected_branch_mutation", "force_push_history_rewrite", "weaken_ci_tests_security", "material_external_send", "legal_commitment"],
      receiptExpectations: ["repo_status_read_receipt_preview", "guard_decision_ref", "read_policy_result_ref", "no_write_no_side_effect_statement"],
      evidenceExpectations: ["public_safe_input_summary", "public_safe_output_summary"]
    },
    mcp_compatible: true,
    app_host_tool: false,
    repo_status_tool: true
  }));
}

export function isRepoStatusRuntimeToolName(name: string): name is RepoStatusToolName {
  return repoTools.some((tool) => tool.name === name);
}

function parseInput(input: unknown): RepoStatusRuntimeInput {
  return input && typeof input === "object" && !Array.isArray(input) ? input as RepoStatusRuntimeInput : {};
}

function targetFromInput(input: RepoStatusRuntimeInput, client: ReadOnlyGitHubClient): RepositoryTarget {
  const provided = input.target ?? {};
  const fullName = provided.full_name ?? (provided.owner && provided.repo ? `${provided.owner}/${provided.repo}` : repoStatusFixtureTarget.full_name);
  const [owner = repoStatusFixtureTarget.owner, repo = repoStatusFixtureTarget.repo] = fullName.split("/");
  return RepositoryTargetSchema.parse({
    schema_version: "stealtheye-repo-status-target.v1",
    owner,
    repo,
    full_name: `${owner}/${repo}`,
    visibility: provided.visibility ?? "public",
    allowlisted: client.config.allowlisted_repositories.includes(`${owner}/${repo}`),
    live_capability_status: client.config.live_capability_status
  });
}

export async function callRepoStatusRuntimeTool(name: RepoStatusToolName, input: unknown = {}, options: RepoStatusRuntimeOptions = {}) {
  const client = options.repoStatusClient ?? createFixtureReadOnlyGitHubClient();
  const parsed = parseInput(input);
  const target = targetFromInput(parsed, client);
  const context = { client, target, liveCapable: client.config.live_capability_status === "read_only_live" };
  if (name === "repo.status.summary") return createRepoStatusPacket(context, { branch: parsed.branch ?? parsed.ref ?? "main", filePath: parsed.path ?? "README.md" });
  if (name === "repo.metadata.read") return readRepositoryMetadata(context);
  if (name === "repo.branch.read") return readBranchMetadata(context, parsed.branch ?? parsed.ref ?? "main");
  if (name === "repo.pr.list") return listPullRequests(context, parsed.state ?? "open");
  if (name === "repo.pr.read") return readPullRequest(context, parsed.number ?? 11);
  if (name === "repo.issue.list") return listIssues(context, parsed.state ?? "open");
  if (name === "repo.issue.read") return readIssue(context, parsed.number ?? 1);
  if (name === "repo.workflow.status.read") return readWorkflowStatus(context, parsed.ref ?? parsed.branch ?? "main");
  if (name === "repo.file.metadata.read") return readFileMetadata(context, parsed.path ?? "README.md", parsed.ref ?? parsed.branch ?? "main");
  if (name === "repo.file.content.read") return readFileContent(context, parsed.path ?? "README.md", parsed.ref ?? parsed.branch ?? "main");
  throw new Error(`Unknown repo/status runtime tool: ${name}`);
}
