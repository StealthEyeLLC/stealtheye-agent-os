import { parseDevEndpointConfig } from "./config";
import { LOCALHOST_CONFIG_FIXTURE, TUNNEL_CONFIG_REQUIRED_FIXTURE } from "./fixtures";
import { createDevEndpointManifest } from "./endpoint";

export function createLocalhostDevEndpointManifest() {
  return createDevEndpointManifest(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE));
}

export function createTunnelConfigRequiredDevEndpointManifest() {
  return createDevEndpointManifest(parseDevEndpointConfig(TUNNEL_CONFIG_REQUIRED_FIXTURE));
}
