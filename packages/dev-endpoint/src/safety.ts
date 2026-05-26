import { DevEndpointSafetyDecisionSchema, type DevEndpointConfig, type ToolInventorySummary } from "./schemas";

function hasCredentialMaterial(config: DevEndpointConfig): boolean {
  return Boolean(config.oauthProductionClientId || config.oauthProductionClientSecret || config.tunnelAuthToken || config.cloudCredential);
}

function isLoopbackOrFixture(url: string): boolean {
  return url.startsWith("http://localhost:") || url.startsWith("http://127.0.0.1:") || url.startsWith("dev-endpoint://fixture/");
}

function publicEndpointFinding(config: DevEndpointConfig): string | undefined {
  const value = config.publicProductionDomain ?? config.devUrlPlaceholder;
  if (!value) return undefined;
  if (isLoopbackOrFixture(value)) return undefined;
  if (/^https?:\/\//i.test(value)) return "real tunnel URL or public endpoint denied";
  if (/\.(com|net|org|app|dev|io|cloud|run|pages)$/i.test(value)) return "public production domain denied";
  return undefined;
}

function collectUnsafeTools(tools: ToolInventorySummary[]): string[] {
  const findings: string[] = [];
  for (const tool of tools) {
    if (tool.unrestrictedLiveWrite) findings.push(`unrestricted live write tool denied: ${tool.name}`);
    if (tool.destructive) findings.push(`destructive tool denied: ${tool.name}`);
    if (tool.productionMutation) findings.push(`production mutation tool denied: ${tool.name}`);
    if (tool.protectedBranchMutation) findings.push(`protected branch mutation tool denied: ${tool.name}`);
    if (tool.secretAccess) findings.push(`secret access tool denied: ${tool.name}`);
    if (tool.customerData) findings.push(`customer/private data tool denied: ${tool.name}`);
    if (tool.moneyMovement) findings.push(`money movement tool denied: ${tool.name}`);
  }
  return findings;
}

export function decideDevEndpointSafety(config: DevEndpointConfig) {
  const policy = config.safetyPolicy;
  const findings: string[] = [];
  const deniedCategories: string[] = [];
  const add = (category: string, finding: string) => { deniedCategories.push(category); findings.push(finding); };

  if (policy.denyProductionMode && (config.productionMode || config.mode === "hosted_future")) add("production_mode", "production or hosted future mode denied");
  if (config.mode === "reachable_dev_preview" && !policy.allowReachableDevPreview) add("reachable_dev_preview", "reachable dev preview remains blocked until configured safely");
  if (config.mode === "tunnel_config_required" && (!config.placeholderOnly || config.tunnelProvider === "none")) add("tunnel_provider", "tunnel config must be placeholder-only with a future provider");
  if (config.tunnelProvider !== "none" && config.mode !== "tunnel_config_required") add("unknown_tunnel_provider_live_enablement", "unknown tunnel provider live enablement denied");
  const endpointFinding = publicEndpointFinding(config);
  if (policy.denyPublicProductionDomain && endpointFinding) add("public_endpoint", endpointFinding);
  if (policy.denyCredentialMaterial && hasCredentialMaterial(config)) add("credential_material", "OAuth clients/secrets, tunnel auth values, and cloud credentials are denied");
  if (config.productionDeploymentEnabled) add("production_deployment", "production deployment denied");
  if (config.destructiveOperationsEnabled) add("destructive_operations", "destructive operations denied");
  if (config.protectedBranchMutationEnabled) add("protected_branch_mutation", "protected branch mutation denied");
  if (config.containsCustomerData) add("customer_private_data", "customer/private data denied");
  if (config.moneyMovementEnabled) add("money_movement", "money movement denied");
  if (config.materialExternalSendsEnabled) add("material_external_sends", "material external sends denied");
  for (const finding of collectUnsafeTools(config.toolInventory)) add("unsafe_tool_inventory", finding);
  if (policy.requireSafetyInventory && config.toolInventory.length === 0 && config.mode !== "disabled") add("missing_safety_inventory", "missing safety inventory denied");

  return DevEndpointSafetyDecisionSchema.parse({
    allowed: findings.length === 0,
    decision: findings.length === 0 ? "allow" : "deny",
    findings,
    deniedCategories: [...new Set(deniedCategories)],
    policy
  });
}
