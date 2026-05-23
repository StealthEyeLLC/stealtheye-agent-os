import { describe, expect, it } from "vitest";
import * as BrowserOps from "../src/index";
import {
  authSubmitAction,
  browserOpsCapabilityToken,
  browserOpsFixtureCorpus,
  credentialedFixtureBrowserSession,
  deniedDomainAction,
  deniedDomainPlan,
  destructiveConfirmAction,
  externalSendAction,
  fixtureBrowserSession,
  fixtureDomEvidence,
  fixturePageObservation,
  fixtureScreenshotEvidence,
  fillFormPreviewAction,
  moneyAction,
  productionMutationAction,
  safeObservationPlan,
  safeObserveAction,
  safeScreenshotAction,
  trustedBrowserOpsRegistrySummary,
  untrustedBrowserOpsRegistrySummary
} from "../src/fixtures";

describe("BrowserOps foundation schemas and helpers", () => {
  it("validates a valid browser session", () => {
    expect(BrowserOps.BrowserSessionSchema.parse(fixtureBrowserSession).session_id).toBe(fixtureBrowserSession.session_id);
  });

  it("rejects an invalid browser session", () => {
    expect(() => BrowserOps.BrowserSessionSchema.parse({ ...fixtureBrowserSession, credential_mode: "live_password" })).toThrow();
  });

  it("accepts allowed domains", () => {
    expect(BrowserOps.matchesAllowedDomain("example.test", fixtureBrowserSession.allowed_domains)).toBe(true);
    expect(BrowserOps.matchesAllowedDomain("sub.example.test", fixtureBrowserSession.allowed_domains)).toBe(true);
  });

  it("rejects denied domains", () => {
    const decision = BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, deniedDomainAction);
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("browser_denied_domain_match");
  });

  it("allows observation actions on allowed domains", () => {
    const decision = BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, safeObserveAction);
    expect(decision.decision).toBe("allow");
    expect(decision.reason_codes).toContain("browser_allowed_domain_action");
  });

  it("validates screenshot and DOM evidence refs", () => {
    expect(BrowserOps.BrowserEvidenceRefSchema.parse(fixtureScreenshotEvidence).kind).toBe("screenshot");
    expect(BrowserOps.BrowserEvidenceRefSchema.parse(fixtureDomEvidence).kind).toBe("dom_snapshot");
    expect(BrowserOps.isPublicSafeBrowserUri(fixtureScreenshotEvidence.uri)).toBe(true);
  });

  it("summarizes risky page controls", () => {
    const summary = BrowserOps.summarizePageRiskControls(fixturePageObservation);
    expect(summary.risky_control_count).toBe(5);
    expect(summary.reason_codes).toContain("page_detected_payment_controls");
    expect(BrowserOps.pageObservationHasRiskyControls(fixturePageObservation)).toBe(true);
  });

  it("allows form-fill preview only on allowed domains", () => {
    const allowedPreview = BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, fillFormPreviewAction);
    const liveFill = BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, { ...fillFormPreviewAction, action_id: "browser-action:fixture:live-fill", preview_only: false });
    expect(allowedPreview.decision).toBe("allow");
    expect(liveFill.decision).toBe("deny");
    expect(liveFill.reason_codes).toContain("browser_form_input_must_be_preview_only");
  });

  it("escalates external sends, money, and auth submits", () => {
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, externalSendAction).decision).toBe("escalate");
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, moneyAction).decision).toBe("escalate");
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, authSubmitAction).decision).toBe("escalate");
  });

  it("denies or escalates destructive and production mutation actions", () => {
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, destructiveConfirmAction).decision).toBe("deny");
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, destructiveConfirmAction, { hard_stop_mode: "escalate" }).decision).toBe("escalate");
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, productionMutationAction).decision).toBe("deny");
    expect(BrowserOps.evaluateBrowserActionPolicy(fixtureBrowserSession, productionMutationAction, { hard_stop_mode: "escalate" }).decision).toBe("escalate");
  });

  it("blocks credentialed browsing in Build 8", () => {
    const decision = BrowserOps.evaluateBrowserActionPolicy(credentialedFixtureBrowserSession, safeObserveAction);
    expect(decision.decision).toBe("deny");
    expect(decision.reason_codes).toContain("credentialed_browsing_blocked_in_build_8");
  });

  it("converts browser action plans into Guard requested actions", () => {
    const actions = BrowserOps.browserActionPlanToGuardRequestedActions(safeObservationPlan);
    expect(actions).toHaveLength(2);
    expect(actions.every((action) => action.effect === "browser_observe")).toBe(true);
    expect(actions[0]?.target.domain).toBe("example.test");
  });

  it("converts browser action plans into Worker Fleet task templates", () => {
    const tasks = BrowserOps.workerTasksForBrowserActionPlan(safeObservationPlan);
    expect(tasks).toHaveLength(2);
    expect(tasks.every((task) => task.task_type === "future_browserops")).toBe(true);
    expect(tasks.every((task) => task.status === "queued")).toBe(true);
  });

  it("Guard preflight allows a safe observation plan", () => {
    const summary = BrowserOps.runBrowserOpsPreflight({ session: fixtureBrowserSession, action_plan: safeObservationPlan, capability_tokens: [browserOpsCapabilityToken], registry_trust_summary: trustedBrowserOpsRegistrySummary });
    expect(summary.allowed).toBe(true);
    expect(summary.blocked).toBe(false);
    expect(summary.escalated).toBe(false);
  });

  it("Guard preflight blocks denied domains", () => {
    const summary = BrowserOps.runBrowserOpsPreflight({ session: fixtureBrowserSession, action_plan: deniedDomainPlan, capability_tokens: [browserOpsCapabilityToken], registry_trust_summary: trustedBrowserOpsRegistrySummary });
    expect(summary.allowed).toBe(false);
    expect(summary.blocked).toBe(true);
    expect(summary.reason_codes).toContain("browser_denied_domain_match");
  });

  it("Guard preflight blocks untrusted registry summaries", () => {
    const summary = BrowserOps.runBrowserOpsPreflight({ session: fixtureBrowserSession, action_plan: safeObservationPlan, capability_tokens: [browserOpsCapabilityToken], registry_trust_summary: untrustedBrowserOpsRegistrySummary });
    expect(summary.allowed).toBe(false);
    expect(summary.blocked).toBe(true);
    expect(summary.reason_codes).toContain("browser_registry_summary_untrusted");
  });

  it("exposes no live browser capability", () => {
    const prohibitedExportNames = new Set(["playwright", "puppeteer", "launchbrowser", "executebrowser", "runbrowser", "launchplaywright", "runplaywright"]);
    for (const exportedName of Object.keys(BrowserOps)) expect(prohibitedExportNames.has(exportedName.toLowerCase())).toBe(false);
    expect(BrowserOps.browserActionPlanToGuardRequestedActions(safeObservationPlan).every((action) => action.metadata["no_live_browser_execution"] === true)).toBe(true);
  });

  it("contains no real secrets or real endpoints in fixtures", () => {
    const fixtureText = JSON.stringify(browserOpsFixtureCorpus);
    const secretPattern = new RegExp(["AKIA[0-9A-Z]{16}", "BEGIN " + "(RSA|OPENSSH|EC|DSA) " + "PRIVATE " + "KEY", "pass" + "word=", "client_" + "secret=", "PRIVATE_" + "KEY="].join("|"));
    expect(fixtureText).not.toMatch(secretPattern);
    expect(fixtureText).not.toMatch(/https?:\/\/(?!example\.test)/);
    expect(fixtureText).not.toMatch(/redis:\/\/|postgres:\/\/|s3:\/\/|r2:\/\//);
  });

  it("validates BrowserOps JSON Schema exports", () => {
    expect(BrowserOps.BrowserOpsJsonSchemas.browserSession).toBeDefined();
    expect(BrowserOps.BrowserOpsJsonSchemas.browserActionPlan).toBeDefined();
    expect(BrowserOps.BrowserOpsJsonSchemas.browserPreflightSummary).toBeDefined();
    expect(BrowserOps.BrowserActionPlanSchema.parse(safeObservationPlan).status).toBe("ready_for_preflight");
    expect(BrowserOps.BrowserActionSchema.parse(safeScreenshotAction).kind).toBe("screenshot");
  });
});
