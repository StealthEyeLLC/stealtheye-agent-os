import { BrowserActionPlanSchema, BrowserActionSchema, BrowserOpsSchemaVersion, type BrowserAction, type BrowserActionCategory, type BrowserActionKind, type BrowserActionPlan, type BrowserActionPlanStatus, type BrowserRiskTier } from "./schemas";
import { categoryForBrowserAction } from "./action-policy";

export interface CreateBrowserActionInput {
  action_id: string;
  kind: BrowserActionKind;
  domain: string;
  category?: BrowserActionCategory | undefined;
  url?: string | undefined;
  target_ref?: string | undefined;
  selector_ref?: string | undefined;
  value_ref?: string | undefined;
  preview_only?: boolean | undefined;
  expected_evidence_refs?: string[] | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export function createBrowserAction(input: CreateBrowserActionInput): BrowserAction {
  return BrowserActionSchema.parse({
    schema_version: BrowserOpsSchemaVersion.BrowserAction,
    action_id: input.action_id,
    kind: input.kind,
    category: input.category ?? categoryForBrowserAction(input.kind),
    domain: input.domain,
    ...(input.url ? { url: input.url } : {}),
    ...(input.target_ref ? { target_ref: input.target_ref } : {}),
    ...(input.selector_ref ? { selector_ref: input.selector_ref } : {}),
    ...(input.value_ref ? { value_ref: input.value_ref } : {}),
    preview_only: input.preview_only ?? true,
    requires_guard_preflight: true,
    expected_evidence_refs: input.expected_evidence_refs ?? [],
    metadata: input.metadata ?? {}
  });
}

export interface CreateBrowserActionPlanInput {
  action_plan_id: string;
  mission_id: string;
  task_id: string;
  session_id: string;
  page_state_ref: string;
  actions: BrowserAction[];
  expected_effects?: string[] | undefined;
  risk_tier?: BrowserRiskTier | undefined;
  evidence_requirements?: string[] | undefined;
  receipt_requirements?: string[] | undefined;
  status?: BrowserActionPlanStatus | undefined;
  created_at?: string | undefined;
}

export function createBrowserActionPlan(input: CreateBrowserActionPlanInput): BrowserActionPlan {
  return BrowserActionPlanSchema.parse({
    schema_version: BrowserOpsSchemaVersion.BrowserActionPlan,
    action_plan_id: input.action_plan_id,
    mission_id: input.mission_id,
    task_id: input.task_id,
    session_id: input.session_id,
    page_state_ref: input.page_state_ref,
    actions: input.actions,
    expected_effects: input.expected_effects ?? input.actions.map((action) => `browser:${action.kind}`),
    risk_tier: input.risk_tier ?? "low",
    evidence_requirements: input.evidence_requirements ?? ["browser_evidence_refs_only"],
    receipt_requirements: input.receipt_requirements ?? ["browser_preflight_receipt"],
    status: input.status ?? "ready_for_preflight",
    created_at: input.created_at ?? "2026-01-01T00:00:00.000Z"
  });
}

export function validateBrowserActionPlan(plan: unknown): BrowserActionPlan {
  return BrowserActionPlanSchema.parse(plan);
}

export function actionPlanHasActionBearingSteps(plan: BrowserActionPlan): boolean {
  return plan.actions.length > 0;
}
