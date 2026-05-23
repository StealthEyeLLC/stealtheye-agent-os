import { allPatchPlanFileChanges, computePatchPlanFingerprint } from "./file-changes";
import { CodeOpsSchemaVersion, PrEvidencePacketSchema, type CiLogSummary, type PatchPlan, type PrEvidencePacket } from "./schemas";

export interface CreatePrEvidencePacketInput {
  evidence_packet_id: string;
  patch_plan: PatchPlan;
  checks?: CiLogSummary[] | undefined;
  pr_number?: number | undefined;
  pr_url?: string | undefined;
  commit_sha?: string | undefined;
  created_at: string;
}

export function createPrEvidencePacket(input: CreatePrEvidencePacketInput): PrEvidencePacket {
  return PrEvidencePacketSchema.parse({
    schema_version: CodeOpsSchemaVersion.PrEvidencePacket,
    evidence_packet_id: input.evidence_packet_id,
    repo_full_name: input.patch_plan.repo_target.repo_full_name,
    base_branch: input.patch_plan.repo_target.base_branch,
    working_branch: input.patch_plan.repo_target.working_branch,
    ...(input.pr_number ? { pr_number: input.pr_number } : {}),
    ...(input.pr_url ? { pr_url: input.pr_url } : {}),
    ...(input.commit_sha ? { commit_sha: input.commit_sha } : {}),
    changed_files: allPatchPlanFileChanges(input.patch_plan),
    patch_plan_fingerprint: computePatchPlanFingerprint(input.patch_plan),
    checks: input.checks ?? [],
    verification_plan: input.patch_plan.verification_plan,
    receipt_refs: input.patch_plan.receipt_refs,
    evidence_refs: input.patch_plan.evidence_refs,
    public_private_boundary_notes: input.patch_plan.repo_target.public_private_boundary_notes,
    created_at: input.created_at
  });
}

export function prEvidenceSummary(packet: PrEvidencePacket): string {
  const checkSummary = packet.checks.map((check) => `${check.check_name}:${check.conclusion}`).join(", ") || "no checks recorded";
  return `${packet.repo_full_name} ${packet.base_branch}<- ${packet.working_branch} files=${packet.changed_files.length} checks=${checkSummary}`;
}
