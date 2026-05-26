import { ControlPlaneSafetyDecisionSchema, ControlPlaneSafetyPolicySchema, type ControlPlaneAction, type ControlPlaneSafetyPolicy } from "./schemas";

export const DEFAULT_CONTROL_PLANE_SAFETY_POLICY: ControlPlaneSafetyPolicy = ControlPlaneSafetyPolicySchema.parse({});

function deny(findings: string[], categories: string[], condition: boolean, category: string, finding: string) {
  if (condition) {
    findings.push(finding);
    categories.push(category);
  }
}

export function decideControlPlaneSafety(action: ControlPlaneAction, policy = DEFAULT_CONTROL_PLANE_SAFETY_POLICY) {
  const findings: string[] = [];
  const denied: string[] = [];
  deny(findings, denied, policy.denyProductionDeployment && action.productionDeployment, "production_deployment", "production deployment denied");
  deny(findings, denied, policy.denyPublicAppSubmission && action.publicAppSubmission, "public_app_submission", "public app submission denied");
  deny(findings, denied, policy.denyRealOAuthClientsOrSecrets && action.realOAuthClient, "real_oauth", "real OAuth client denied");
  deny(findings, denied, policy.denyRealAppIds && action.realAppId, "real_app_id", "real app ID denied");
  deny(findings, denied, policy.denyProductionDomains && action.productionDomain, "production_domain", "production domain denied");
  deny(findings, denied, policy.denyRealPublicEndpoints && action.realPublicEndpoint, "real_public_endpoint", "real public endpoint denied");
  deny(findings, denied, policy.denyUnrestrictedLiveWriteActions && action.unrestrictedLiveWrite, "unrestricted_live_write", "unrestricted live write action denied");
  deny(findings, denied, policy.denyProtectedBranchMutationActions && action.protectedBranchMutation, "protected_branch_mutation", "protected branch mutation action denied");
  deny(findings, denied, policy.denyDestructiveActions && action.destructive, "destructive_action", "destructive action denied");
  deny(findings, denied, policy.denyProductionMutationActions && action.productionMutation, "production_mutation", "production mutation action denied");
  deny(findings, denied, policy.denyCustomerPrivateDataActions && action.customerPrivateData, "customer_private_data", "customer/private data action denied");
  deny(findings, denied, policy.denyMoneyMovementActions && action.moneyMovement, "money_movement", "money movement action denied");
  deny(findings, denied, policy.denyMaterialExternalSends && action.materialExternalSend, "material_external_send", "material external send denied");
  deny(findings, denied, policy.denyCredentialEntryStorage && action.credentialEntryStorage, "credential_entry_storage", "credential entry or storage denied");
  deny(findings, denied, policy.requireGuardBoundary && !action.guardBoundaryPresent, "missing_guard_boundary", "missing Guard boundary denied");
  deny(findings, denied, policy.requireReceiptPreview && !action.receiptPreviewRequired, "missing_receipt_preview", "missing receipt preview denied");
  deny(findings, denied, policy.denyUnknownActionCategories && (action.category === "unknown" || action.category === "forbidden"), "unknown_action_category", "unknown action category denied");
  const allowedCategories = ["navigation", "fixture_preview", "readonly_summary", "refresh_fixture_state"];
  deny(findings, denied, !allowedCategories.includes(action.category), "unknown_action_category", "unknown action category denied");
  return ControlPlaneSafetyDecisionSchema.parse({ allowed: denied.length === 0, decision: denied.length === 0 ? "allow" : "deny", findings, denied_categories: [...new Set(denied)], policy });
}

export function assertNoControlPlaneLiveMaterial(value: unknown) {
  const text = JSON.stringify(value).toLowerCase();
  const markers = ["app" + "_id=", "oauth" + "_client=", "tunnel" + "_token=", "cloud" + "_account=", "client" + "_secret=", "private" + "_key="];
  if (markers.some((marker) => text.includes(marker))) throw new Error("Potential live app material found");
  if (/https:\/\/(?!developers\.openai\.com|modelcontextprotocol\.io)/i.test(text)) throw new Error("Potential live endpoint found");
  return true;
}
