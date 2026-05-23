import { BrowserEvidenceRefSchema, BrowserOpsSchemaVersion, PublicSafeBrowserUriSchema, type BrowserEvidenceKind, type BrowserEvidenceRef, type BrowserSensitivity } from "./schemas";

export function isPublicSafeBrowserUri(uri: string): boolean {
  return PublicSafeBrowserUriSchema.safeParse(uri).success;
}

export interface CreateBrowserEvidenceRefInput {
  evidence_id: string;
  session_id: string;
  task_id: string;
  kind: BrowserEvidenceKind;
  uri: string;
  digest?: string | undefined;
  summary: string;
  sensitivity?: BrowserSensitivity | undefined;
  created_at?: string | undefined;
  retention_hint?: string | undefined;
}

export function createBrowserEvidenceRef(input: CreateBrowserEvidenceRefInput): BrowserEvidenceRef {
  return BrowserEvidenceRefSchema.parse({
    schema_version: BrowserOpsSchemaVersion.BrowserEvidenceRef,
    evidence_id: input.evidence_id,
    session_id: input.session_id,
    task_id: input.task_id,
    kind: input.kind,
    uri: input.uri,
    ...(input.digest ? { digest: input.digest } : {}),
    summary: input.summary,
    sensitivity: input.sensitivity ?? "public",
    created_at: input.created_at ?? "2026-01-01T00:00:00.000Z",
    retention_hint: input.retention_hint ?? "retain with public-safe fixture receipt"
  });
}

export function validateBrowserEvidenceRefs(refs: BrowserEvidenceRef[]): BrowserEvidenceRef[] {
  return refs.map((ref) => BrowserEvidenceRefSchema.parse(ref));
}
