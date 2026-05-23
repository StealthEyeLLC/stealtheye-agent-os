import { MissionOsSchemaVersion, MissionReceiptRefsSchema, type ArtifactReference, type Mission, type MissionReceiptRefs, type ReceiptReference } from "./schemas";

export function createReceiptReference(input: Omit<ReceiptReference, "created_at"> & { created_at?: string }): ReceiptReference {
  return {
    ...input,
    created_at: input.created_at ?? new Date().toISOString()
  };
}

export function createMissionReceiptRefs(mission: Mission): MissionReceiptRefs {
  const guardDecisionRefs = mission.receipt_refs.filter((ref) => ref.kind === "guard_decision");
  const registryDecisionRefs = mission.receipt_refs.filter((ref) => ref.kind === "registry_decision");
  const pullRequestRefs = mission.receipt_refs.filter((ref) => ref.kind === "pull_request");
  const ciRunRefs = mission.receipt_refs.filter((ref) => ref.kind === "ci_run");
  const finalReportRef = mission.receipt_refs.find((ref) => ref.kind === "final_report");
  return MissionReceiptRefsSchema.parse({
    schema_version: MissionOsSchemaVersion.ReceiptRefs,
    mission_id: mission.mission_id,
    guard_decision_refs: guardDecisionRefs,
    registry_decision_refs: registryDecisionRefs,
    pull_request_refs: pullRequestRefs,
    ci_run_refs: ciRunRefs,
    artifact_refs: mission.artifact_refs,
    final_report_ref: finalReportRef
  });
}

export function addMissionReceiptRef(mission: Mission, ref: ReceiptReference): Mission {
  return { ...mission, receipt_refs: [...mission.receipt_refs, ref], updated_at: ref.created_at };
}

export function addMissionArtifactRef(mission: Mission, ref: ArtifactReference, updatedAt = new Date().toISOString()): Mission {
  return { ...mission, artifact_refs: [...mission.artifact_refs, ref], updated_at: updatedAt };
}
