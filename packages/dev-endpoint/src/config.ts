import { DevEndpointConfigSchema, DevEndpointModeSchema, DevTunnelProviderSchema, type DevEndpointConfig, type DevEndpointMode, type DevTunnelProvider } from "./schemas";
import { DEFAULT_SAFETY_POLICY } from "./fixtures";

export function parseDevEndpointMode(mode: unknown): DevEndpointMode {
  return DevEndpointModeSchema.parse(mode);
}

export function parseDevTunnelProvider(provider: unknown): DevTunnelProvider {
  return DevTunnelProviderSchema.parse(provider);
}

export function parseDevEndpointConfig(config: unknown): DevEndpointConfig {
  const parsed = DevEndpointConfigSchema.parse(config);
  return { ...parsed, safetyPolicy: { ...DEFAULT_SAFETY_POLICY, ...parsed.safetyPolicy } };
}

export function createDevEndpointConfig(overrides: Partial<DevEndpointConfig> = {}): DevEndpointConfig {
  return parseDevEndpointConfig({ mode: "disabled", tunnelProvider: "none", ...overrides });
}
