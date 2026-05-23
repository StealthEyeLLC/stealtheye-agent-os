import { createCapabilityTokenFixture, type CapabilityToken, type RegistryTrustInput } from "@stealtheye/guard";
import { createBrowserAction, createBrowserActionPlan } from "./action-plan";
import { createBrowserEvidenceRef } from "./evidence";
import { createFixtureOnlyBrowserSession } from "./session";
import { BrowserOpsSchemaVersion, PageObservationSchema, type BrowserAction, type BrowserActionPlan, type BrowserEvidenceRef, type BrowserSession, type PageObservation } from "./schemas";

export const browserOpsFixtureNow = "2026-01-01T00:00:00.000Z";
export const browserOpsFixtureDigest = "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

export const fixtureBrowserSession: BrowserSession = createFixtureOnlyBrowserSession({
  session_id: "browser-session:fixture:build-8",
  mission_id: "mission:fixture:browserops-build-8",
  task_id: "task:browserops:observe-example",
  worker_id: "worker:browserops-fixture",
  browser_context_id: "browser-context:fixture-only:build-8",
  allowed_domains: ["example.test", "*.example.test"],
  denied_domains: ["deny.example.test"],
  allowed_actions: ["observation", "navigation", "extraction", "artifact_capture", "form_input", "external_send", "money", "auth", "destructive", "production_mutation"],
  denied_actions: [],
  created_at: browserOpsFixtureNow,
  expires_at: "2026-01-01T01:00:00.000Z"
});

export const credentialedFixtureBrowserSession: BrowserSession = {
  ...fixtureBrowserSession,
  session_id: "browser-session:fixture:credentialed-blocked",
  credential_mode: "user_supplied_future",
  storage_state_ref: "artifact://fixture/browserops/storage-state-placeholder.json"
};

export const fixtureScreenshotEvidence: BrowserEvidenceRef = createBrowserEvidenceRef({
  evidence_id: "browser-evidence:fixture:screenshot",
  session_id: fixtureBrowserSession.session_id,
  task_id: fixtureBrowserSession.task_id,
  kind: "screenshot",
  uri: "artifact://fixture/browserops/screenshot-metadata.json",
  digest: browserOpsFixtureDigest,
  summary: "Fixture-only screenshot evidence reference; no real image bytes are included.",
  sensitivity: "public",
  created_at: browserOpsFixtureNow
});

export const fixtureDomEvidence: BrowserEvidenceRef = createBrowserEvidenceRef({
  evidence_id: "browser-evidence:fixture:dom-snapshot",
  session_id: fixtureBrowserSession.session_id,
  task_id: fixtureBrowserSession.task_id,
  kind: "dom_snapshot",
  uri: "artifact://fixture/browserops/dom-snapshot-metadata.json",
  digest: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  summary: "Fixture-only DOM snapshot reference; no real DOM content is included.",
  sensitivity: "public",
  created_at: browserOpsFixtureNow
});

export const fixturePageObservation: PageObservation = PageObservationSchema.parse({
  schema_version: BrowserOpsSchemaVersion.PageObservation,
  page_state_id: "page-state:fixture:example-home",
  session_id: fixtureBrowserSession.session_id,
  url: "https://example.test/browserops-fixture",
  domain: "example.test",
  title: "Example Fixture Page",
  dom_snapshot_ref: fixtureDomEvidence.evidence_id,
  screenshot_ref: fixtureScreenshotEvidence.evidence_id,
  accessibility_tree_ref: "browser-evidence:fixture:accessibility-tree",
  console_log_refs: ["browser-evidence:fixture:console-log"],
  network_log_refs: ["browser-evidence:fixture:network-log"],
  storage_refs: [],
  detected_forms: [{ form_id: "form:fixture:contact-preview", purpose: "non-sensitive contact preview fixture", field_names: ["name", "message"], sensitivity: "public", external_send_risk: true }],
  detected_external_send_controls: [{ control_id: "control:fixture:send-message", label: "Send message", selector_ref: "selector-ref:send-message", reason: "Would send material to an external recipient in a live browser flow.", sensitivity: "public" }],
  detected_payment_controls: [{ control_id: "control:fixture:pay-now", label: "Pay now", selector_ref: "selector-ref:pay-now", reason: "Payment control detected in fixture metadata.", sensitivity: "public" }],
  detected_auth_controls: [{ control_id: "control:fixture:sign-in", label: "Sign in", selector_ref: "selector-ref:sign-in", reason: "Auth submit control detected in fixture metadata.", sensitivity: "public" }],
  detected_destructive_controls: [{ control_id: "control:fixture:delete-item", label: "Delete item", selector_ref: "selector-ref:delete-item", reason: "Destructive confirmation control detected in fixture metadata.", sensitivity: "public" }],
  detected_production_controls: [{ control_id: "control:fixture:publish-production", label: "Publish production", selector_ref: "selector-ref:publish-production", reason: "Production mutation control detected in fixture metadata.", sensitivity: "public" }],
  observed_at: browserOpsFixtureNow,
  sensitivity: "public",
  evidence_refs: [fixtureScreenshotEvidence.evidence_id, fixtureDomEvidence.evidence_id]
});

export const safeObserveAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:observe", kind: "observe_page", domain: "example.test", url: "https://example.test/browserops-fixture", expected_evidence_refs: [fixtureScreenshotEvidence.evidence_id] });
export const safeScreenshotAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:screenshot", kind: "screenshot", domain: "example.test", url: "https://example.test/browserops-fixture", expected_evidence_refs: [fixtureScreenshotEvidence.evidence_id] });
export const fillFormPreviewAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:fill-form-preview", kind: "fill_form", domain: "example.test", target_ref: "form:fixture:contact-preview", value_ref: "artifact://fixture/browserops/form-values-redacted.json", preview_only: true });
export const deniedDomainAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:denied-domain", kind: "observe_page", domain: "deny.example.test", url: "https://example.test/denied-domain-placeholder" });
export const externalSendAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:external-send", kind: "external_send", domain: "example.test", target_ref: "control:fixture:send-message" });
export const moneyAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:purchase-or-payment", kind: "purchase_or_payment", domain: "example.test", target_ref: "control:fixture:pay-now" });
export const authSubmitAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:auth-submit", kind: "auth_submit", domain: "example.test", target_ref: "control:fixture:sign-in" });
export const destructiveConfirmAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:destructive-confirm", kind: "destructive_confirm", domain: "example.test", target_ref: "control:fixture:delete-item" });
export const productionMutationAction: BrowserAction = createBrowserAction({ action_id: "browser-action:fixture:production-mutation", kind: "production_mutation", domain: "example.test", target_ref: "control:fixture:publish-production" });

export const safeObservationPlan: BrowserActionPlan = createBrowserActionPlan({
  action_plan_id: "browser-action-plan:fixture:safe-observation",
  mission_id: fixtureBrowserSession.mission_id,
  task_id: fixtureBrowserSession.task_id,
  session_id: fixtureBrowserSession.session_id,
  page_state_ref: fixturePageObservation.page_state_id,
  actions: [safeObserveAction, safeScreenshotAction],
  expected_effects: ["browser_observe", "browser_artifact_capture"],
  risk_tier: "low",
  evidence_requirements: [fixtureScreenshotEvidence.evidence_id],
  receipt_requirements: ["receipt:browserops:preflight"],
  created_at: browserOpsFixtureNow
});

export const deniedDomainPlan: BrowserActionPlan = createBrowserActionPlan({
  action_plan_id: "browser-action-plan:fixture:denied-domain",
  mission_id: fixtureBrowserSession.mission_id,
  task_id: fixtureBrowserSession.task_id,
  session_id: fixtureBrowserSession.session_id,
  page_state_ref: fixturePageObservation.page_state_id,
  actions: [deniedDomainAction],
  risk_tier: "blocked",
  created_at: browserOpsFixtureNow
});

export const browserOpsCapabilityToken: CapabilityToken = createCapabilityTokenFixture({
  token_id: "cap-token:fixture:browserops-observe",
  mission_id: fixtureBrowserSession.mission_id,
  issued_to: "agent:browserops-fixture",
  allowed_effects: ["browser_observe", "write_receipt", "generate_final_report"],
  denied_effects: [],
  forbidden_effects: ["raw_secret_access", "money_movement", "production_deploy", "production_data_mutation", "destructive_delete"],
  target_constraints: { repositories: [], branches: [], branch_prefixes: [], paths: [], systems: ["browserops_fixture"], environments: ["fixture"], domains: ["example.test"], accounts: [] },
  tool_manifest_constraints: { allowed_agent_ids: ["agent:browserops-fixture"], allowed_manifest_ids: ["tool-manifest:browserops-fixture"], pinned_digests: [], required_trust_status: "trusted_and_approved" },
  evidence_requirements: ["browser_evidence_refs", "fixture_observation_summary"],
  receipt_requirements: ["browser_preflight", "guard_decision", "registry_summary"],
  escalation_requirements: ["hard_stop", "untrusted_registry", "credentialed_browsing"],
  issued_at: browserOpsFixtureNow,
  valid_until: "2027-01-01T00:00:00.000Z"
});

export const trustedBrowserOpsRegistrySummary: RegistryTrustInput = { trusted: true, valid: true, trust_status: "trusted", review_status: "approved", revoked: false };
export const untrustedBrowserOpsRegistrySummary: RegistryTrustInput = { trusted: false, valid: false, trust_status: "untrusted", review_status: "rejected", errors: ["fixture registry summary is intentionally untrusted"], revoked: false };

export const browserOpsFixtureCorpus = {
  sessions: [fixtureBrowserSession, credentialedFixtureBrowserSession],
  evidence_refs: [fixtureScreenshotEvidence, fixtureDomEvidence],
  page_observations: [fixturePageObservation],
  actions: [safeObserveAction, safeScreenshotAction, fillFormPreviewAction, deniedDomainAction, externalSendAction, moneyAction, authSubmitAction, destructiveConfirmAction, productionMutationAction],
  plans: [safeObservationPlan, deniedDomainPlan]
} as const;
