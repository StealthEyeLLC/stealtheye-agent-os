import { BrowserPolicyDecisionSchema, type BrowserAction, type BrowserActionCategory, type BrowserActionKind, type BrowserPolicyDecision, type BrowserSession } from "./schemas";

export type HardStopPolicyMode = "deny" | "escalate";

export interface BrowserActionPolicyOptions {
  hard_stop_mode?: HardStopPolicyMode | undefined;
}

export const BrowserActionKindToCategory: Record<BrowserActionKind, BrowserActionCategory> = {
  observe_page: "observation",
  navigate: "navigation",
  wait_for_selector: "observation",
  screenshot: "artifact_capture",
  extract_text: "extraction",
  click: "navigation",
  fill_form: "form_input",
  select_option: "form_input",
  download_file_metadata: "artifact_capture",
  upload_file_future: "external_send",
  external_send: "external_send",
  purchase_or_payment: "money",
  auth_submit: "auth",
  destructive_confirm: "destructive",
  production_mutation: "production_mutation"
};

export function categoryForBrowserAction(kind: BrowserActionKind): BrowserActionCategory {
  return BrowserActionKindToCategory[kind];
}

function normalizeDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return trimmed.replace(/^https?:\/\//, "").split("/")[0] ?? trimmed;
    }
  }
  return trimmed.split("/")[0] ?? trimmed;
}

function domainMatchesPattern(domain: string, pattern: string): boolean {
  const normalizedDomain = normalizeDomain(domain);
  const normalizedPattern = normalizeDomain(pattern);
  if (normalizedPattern === "*") return true;
  if (normalizedPattern.startsWith("*.")) {
    const suffix = normalizedPattern.slice(2);
    return normalizedDomain === suffix || normalizedDomain.endsWith(`.${suffix}`);
  }
  return normalizedDomain === normalizedPattern;
}

export function matchesAllowedDomain(domain: string, allowedDomains: string[]): boolean {
  if (allowedDomains.length === 0) return false;
  return allowedDomains.some((pattern) => domainMatchesPattern(domain, pattern));
}

export function matchesDeniedDomain(domain: string, deniedDomains: string[]): boolean {
  return deniedDomains.some((pattern) => domainMatchesPattern(domain, pattern));
}

export function matchesAllowedAction(action: BrowserAction, allowedActions: Array<BrowserActionKind | BrowserActionCategory>): boolean {
  if (allowedActions.length === 0) return true;
  return allowedActions.includes(action.kind) || allowedActions.includes(action.category);
}

export function matchesDeniedAction(action: BrowserAction, deniedActions: Array<BrowserActionKind | BrowserActionCategory>): boolean {
  return deniedActions.includes(action.kind) || deniedActions.includes(action.category);
}

function decision(action: BrowserAction, result: BrowserPolicyDecision["decision"], reason_codes: string[], summary: string): BrowserPolicyDecision {
  return BrowserPolicyDecisionSchema.parse({
    action_id: action.action_id,
    decision: result,
    reason_codes,
    summary
  });
}

export function evaluateBrowserActionPolicy(session: BrowserSession, action: BrowserAction, options: BrowserActionPolicyOptions = {}): BrowserPolicyDecision {
  const hardStopMode = options.hard_stop_mode ?? "deny";
  const actionCategory = categoryForBrowserAction(action.kind);
  const domainAllowed = matchesAllowedDomain(action.domain, session.allowed_domains);
  const domainDenied = matchesDeniedDomain(action.domain, session.denied_domains);

  if (session.credential_mode !== "none") {
    return decision(action, "deny", ["credentialed_browsing_blocked_in_build_8"], "Credentialed browsing is blocked in BrowserOps Build 8.");
  }

  if (domainDenied) {
    return decision(action, "deny", ["browser_denied_domain_match"], "The action targets a denied browser domain.");
  }

  if (!domainAllowed) {
    return decision(action, "deny", ["browser_domain_not_allowed"], "BrowserOps actions require an explicitly allowed domain.");
  }

  if (matchesDeniedAction(action, session.denied_actions)) {
    return decision(action, "deny", ["browser_denied_action_match"], "The action kind or category is explicitly denied for this session.");
  }

  if (!matchesAllowedAction(action, session.allowed_actions)) {
    return decision(action, "deny", ["browser_action_not_allowed"], "The action kind or category is outside this session's allowed action set.");
  }

  if (action.category !== actionCategory) {
    return decision(action, "deny", ["browser_action_category_mismatch"], "The action category does not match the canonical category for the action kind.");
  }

  if (actionCategory === "external_send") {
    return decision(action, "escalate", ["browser_external_send_escalation_required"], "External sends require escalation and are not executed by BrowserOps Build 8.");
  }

  if (actionCategory === "money") {
    return decision(action, "escalate", ["browser_money_escalation_required"], "Purchases, payments, refunds, and money movement require escalation.");
  }

  if (actionCategory === "auth") {
    return decision(action, "escalate", ["browser_auth_submit_escalation_required"], "Auth submits and credentialed browser flows require escalation.");
  }

  if (actionCategory === "destructive") {
    return decision(action, hardStopMode, [`browser_destructive_confirm_${hardStopMode}`], "Destructive browser confirmations are hard-stop actions.");
  }

  if (actionCategory === "production_mutation") {
    return decision(action, hardStopMode, [`browser_production_mutation_${hardStopMode}`], "Production mutation through browser workflows is a hard-stop action.");
  }

  if (actionCategory === "form_input" && !action.preview_only) {
    return decision(action, "deny", ["browser_form_input_must_be_preview_only"], "Form-fill actions are allowed only as fixture/preview plans in Build 8.");
  }

  if (["observation", "navigation", "extraction", "artifact_capture", "form_input"].includes(actionCategory)) {
    return decision(action, "allow", ["browser_allowed_domain_action"], "The browser action is allowed as a fixture-only plan on an allowed domain.");
  }

  return decision(action, "deny", ["browser_action_policy_unknown"], "BrowserOps could not classify this action for Build 8.");
}

export function evaluateBrowserActionPlanPolicy(session: BrowserSession, actions: BrowserAction[], options: BrowserActionPolicyOptions = {}): BrowserPolicyDecision[] {
  return actions.map((action) => evaluateBrowserActionPolicy(session, action, options));
}
