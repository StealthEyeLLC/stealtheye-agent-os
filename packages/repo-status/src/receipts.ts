import { createReceiptEvent } from "@stealtheye/receipts-replay";
import { REPO_STATUS_ACTOR_ID, REPO_STATUS_MISSION_ID, REPO_STATUS_NOW } from "./guard-adapter";
import {
  ReadOnlyReceiptPreviewSchema,
  RepoStatusSchemaVersion,
  type ReadOnlyPolicyResult,
  type ReadOnlyReceiptPreview,
  type RepoStatusToolName,
  type RepositoryTarget
} from "./schemas";
import type { GuardDecision } from "@stealtheye/guard";

export interface CreateRepoStatusReceiptInput {
  toolName: RepoStatusToolName;
  target: RepositoryTarget;
  policy: ReadOnlyPolicyResult;
  guardDecision?: GuardDecision | undefined;
  outputSummary: string;
  ref?: string | undefined;
  pr?: number | undefined;
  issue?: number | undefined;
  check?: string | undefined;
  file?: string | undefined;
  timestamp?: string | undefined;
}

function safeFragment(value: string): string {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export function createRepoStatusReceiptPreview(input: CreateRepoStatusReceiptInput): ReadOnlyReceiptPreview {
  const receiptEventId = `receipt-event:repo-status:${safeFragment(input.toolName)}:${safeFragment(input.target.full_name)}:${safeFragment(input.ref ?? String(input.pr ?? input.issue ?? input.file ?? "summary"))}`;
  const receipt_replay_event = createReceiptEvent({
    event_id: receiptEventId,
    mission_id: REPO_STATUS_MISSION_ID,
    source_subsystem: "app_host",
    event_type: "app_host_tool_previewed",
    actor_id: REPO_STATUS_ACTOR_ID,
    subject_id: input.target.full_name,
    action_id: input.toolName,
    timestamp: input.timestamp ?? REPO_STATUS_NOW,
    status_before: "requested",
    status_after: input.policy.allowed && input.guardDecision?.decision !== "deny" ? "read_observed" : "denied",
    summary: `Repo/status read-only tool ${input.toolName} observed public-safe metadata for ${input.target.full_name}; no writes or side effects were performed.`,
    reason_codes: [
      ...input.policy.reason_codes,
      ...(input.guardDecision?.reason_codes ?? []),
      "no_write_no_side_effect"
    ],
    receipt_refs: [receiptEventId],
    retention_hint: "return with in-memory repo/status tool result only"
  });
  return ReadOnlyReceiptPreviewSchema.parse({
    schema_version: RepoStatusSchemaVersion.ReadOnlyReceiptPreview,
    receipt_event_id: receiptEventId,
    tool_name: input.toolName,
    target_repo: input.target.full_name,
    ...(input.ref ? { target_ref: input.ref } : {}),
    ...(input.pr ? { target_pr: input.pr } : {}),
    ...(input.issue ? { target_issue: input.issue } : {}),
    ...(input.check ? { target_check: input.check } : {}),
    ...(input.file ? { target_file: input.file } : {}),
    timestamp: input.timestamp ?? REPO_STATUS_NOW,
    ...(input.guardDecision ? { guard_decision_ref: input.guardDecision.decision_id } : {}),
    read_policy_result_ref: `read-policy:${safeFragment(input.policy.effect)}:${safeFragment(input.target.full_name)}`,
    public_safe_input_summary: `Tool ${input.toolName} requested read-only public observation of ${input.target.full_name}.`,
    public_safe_output_summary: input.outputSummary,
    no_write_no_side_effect_statement: "No branch, file, PR, issue, workflow, deployment, money, browser, secret, private-repo, or production state was written or mutated.",
    live_capability_status: input.policy.live_capability_status,
    receipt_replay_event,
    public_safe: true
  });
}
