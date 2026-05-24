import { EvidenceRefSchema, ReceiptsReplaySchemaVersion, PublicSafeReceiptUriSchema, type EvidenceKind, type EvidenceRef, type Sensitivity, type SourceSubsystem } from "./schemas";

export function isPublicSafeReceiptUri(uri: string): boolean {
  return PublicSafeReceiptUriSchema.safeParse(uri).success;
}

export interface CreateEvidenceRefInput {
  evidence_id: string;
  kind: EvidenceKind;
  uri: string;
  digest?: string | undefined;
  summary: string;
  produced_by: SourceSubsystem;
  produced_at?: string | undefined;
  sensitivity?: Sensitivity | undefined;
  public_safe?: boolean | undefined;
  retention_hint?: string | undefined;
  related_event_ids?: string[] | undefined;
}

export function createEvidenceRef(input: CreateEvidenceRefInput): EvidenceRef {
  return EvidenceRefSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.EvidenceRef,
    evidence_id: input.evidence_id,
    kind: input.kind,
    uri: input.uri,
    ...(input.digest ? { digest: input.digest } : {}),
    summary: input.summary,
    produced_by: input.produced_by,
    produced_at: input.produced_at ?? "2026-01-01T00:00:00.000Z",
    sensitivity: input.sensitivity ?? "public",
    public_safe: input.public_safe ?? true,
    retention_hint: input.retention_hint ?? "public-safe fixture evidence reference",
    related_event_ids: input.related_event_ids ?? []
  });
}

export function createEvidenceRefFromGeneratedBuildStateFile(path: string, digest?: string): EvidenceRef {
  const normalized = path.replace(/^docs\/generated\//, "");
  return createEvidenceRef({
    evidence_id: `evidence:generated:${normalized.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
    kind: "generated_build_state_file",
    uri: `docs://generated/${normalized}`,
    ...(digest ? { digest } : {}),
    summary: `Generated build-state file reference for ${normalized}.`,
    produced_by: "build_automation",
    produced_at: "2026-01-01T00:00:00.000Z",
    retention_hint: "retain with source-controlled generated state"
  });
}

export function validateEvidenceRefs(refs: EvidenceRef[]): EvidenceRef[] {
  return refs.map((ref) => EvidenceRefSchema.parse(ref));
}
