import { evaluateGuardDecision, GuardSchemaVersion, type CapabilityToken, type Effect, type GuardDecision, type RegistryTrustInput, type RequestedAction } from "@stealtheye/guard";
import { createWorkerTask, runGuardPreflight, type WorkerTask } from "@stealtheye/worker-fleet";
import { evaluateBrowserActionPlanPolicy, type BrowserActionPolicyOptions } from "./action-policy";
import { BrowserOpsSchemaVersion, BrowserPreflightSummarySchema, type BrowserAction, type BrowserActionPlan, type BrowserPreflightSummary, type BrowserSession } from "./schemas";

export interface BrowserOpsActionOptions {
  actor_id?: string | undefined;
  agent_id?: string | undefined;
  manifest_id?: string | undefined;
  requested_at?: string | undefined;
}

interface NormalizedBrowserOpsActionOptions {
  actor_id: string;
  agent_id: string;
  manifest_id: string;
  requested_at: string;
}

function normalizeOptions(options: BrowserOpsActionOptions = {}): NormalizedBrowserOpsActionOptions {
  return {
    actor_id: options.actor_id ?? "agent:browserops-fixture",
    agent_id: options.agent_id ?? "agent:browserops-fixture",
    manifest_id: options.manifest_id ?? "tool-manifest:browserops-fixture",
    requested_at: options.requested_at ?? "2026-01-01T00:00:00.000Z"
  };
}

export function browserActionToGuardEffect(action: BrowserAction): Effect {
  if (["observation", "navigation", "form_input", "extraction", "artifact_capture"].includes(action.category)) return "browser_observe";
  if (action.category === "external_send") return "external_send";
  if (action.category === "money") return "money_movement";
  if (action.category === "auth") return "auth_security_change";
  if (action.category === "destructive") return "destructive_delete";
  return "production_data_mutation";
}

function requestedActionForBrowserAction(plan: BrowserActionPlan, action: BrowserAction, options: NormalizedBrowserOpsActionOptions): RequestedAction {
  const effect = browserActionToGuardEffect(action);
  return {
    schema_version: GuardSchemaVersion.RequestedAction,
    action_id: `browserops-action:${plan.action_plan_id}:${action.action_id}`,
    mission_id: plan.mission_id,
    actor_id: options.actor_id,
    subject_type: "agent",
    effect,
    target: {
      domain: action.domain,
      resource_id: plan.page_state_ref,
      system: "browserops_fixture",
      environment: action.category === "production_mutation" ? "production" : "fixture"
    },
    agent_id: options.agent_id,
    manifest_id: options.manifest_id,
    risk_indicators: [
      `browser_action:${action.kind}`,
      `browser_category:${action.category}`,
      ...(action.category === "money" ? ["purchase_or_payment"] : []),
      ...(action.category === "auth" ? ["auth_submit"] : []),
      ...(action.category === "external_send" ? ["external_send"] : []),
      ...(action.category === "production_mutation" ? ["production_mutation"] : [])
    ],
    side_effects: effect === "browser_observe" ? [] : ["future_browser_action_modeled_only"],
    requested_at: options.requested_at,
    idempotency_key: `idem:${plan.action_plan_id}:${action.action_id}`,
    metadata: {
      action_plan_id: plan.action_plan_id,
      browser_action_kind: action.kind,
      browser_action_category: action.category,
      fixture_only: true,
      no_live_browser_execution: true
    },
    evidence_refs: action.expected_evidence_refs
  };
}

export function browserActionPlanToGuardRequestedActions(plan: BrowserActionPlan, options: BrowserOpsActionOptions = {}): RequestedAction[] {
  const normalized = normalizeOptions(options);
  return plan.actions.map((action) => requestedActionForBrowserAction(plan, action, normalized));
}

export function workerTasksForBrowserActionPlan(plan: BrowserActionPlan, options: BrowserOpsActionOptions = {}): WorkerTask[] {
  const normalized = normalizeOptions(options);
  return browserActionPlanToGuardRequestedActions(plan, normalized).map((action, index) => createWorkerTask({
    mission_id: plan.mission_id,
    plan_id: plan.action_plan_id,
    step_id: `browserops-step-${String(index + 1).padStart(2, "0")}`,
    title: `BrowserOps ${action.metadata["browser_action_kind"] as string}`,
    description: `Foundation-only Worker Fleet task template for ${action.metadata["browser_action_kind"] as string}. It never executes live browser automation.`,
    task_type: "future_browserops",
    priority: plan.risk_tier === "high" || plan.risk_tier === "blocked" ? "high" : "normal",
    requested_action: action,
    capability_token_refs: [],
    receipt_refs: plan.receipt_requirements,
    now: normalized.requested_at
  }));
}

export interface RunBrowserOpsPreflightInput {
  session: BrowserSession;
  action_plan: BrowserActionPlan;
  capability_tokens: CapabilityToken[];
  registry_trust_summary?: RegistryTrustInput | undefined;
  worker_id?: string | undefined;
  options?: BrowserOpsActionOptions | undefined;
  policy_options?: BrowserActionPolicyOptions | undefined;
}

export function guardDecisionsForBrowserActionPlan(input: RunBrowserOpsPreflightInput): GuardDecision[] {
  const normalized = normalizeOptions(input.options);
  return browserActionPlanToGuardRequestedActions(input.action_plan, normalized).map((action) => evaluateGuardDecision(action, input.capability_tokens, {
    now: new Date(normalized.requested_at),
    ...(input.registry_trust_summary ? { registryTrust: input.registry_trust_summary } : {}),
    decisionId: `guard-decision:${action.action_id}`
  }));
}

function registryBlocksActionPlan(registry: RegistryTrustInput | undefined, plan: BrowserActionPlan): boolean {
  if (!registry || plan.actions.length === 0) return false;
  return registry.trusted === false || registry.valid === false || registry.revoked === true;
}

export function runBrowserOpsPreflight(input: RunBrowserOpsPreflightInput): BrowserPreflightSummary {
  const normalized = normalizeOptions(input.options);
  const browserPolicyDecisions = evaluateBrowserActionPlanPolicy(input.session, input.action_plan.actions, input.policy_options);
  const browserPolicyBlocks = browserPolicyDecisions.some((item) => item.decision === "deny");
  const browserPolicyEscalates = browserPolicyDecisions.some((item) => item.decision === "escalate");
  const registryBlocked = registryBlocksActionPlan(input.registry_trust_summary, input.action_plan);
  const tasks = workerTasksForBrowserActionPlan(input.action_plan, normalized);
  const workerPreflightResults = tasks.map((task) => runGuardPreflight({
    task,
    capability_tokens: input.capability_tokens,
    ...(input.registry_trust_summary ? { registry_trust_summary: input.registry_trust_summary } : {}),
    worker_id: input.worker_id ?? "worker:browserops-preflight-fixture",
    now: new Date(normalized.requested_at)
  }));
  const guardBlocks = workerPreflightResults.some((result) => result.outcome === "block");
  const guardEscalates = workerPreflightResults.some((result) => result.outcome === "escalate");
  const reasonCodes = [...new Set([
    ...browserPolicyDecisions.flatMap((item) => item.reason_codes),
    ...workerPreflightResults.flatMap((result) => result.guard_decision.reason_codes),
    ...(registryBlocked ? ["browser_registry_summary_untrusted"] : [])
  ])].sort();
  const blocked = browserPolicyBlocks || guardBlocks || registryBlocked;
  const escalated = browserPolicyEscalates || guardEscalates;
  return BrowserPreflightSummarySchema.parse({
    schema_version: BrowserOpsSchemaVersion.BrowserPreflightSummary,
    preflight_id: `browserops-preflight:${input.action_plan.action_plan_id}`,
    action_plan_id: input.action_plan.action_plan_id,
    mission_id: input.action_plan.mission_id,
    allowed: !blocked && !escalated && workerPreflightResults.every((result) => result.outcome === "allow"),
    blocked,
    escalated,
    reason_codes: reasonCodes,
    browser_policy_decisions: browserPolicyDecisions,
    guard_decision_refs: workerPreflightResults.map((result) => result.guard_decision.decision_id).sort(),
    worker_task_refs: tasks.map((task) => task.task_id).sort(),
    evidence_refs: [...new Set([...input.action_plan.evidence_requirements, ...workerPreflightResults.flatMap((result) => result.guard_decision.evidence_required)])].sort(),
    receipt_refs: [...new Set([...input.action_plan.receipt_requirements, ...workerPreflightResults.map((result) => result.receipt_event.event_id)])].sort(),
    created_at: normalized.requested_at
  });
}
