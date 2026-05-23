import type { Effect, HardStopCategory, RequestedAction } from "./schemas";

export const HARD_STOP_REASON_PREFIX = "hard_stop";

export const HARD_STOP_EFFECTS: Record<HardStopCategory, readonly Effect[]> = {
  deletion_destruction: ["destructive_delete"],
  raw_secrets_credentials: ["raw_secret_access"],
  money_billing_subscriptions: ["money_movement"],
  production_deploy_or_data_mutation: ["production_deploy", "production_data_mutation"],
  production_impacting_migration: ["database_migration"],
  auth_security_critical_change: ["auth_security_change"],
  protected_branch_mutation: ["protected_branch_mutation"],
  force_push_history_rewrite: ["force_push", "history_rewrite"],
  weaken_ci_tests_security: ["weaken_ci", "delete_test_to_pass"],
  material_external_send: ["external_send"],
  legal_commitment: ["legal_commitment"],
  platform_required_confirmation: ["platform_required_confirmation"]
};

export const DEFAULT_HARD_STOP_OUTCOME: Record<HardStopCategory, "deny" | "escalate"> = {
  deletion_destruction: "escalate",
  raw_secrets_credentials: "escalate",
  money_billing_subscriptions: "escalate",
  production_deploy_or_data_mutation: "escalate",
  production_impacting_migration: "escalate",
  auth_security_critical_change: "escalate",
  protected_branch_mutation: "deny",
  force_push_history_rewrite: "deny",
  weaken_ci_tests_security: "deny",
  material_external_send: "escalate",
  legal_commitment: "escalate",
  platform_required_confirmation: "escalate"
};

export function evaluateHardStops(action: RequestedAction): HardStopCategory[] {
  const matched = new Set<HardStopCategory>();
  for (const [category, effects] of Object.entries(HARD_STOP_EFFECTS) as [HardStopCategory, readonly Effect[]][]) {
    if (effects.includes(action.effect)) matched.add(category);
  }

  const environment = action.target.environment?.toLowerCase();
  if (environment === "production" && ["write_branch_files", "commit_branch", "database_migration"].includes(action.effect)) {
    matched.add(action.effect === "database_migration" ? "production_impacting_migration" : "production_deploy_or_data_mutation");
  }

  const branch = action.target.branch?.toLowerCase();
  if ((branch === "main" || branch === "master" || branch?.startsWith("release/")) && ["write_branch_files", "commit_branch"].includes(action.effect)) {
    matched.add("protected_branch_mutation");
  }

  if (action.risk_indicators.some((indicator) => indicator.toLowerCase().includes("secret"))) matched.add("raw_secrets_credentials");
  if (action.risk_indicators.some((indicator) => indicator.toLowerCase().includes("billing") || indicator.toLowerCase().includes("refund") || indicator.toLowerCase().includes("purchase"))) matched.add("money_billing_subscriptions");
  if (action.risk_indicators.some((indicator) => indicator.toLowerCase().includes("weaken ci") || indicator.toLowerCase().includes("skip test"))) matched.add("weaken_ci_tests_security");

  return [...matched].sort();
}

export function hardStopOutcome(matches: HardStopCategory[]): "deny" | "escalate" | undefined {
  if (matches.length === 0) return undefined;
  if (matches.some((match) => DEFAULT_HARD_STOP_OUTCOME[match] === "deny")) return "deny";
  return "escalate";
}

export function hardStopReasonCode(category: HardStopCategory): string {
  return `${HARD_STOP_REASON_PREFIX}:${category}`;
}
