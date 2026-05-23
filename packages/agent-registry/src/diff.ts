export type RiskRelevantChangeKind =
  | "capability_change"
  | "tool_change"
  | "side_effect_change"
  | "auth_scope_change"
  | "risk_tier_change"
  | "hard_stop_change"
  | "schema_change"
  | "publisher_key_change"
  | "expiry_revocation_change";

export interface ManifestDiffChange {
  kind: RiskRelevantChangeKind;
  path: string;
  before: unknown;
  after: unknown;
  requires_review: boolean;
}

export interface ManifestDiffResult {
  changes: ManifestDiffChange[];
  requires_review: boolean;
}

function asSet(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.map((item) => JSON.stringify(item)));
}

function recordArraySetChange(changes: ManifestDiffChange[], kind: RiskRelevantChangeKind, path: string, before: unknown, after: unknown): void {
  const beforeSet = asSet(before);
  const afterSet = asSet(after);
  const same = beforeSet.size === afterSet.size && [...beforeSet].every((item) => afterSet.has(item));
  if (!same) changes.push({ kind, path, before, after, requires_review: true });
}

function recordScalarChange(changes: ManifestDiffChange[], kind: RiskRelevantChangeKind, path: string, before: unknown, after: unknown): void {
  if (JSON.stringify(before) !== JSON.stringify(after)) changes.push({ kind, path, before, after, requires_review: true });
}

export function diffSignedPayloads(before: Record<string, unknown>, after: Record<string, unknown>): ManifestDiffResult {
  const changes: ManifestDiffChange[] = [];
  recordArraySetChange(changes, "capability_change", "capabilities", before.capabilities, after.capabilities);
  recordArraySetChange(changes, "tool_change", "tools", before.tools, after.tools);
  recordScalarChange(changes, "side_effect_change", "side_effects", before.side_effects, after.side_effects);
  recordScalarChange(changes, "auth_scope_change", "auth_requirements", before.auth_requirements, after.auth_requirements);
  recordArraySetChange(changes, "auth_scope_change", "scopes", before.scopes, after.scopes);
  recordScalarChange(changes, "risk_tier_change", "risk_tier", before.risk_tier, after.risk_tier);
  recordArraySetChange(changes, "hard_stop_change", "hard_stops", before.hard_stops, after.hard_stops);
  recordArraySetChange(changes, "hard_stop_change", "hard_stop_categories", before.hard_stop_categories, after.hard_stop_categories);
  recordScalarChange(changes, "schema_change", "schema_version", before.schema_version, after.schema_version);
  recordScalarChange(changes, "publisher_key_change", "publisher", before.publisher, after.publisher);
  recordScalarChange(changes, "publisher_key_change", "public_keys", before.public_keys, after.public_keys);
  recordScalarChange(changes, "expiry_revocation_change", "valid_until", before.valid_until, after.valid_until);
  recordScalarChange(changes, "expiry_revocation_change", "revocation_refs", before.revocation_refs, after.revocation_refs);
  return { changes, requires_review: changes.some((change) => change.requires_review) };
}
