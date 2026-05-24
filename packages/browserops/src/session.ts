import { BrowserOpsSchemaVersion, BrowserSessionSchema, type BrowserActionCategory, type BrowserActionKind, type BrowserSession } from "./schemas";

export function validateBrowserSession(session: unknown): BrowserSession {
  return BrowserSessionSchema.parse(session);
}

export interface CreateBrowserSessionInput {
  session_id: string;
  mission_id: string;
  task_id: string;
  worker_id: string;
  browser_context_id?: string | undefined;
  allowed_domains: string[];
  denied_domains?: string[] | undefined;
  allowed_actions?: Array<BrowserActionKind | BrowserActionCategory> | undefined;
  denied_actions?: Array<BrowserActionKind | BrowserActionCategory> | undefined;
  created_at?: string | undefined;
  expires_at?: string | undefined;
}

export function createFixtureOnlyBrowserSession(input: CreateBrowserSessionInput): BrowserSession {
  return BrowserSessionSchema.parse({
    schema_version: BrowserOpsSchemaVersion.BrowserSession,
    session_id: input.session_id,
    mission_id: input.mission_id,
    task_id: input.task_id,
    worker_id: input.worker_id,
    browser_context_id: input.browser_context_id ?? `browser-context:${input.session_id}`,
    isolation_mode: "fixture_only",
    allowed_domains: input.allowed_domains,
    denied_domains: input.denied_domains ?? [],
    allowed_actions: input.allowed_actions ?? ["observation", "navigation", "extraction", "artifact_capture", "form_input"],
    denied_actions: input.denied_actions ?? ["external_send", "money", "auth", "destructive", "production_mutation"],
    credential_mode: "none",
    storage_state_ref: null,
    network_policy_ref: "network-policy:fixture-only-no-live-traffic",
    evidence_refs: [],
    receipt_refs: [],
    created_at: input.created_at ?? "2026-01-01T00:00:00.000Z",
    expires_at: input.expires_at ?? "2026-01-01T01:00:00.000Z",
    status: "planned"
  });
}

export function browserSessionBlocksCredentialedBrowsing(session: BrowserSession): boolean {
  return session.credential_mode !== "none";
}
