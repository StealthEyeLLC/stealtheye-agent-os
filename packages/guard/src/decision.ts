import type { RegistryDecision } from "@stealtheye/agent-registry";
import { matchCapabilityTokenToAction } from "./capability-token";
import { evaluateHardStops, hardStopOutcome, hardStopReasonCode } from "./hard-stops";
import { evaluateRegistryTrustRequirement, missingEffectCheck, summarizeRegistryTrust } from "./policy";
import { GuardDecisionSchema, GuardSchemaVersion, type CapabilityToken, type GuardDecision, type PolicyCheck, type RegistryTrustSummary, type RequestedAction } from "./schemas";

export interface EvaluateGuardOptions {
  now?: Date;
  registryTrust?: RegistryTrustSummary | (Partial<RegistryDecision> & { trust_status?: RegistryTrustSummary["trust_status"]; revoked?: boolean });
  decisionId?: string;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export function evaluateGuardDecision(action: RequestedAction, capabilityTokens: CapabilityToken[], options: EvaluateGuardOptions = {}): GuardDecision {
  const now = options.now ?? new Date();
  const createdAt = now.toISOString();
  const registry = summarizeRegistryTrust(options.registryTrust);
  const hardStops = evaluateHardStops(action);
  const policyChecks: PolicyCheck[] = [missingEffectCheck(action)];

  const tokenResults = capabilityTokens.map((token) => ({ token, result: matchCapabilityTokenToAction(token, action, now) }));
  const matchedTokens = tokenResults.filter(({ result }) => result.matches).map(({ token }) => token);
  const tokenReasonCodes = tokenResults.flatMap(({ result }) => result.reason_codes);

  policyChecks.push({
    check_id: "capability_token_match",
    passed: matchedTokens.length > 0,
    reason_codes: matchedTokens.length > 0 ? [] : uniqueSorted(tokenReasonCodes.length > 0 ? tokenReasonCodes : ["no_applicable_token"]),
    summary: matchedTokens.length > 0 ? "At least one active capability token matched the requested action." : "No active capability token matched the requested action."
  });

  for (const token of matchedTokens) policyChecks.push(evaluateRegistryTrustRequirement(token, registry));

  const reasonCodes = uniqueSorted([
    ...policyChecks.flatMap((check) => check.reason_codes),
    ...hardStops.map(hardStopReasonCode),
    ...(capabilityTokens.length === 0 ? ["no_capability_tokens_presented"] : [])
  ]);

  const hardStopDecision = hardStopOutcome(hardStops);
  let decision: GuardDecision["decision"] = "allow";
  if (hardStopDecision) decision = hardStopDecision;
  else if (policyChecks.some((check) => !check.passed)) decision = "deny";

  const evidenceRequired = uniqueSorted(matchedTokens.flatMap((token) => token.evidence_requirements));
  const receiptRequired = uniqueSorted(matchedTokens.flatMap((token) => token.receipt_requirements));

  const summary = decision === "allow"
    ? "Guard allowed the requested action inside mission-scoped authority."
    : decision === "escalate"
      ? "Guard requires escalation before this hard-stop action can proceed."
      : "Guard denied the requested action because policy requirements were not satisfied.";

  return GuardDecisionSchema.parse({
    schema_version: GuardSchemaVersion.GuardDecision,
    decision_id: options.decisionId ?? `guard-decision:${action.action_id}`,
    action_id: action.action_id,
    mission_id: action.mission_id,
    actor_id: action.actor_id,
    decision,
    reason_codes: reasonCodes,
    summary,
    matched_capability_token_ids: matchedTokens.map((token) => token.token_id).sort(),
    matched_hard_stops: hardStops,
    registry_trust_result: registry,
    policy_checks: policyChecks,
    evidence_required: evidenceRequired,
    receipt_required: receiptRequired,
    created_at: createdAt,
    expires_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString()
  });
}
