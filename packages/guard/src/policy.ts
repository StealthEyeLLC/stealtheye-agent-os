import type { CapabilityToken, PolicyCheck, RegistryTrustSummary, RequestedAction } from "./schemas";

export interface RegistryTrustInput {
  trusted?: boolean;
  valid?: boolean;
  trust_status?: RegistryTrustSummary["trust_status"];
  review_status?: RegistryTrustSummary["review_status"];
  digest?: string | undefined;
  errors?: string[] | undefined;
  warnings?: string[] | undefined;
  revoked?: boolean | undefined;
}

export function summarizeRegistryTrust(input?: RegistryTrustInput): RegistryTrustSummary | undefined {
  if (!input) return undefined;
  const errors = input.errors ?? [];
  const warnings = input.warnings ?? [];
  const revoked = Boolean(input.revoked || errors.some((error) => error.toLowerCase().includes("revoked")));
  const base = {
    trusted: Boolean(input.trusted),
    valid: Boolean(input.valid),
    trust_status: input.trust_status ?? (input.trusted ? "trusted" : "untrusted"),
    review_status: input.review_status ?? "missing",
    errors,
    warnings,
    revoked
  } satisfies Omit<RegistryTrustSummary, "digest">;
  return input.digest === undefined ? base : { ...base, digest: input.digest };
}

export function evaluateRegistryTrustRequirement(token: CapabilityToken, registry?: RegistryTrustSummary): PolicyCheck {
  const required = token.tool_manifest_constraints.required_trust_status;
  if (!required) return { check_id: "registry_trust", passed: true, reason_codes: [], summary: "No registry trust requirement configured." };
  if (!registry) return { check_id: "registry_trust", passed: false, reason_codes: ["registry_trust_missing"], summary: "Registry trust summary is required but missing." };

  const reasons: string[] = [];
  if (registry.revoked) reasons.push("registry_revoked");
  if (!registry.valid) reasons.push("registry_invalid");
  if ((required === "trusted" || required === "trusted_and_approved") && !registry.trusted) reasons.push("registry_untrusted");
  if ((required === "approved" || required === "trusted_and_approved") && registry.review_status !== "approved") reasons.push("registry_not_approved");
  return {
    check_id: "registry_trust",
    passed: reasons.length === 0,
    reason_codes: reasons.sort(),
    summary: reasons.length === 0 ? "Registry trust requirements are satisfied." : "Registry trust requirements are not satisfied."
  };
}

export function missingEffectCheck(action: RequestedAction): PolicyCheck {
  return {
    check_id: "effect_present",
    passed: Boolean(action.effect),
    reason_codes: action.effect ? [] : ["effect_missing"],
    summary: action.effect ? "Requested action includes an effect." : "Requested action is missing an effect."
  };
}
