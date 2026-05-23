import { GuardDecisionReceiptSchema, GuardSchemaVersion, type GuardDecision, type GuardDecisionReceipt, type RequestedAction } from "./schemas";

function targetSummary(action: RequestedAction): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [key, value] of Object.entries(action.target)) {
    if (typeof value === "string") output[key] = value;
  }
  return output;
}

export function createGuardDecisionReceipt(decision: GuardDecision, action: RequestedAction, consideredTokenIds: string[]): GuardDecisionReceipt {
  return GuardDecisionReceiptSchema.parse({
    schema_version: GuardSchemaVersion.GuardDecisionReceipt,
    receipt_id: `receipt:${decision.decision_id}`,
    decision_id: decision.decision_id,
    mission_id: decision.mission_id,
    action_id: action.action_id,
    actor_id: action.actor_id,
    requested_effect: action.effect,
    target_summary: targetSummary(action),
    capability_token_ids_considered: [...consideredTokenIds].sort(),
    capability_token_ids_matched: [...decision.matched_capability_token_ids].sort(),
    policy_checks: decision.policy_checks,
    hard_stops_matched: decision.matched_hard_stops,
    registry_trust_summary: decision.registry_trust_result,
    decision_result: decision.decision,
    reason_codes: decision.reason_codes,
    timestamp: decision.created_at,
    evidence_refs: action.evidence_refs
  });
}
