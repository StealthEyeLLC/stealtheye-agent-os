import { z } from "zod";

export const RepoStatusSchemaVersion = {
  RepositoryTarget: "stealtheye-repo-status-target.v1",
  GitHubClientConfig: "stealtheye-repo-status-github-client-config.v1",
  RepositorySummary: "stealtheye-repo-status-repository-summary.v1",
  BranchSummary: "stealtheye-repo-status-branch-summary.v1",
  PullRequestSummary: "stealtheye-repo-status-pr-summary.v1",
  IssueSummary: "stealtheye-repo-status-issue-summary.v1",
  WorkflowCheckSummary: "stealtheye-repo-status-workflow-check-summary.v1",
  FileMetadataSummary: "stealtheye-repo-status-file-metadata-summary.v1",
  RepoStatusPacket: "stealtheye-repo-status-packet.v1",
  ReadOnlyPolicyResult: "stealtheye-repo-status-read-policy-result.v1",
  ReadOnlyReceiptPreview: "stealtheye-repo-status-receipt-preview.v1"
} as const;

export const LiveCapabilityStatusSchema = z.enum(["fixture_only", "read_only_live", "live_unavailable", "denied"]);
export const RepoStatusToolNameSchema = z.enum([
  "repo.status.summary",
  "repo.metadata.read",
  "repo.branch.read",
  "repo.pr.list",
  "repo.pr.read",
  "repo.issue.list",
  "repo.issue.read",
  "repo.workflow.status.read",
  "repo.file.metadata.read",
  "repo.file.content.read"
]);

export const ReadOnlyGitHubEffectSchema = z.enum([
  "read_public_repo_metadata",
  "read_public_branch_metadata",
  "read_public_pr_metadata",
  "read_public_issue_metadata",
  "read_public_workflow_status",
  "read_public_file_metadata",
  "read_public_file_content",
  "write_branch_files",
  "commit_branch",
  "open_pr",
  "update_pr",
  "update_issue",
  "rerun_ci",
  "dispatch_workflow",
  "mutate_repo_settings",
  "read_secrets",
  "read_private_repo",
  "deploy",
  "external_send",
  "money_movement"
]);

export const AllowedReadOnlyGitHubEffectSchema = z.enum([
  "read_public_repo_metadata",
  "read_public_branch_metadata",
  "read_public_pr_metadata",
  "read_public_issue_metadata",
  "read_public_workflow_status",
  "read_public_file_metadata",
  "read_public_file_content"
]);

export const RepositoryTargetSchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.RepositoryTarget),
  owner: z.string().min(1),
  repo: z.string().min(1),
  full_name: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  visibility: z.enum(["public", "private"]).default("public"),
  allowlisted: z.boolean(),
  live_capability_status: LiveCapabilityStatusSchema
}).refine((target) => target.full_name === `${target.owner}/${target.repo}`, "full_name must equal owner/repo");

export const ReadOnlyGitHubClientConfigSchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.GitHubClientConfig),
  mode: z.enum(["fixture", "public_unauthenticated_rest"]),
  api_base_url: z.literal("https://api.github.com"),
  allowlisted_repositories: z.array(z.string()).min(1),
  live_capability_status: LiveCapabilityStatusSchema,
  credentials_supported: z.literal(false),
  write_methods_supported: z.literal(false),
  browser_automation_supported: z.literal(false)
});

export const ReadOnlyPolicyResultSchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.ReadOnlyPolicyResult),
  allowed: z.boolean(),
  effect: ReadOnlyGitHubEffectSchema,
  target_repo: z.string(),
  target_ref: z.string().optional(),
  target_path: z.string().optional(),
  live_capability_status: LiveCapabilityStatusSchema,
  reason_codes: z.array(z.string()),
  summary: z.string(),
  no_write_no_side_effect: z.literal(true),
  hard_stop_categories: z.array(z.string())
});

export const RepositorySummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.RepositorySummary),
  target: RepositoryTargetSchema,
  default_branch: z.string(),
  description: z.string().nullable(),
  archived: z.boolean(),
  disabled: z.boolean(),
  fork: z.boolean(),
  open_issues_count: z.number().int().nonnegative(),
  visibility: z.enum(["public", "private"]),
  html_url: z.string().url(),
  pushed_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const BranchSummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.BranchSummary),
  target: RepositoryTargetSchema,
  name: z.string(),
  commit_sha: z.string().min(1),
  protected: z.boolean(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const PullRequestSummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.PullRequestSummary),
  target: RepositoryTargetSchema,
  number: z.number().int().positive(),
  title: z.string(),
  state: z.enum(["open", "closed", "merged"]),
  draft: z.boolean(),
  head_ref: z.string(),
  base_ref: z.string(),
  user_login: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  checks_summary: z.string().optional(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const IssueSummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.IssueSummary),
  target: RepositoryTargetSchema,
  number: z.number().int().positive(),
  title: z.string(),
  state: z.enum(["open", "closed"]),
  user_login: z.string().nullable(),
  labels: z.array(z.string()),
  updated_at: z.string().datetime().nullable(),
  pull_request: z.boolean(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const WorkflowCheckSummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.WorkflowCheckSummary),
  target: RepositoryTargetSchema,
  ref: z.string(),
  run_id: z.number().int().nonnegative().optional(),
  name: z.string(),
  status: z.enum(["queued", "in_progress", "completed", "unknown"]),
  conclusion: z.enum(["success", "failure", "neutral", "cancelled", "skipped", "timed_out", "action_required", "unknown"]).nullable(),
  updated_at: z.string().datetime().nullable(),
  html_url: z.string().url().nullable(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const FileMetadataSummarySchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.FileMetadataSummary),
  target: RepositoryTargetSchema,
  path: z.string(),
  ref: z.string(),
  type: z.enum(["file", "dir", "symlink", "submodule", "unknown"]),
  size: z.number().int().nonnegative(),
  sha: z.string().min(1),
  html_url: z.string().url().nullable(),
  content_excerpt: z.string().optional(),
  encoding: z.string().optional(),
  live_capability_status: LiveCapabilityStatusSchema
});

export const ReadOnlyReceiptPreviewSchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.ReadOnlyReceiptPreview),
  receipt_event_id: z.string(),
  tool_name: RepoStatusToolNameSchema,
  target_repo: z.string(),
  target_ref: z.string().optional(),
  target_pr: z.number().int().positive().optional(),
  target_issue: z.number().int().positive().optional(),
  target_check: z.string().optional(),
  target_file: z.string().optional(),
  timestamp: z.string().datetime(),
  guard_decision_ref: z.string().optional(),
  read_policy_result_ref: z.string(),
  public_safe_input_summary: z.string(),
  public_safe_output_summary: z.string(),
  no_write_no_side_effect_statement: z.string(),
  live_capability_status: LiveCapabilityStatusSchema,
  receipt_replay_event: z.unknown().optional(),
  public_safe: z.literal(true)
});

export const RepoStatusPacketSchema = z.object({
  schema_version: z.literal(RepoStatusSchemaVersion.RepoStatusPacket),
  target: RepositoryTargetSchema,
  repository: RepositorySummarySchema,
  default_branch: BranchSummarySchema.optional(),
  pull_requests: z.array(PullRequestSummarySchema),
  issues: z.array(IssueSummarySchema),
  workflow_checks: z.array(WorkflowCheckSummarySchema),
  files: z.array(FileMetadataSummarySchema),
  generated_at: z.string().datetime(),
  live_capability_status: LiveCapabilityStatusSchema,
  summary: z.string(),
  receipts: z.array(ReadOnlyReceiptPreviewSchema),
  no_write_no_side_effect_statement: z.string()
});

export type LiveCapabilityStatus = z.infer<typeof LiveCapabilityStatusSchema>;
export type RepoStatusToolName = z.infer<typeof RepoStatusToolNameSchema>;
export type ReadOnlyGitHubEffect = z.infer<typeof ReadOnlyGitHubEffectSchema>;
export type AllowedReadOnlyGitHubEffect = z.infer<typeof AllowedReadOnlyGitHubEffectSchema>;
export type RepositoryTarget = z.infer<typeof RepositoryTargetSchema>;
export type ReadOnlyGitHubClientConfig = z.infer<typeof ReadOnlyGitHubClientConfigSchema>;
export type ReadOnlyPolicyResult = z.infer<typeof ReadOnlyPolicyResultSchema>;
export type RepositorySummary = z.infer<typeof RepositorySummarySchema>;
export type BranchSummary = z.infer<typeof BranchSummarySchema>;
export type PullRequestSummary = z.infer<typeof PullRequestSummarySchema>;
export type IssueSummary = z.infer<typeof IssueSummarySchema>;
export type WorkflowCheckSummary = z.infer<typeof WorkflowCheckSummarySchema>;
export type FileMetadataSummary = z.infer<typeof FileMetadataSummarySchema>;
export type RepoStatusPacket = z.infer<typeof RepoStatusPacketSchema>;
export type ReadOnlyReceiptPreview = z.infer<typeof ReadOnlyReceiptPreviewSchema>;
