import { WorkerArtifactReferenceSchema, WorkerFleetSchemaVersion, type WorkerArtifactReference } from "./schemas";

export interface CreateArtifactReferenceInput {
  artifact_id: string;
  task_id: string;
  mission_id: string;
  kind: WorkerArtifactReference["kind"];
  uri: string;
  summary: string;
  created_at: string;
  sensitivity?: WorkerArtifactReference["sensitivity"] | undefined;
  retention_hint?: string | undefined;
  digest?: string | undefined;
}

export function createArtifactReference(input: CreateArtifactReferenceInput): WorkerArtifactReference {
  return WorkerArtifactReferenceSchema.parse({
    schema_version: WorkerFleetSchemaVersion.ArtifactReference,
    artifact_id: input.artifact_id,
    task_id: input.task_id,
    mission_id: input.mission_id,
    kind: input.kind,
    uri: input.uri,
    ...(input.digest ? { digest: input.digest } : {}),
    summary: input.summary,
    created_at: input.created_at,
    sensitivity: input.sensitivity ?? "public",
    retention_hint: input.retention_hint ?? "retain-for-mission-replay"
  });
}

export function publicSafeArtifact(input: Omit<CreateArtifactReferenceInput, "sensitivity" | "retention_hint">): WorkerArtifactReference {
  return createArtifactReference({ ...input, sensitivity: "public", retention_hint: "public-safe-fixture" });
}
