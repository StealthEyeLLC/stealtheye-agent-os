import { SafetyDecisionSchema, SafetyPolicySchema, type ChatGptDeveloperModeConnectionPlan, type ChatGptDeveloperModeSafetyPolicy, type InventoryItem } from "./schemas";

const PUBLIC_URL = /^https?:\/\/(?!localhost(?::|\/|$))(?!127\.0\.0\.1(?::|\/|$))/i;
const PRODUCTION_DOMAIN = /\b(?:prod|production)\b|\.(?:com|net|org|io|app|dev|cloud)(?:\/|$)/i;

export const DEFAULT_CHATGPT_DEV_MODE_SAFETY_POLICY: ChatGptDeveloperModeSafetyPolicy = SafetyPolicySchema.parse({});

function deny(findings: string[], categories: string[], condition: boolean, category: string, finding: string) {
  if (condition) {
    findings.push(finding);
    categories.push(category);
  }
}

export function decideDeveloperModeSafety(plan: ChatGptDeveloperModeConnectionPlan, inventory: InventoryItem[] = [], policy = DEFAULT_CHATGPT_DEV_MODE_SAFETY_POLICY) {
  const findings: string[] = [];
  const denied: string[] = [];
  const boundaryText = plan.boundary_statements.join(" ").toLowerCase();
  deny(findings, denied, policy.denyProductionAppSubmission && plan.public_app_submission, "production_app_submission", "production app submission denied");
  deny(findings, denied, policy.denyRealAppIds && plan.real_app_id_present, "real_app_id", "real app ID denied");
  deny(findings, denied, policy.denyRealOAuthClientsOrSecrets && plan.oauth_production_configured, "real_oauth", "real OAuth client denied");
  deny(findings, denied, policy.denyProductionDomains && [plan.endpoint_placeholder, plan.chatgpt_dev_uri, plan.local_mcp_url].some((value) => PRODUCTION_DOMAIN.test(value) && !value.startsWith("chatgpt-dev://") && !value.startsWith("dev-endpoint://")), "production_domain", "production domain denied");
  deny(findings, denied, policy.denyRealPublicEndpointUrls && [plan.endpoint_placeholder, plan.chatgpt_dev_uri, plan.local_mcp_url].some((value) => PUBLIC_URL.test(value)), "real_public_endpoint", "real public endpoint denied");
  deny(findings, denied, policy.requireDevEndpointReadiness && plan.connection_stage === "prerequisites", "missing_dev_endpoint_readiness", "missing dev endpoint readiness denied");
  deny(findings, denied, policy.requireReceiptPreview && !boundaryText.includes("receipt"), "missing_receipt_preview", "missing receipt preview denied");
  deny(findings, denied, policy.requireBoundaryStatements && !(boundaryText.includes("no secret") && boundaryText.includes("no production") && boundaryText.includes("no oauth") && boundaryText.includes("no public app submission")), "missing_boundary_statement", "missing no-secret/no-production boundary statement denied");
  deny(findings, denied, inventory.length === 0 && policy.requireMcpServerSafetyInventory, "missing_mcp_server_safety_inventory", "missing MCP server safety inventory denied");
  for (const tool of inventory) {
    deny(findings, denied, policy.denyUnrestrictedLiveWriteTools && tool.unrestrictedLiveWrite, "unrestricted_live_write_tool", `tool denied: ${tool.name} unrestricted live write`);
    deny(findings, denied, policy.denyDestructiveTools && tool.destructive, "destructive_tool", `tool denied: ${tool.name} destructive`);
    deny(findings, denied, policy.denyProductionMutationTools && tool.productionMutation, "production_mutation_tool", `tool denied: ${tool.name} production mutation`);
    deny(findings, denied, policy.denyProtectedBranchMutationTools && tool.protectedBranchMutation, "protected_branch_mutation_tool", `tool denied: ${tool.name} protected branch mutation`);
    deny(findings, denied, policy.denyCustomerPrivateData && tool.customerData, "customer_private_data_tool", `tool denied: ${tool.name} customer/private data`);
    deny(findings, denied, policy.denyMoneyMovement && tool.moneyMovement, "money_movement_tool", `tool denied: ${tool.name} money movement`);
    deny(findings, denied, policy.denyTunnelAuthTokens && tool.name.toLowerCase().includes("tunnel auth"), "tunnel_auth_token", "tunnel auth value denied");
    deny(findings, denied, policy.denyCloudCredentials && tool.name.toLowerCase().includes("cloud credential"), "cloud_credential", "cloud credential denied");
    deny(findings, denied, policy.denyRealOAuthClientsOrSecrets && tool.secretAccess, "secret_access_tool", `tool denied: ${tool.name} secret access`);
  }
  return SafetyDecisionSchema.parse({ allowed: denied.length === 0, decision: denied.length === 0 ? "allow" : "deny", findings, denied_categories: [...new Set(denied)], policy });
}

export function assertNoCommittedLiveAppMaterial(value: unknown) {
  const text = JSON.stringify(value);
  if (/app_id=|oauth_client=|tunnel_token=|cloud_account=|client_secret=/i.test(text)) throw new Error("Potential live app material found");
  if (/https:\/\/(?!developers\.openai\.com|modelcontextprotocol\.io)/i.test(text)) throw new Error("Potential live endpoint found");
  return true;
}
