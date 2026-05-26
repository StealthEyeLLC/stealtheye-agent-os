import type { DevEndpointConfig } from "./schemas";

export function getTunnelProviderStatus(config: DevEndpointConfig) {
  if (config.tunnelProvider === "none") return { provider: config.tunnelProvider, status: "disabled", live_enabled: false, placeholder_only: true };
  if (config.mode === "tunnel_config_required" && config.placeholderOnly) return { provider: config.tunnelProvider, status: "future_config_required_placeholder_only", live_enabled: false, placeholder_only: true };
  return { provider: config.tunnelProvider, status: "blocked_unknown_live_enablement", live_enabled: false, placeholder_only: config.placeholderOnly };
}

export function requiredTunnelConfig(config: DevEndpointConfig): string[] {
  if (config.mode !== "tunnel_config_required") return [];
  return config.requiredFutureConfig.length > 0 ? config.requiredFutureConfig : ["future provider selection", "future reachable dev URL", "future ChatGPT developer-mode validation"];
}
