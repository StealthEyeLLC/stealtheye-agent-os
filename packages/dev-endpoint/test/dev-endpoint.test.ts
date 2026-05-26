import { describe, expect, it } from "vitest";
import { createDevEndpointConfig, createDevEndpointManifest, createDevEndpointReadinessReport, createDevEndpointReceiptPreview, decideDevEndpointSafety, DEV_ENDPOINT_FIXTURE_URI, DISABLED_CONFIG_FIXTURE, LOCALHOST_CONFIG_FIXTURE, LOOPBACK_MCP_URL, TUNNEL_CONFIG_REQUIRED_FIXTURE, parseDevEndpointConfig, parseDevEndpointMode, parseDevTunnelProvider } from "../src";

function decisionFor(overrides: object) {
  return decideDevEndpointSafety(parseDevEndpointConfig({ ...LOCALHOST_CONFIG_FIXTURE, ...overrides }));
}

describe("dev endpoint schemas", () => {
  it("endpoint config schemas validate", () => expect(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE).mode).toBe("localhost_only"));
  it("endpoint mode schema validates", () => expect(parseDevEndpointMode("tunnel_config_required")).toBe("tunnel_config_required"));
  it("tunnel provider schema validates", () => expect(parseDevTunnelProvider("custom_future")).toBe("custom_future"));
  it("localhost_only config allowed", () => expect(decideDevEndpointSafety(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).allowed).toBe(true));
  it("disabled config allowed", () => expect(decideDevEndpointSafety(parseDevEndpointConfig(DISABLED_CONFIG_FIXTURE)).allowed).toBe(true));
  it("tunnel_config_required config allowed with placeholders only", () => expect(decideDevEndpointSafety(parseDevEndpointConfig(TUNNEL_CONFIG_REQUIRED_FIXTURE)).allowed).toBe(true));
});

describe("dev endpoint safety denials", () => {
  it("public production domain denied", () => expect(decisionFor({ publicProductionDomain: "prod.example.com" }).deniedCategories).toContain("public_endpoint"));
  it("real tunnel URL denied", () => expect(decisionFor({ devUrlPlaceholder: "https://live-tunnel.example.com/mcp" }).deniedCategories).toContain("public_endpoint"));
  it("OAuth production client denied", () => expect(decisionFor({ oauthProductionClientId: "fixture-client-id" }).deniedCategories).toContain("credential_material"));
  it("tunnel auth value denied", () => expect(decisionFor({ tunnelAuthToken: "fixture-auth-value" }).deniedCategories).toContain("credential_material"));
  it("cloud credential denied", () => expect(decisionFor({ cloudCredential: "fixture-cloud-credential" }).deniedCategories).toContain("credential_material"));
  it("unrestricted live write inventory denied", () => expect(decisionFor({ toolInventory: [{ name: "unsafe", unrestrictedLiveWrite: true }] }).deniedCategories).toContain("unsafe_tool_inventory"));
  it("destructive tool inventory denied", () => expect(decisionFor({ toolInventory: [{ name: "unsafe", destructive: true }] }).deniedCategories).toContain("unsafe_tool_inventory"));
  it("production mutation inventory denied", () => expect(decisionFor({ toolInventory: [{ name: "unsafe", productionMutation: true }] }).deniedCategories).toContain("unsafe_tool_inventory"));
  it("customer/private data inventory denied", () => expect(decisionFor({ toolInventory: [{ name: "unsafe", customerData: true }] }).deniedCategories).toContain("unsafe_tool_inventory"));
  it("money movement inventory denied", () => expect(decisionFor({ toolInventory: [{ name: "unsafe", moneyMovement: true }] }).deniedCategories).toContain("unsafe_tool_inventory"));
});

describe("manifest and readiness", () => {
  it("manifest contains no secrets", () => expect(JSON.stringify(createDevEndpointManifest(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE))).toLowerCase()).not.toContain("client_secret"));
  it("manifest contains no production endpoint", () => expect(JSON.stringify(createDevEndpointManifest(parseDevEndpointConfig(TUNNEL_CONFIG_REQUIRED_FIXTURE))).toLowerCase()).not.toContain("production endpoint enabled"));
  it("manifest contains no real public domain", () => expect(JSON.stringify(createDevEndpointManifest(parseDevEndpointConfig(TUNNEL_CONFIG_REQUIRED_FIXTURE)))).toContain(DEV_ENDPOINT_FIXTURE_URI));
  it("readiness report ready_for_local_dev for localhost fixture", () => expect(createDevEndpointReadinessReport(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).ready_for_local_dev).toBe(true));
  it("readiness report ready_for_tunnel_config for config-required tunnel placeholder", () => expect(createDevEndpointReadinessReport(parseDevEndpointConfig(TUNNEL_CONFIG_REQUIRED_FIXTURE)).ready_for_tunnel_config).toBe(true));
  it("readiness report blocked_for_public_submission", () => expect(createDevEndpointReadinessReport(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).blocked_for_public_submission).toBe(true));
  it("readiness report blocked_for_production", () => expect(createDevEndpointReadinessReport(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).blocked_for_production).toBe(true));
  it("receipt preview generated", () => expect(createDevEndpointReceiptPreview(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).schema_version).toBe("stealtheye-dev-endpoint-receipt-preview.v1"));
  it("MCP server integration can produce dev endpoint metadata", () => expect(createDevEndpointManifest(parseDevEndpointConfig(LOCALHOST_CONFIG_FIXTURE)).server_package).toBe("@stealtheye/mcp-server"));
  it("generated state strict sync passes fixture name", () => expect(createDevEndpointConfig({ mode: "disabled" }).fixtureEndpointUri).toBe(DEV_ENDPOINT_FIXTURE_URI));
  it("protected docs unchanged invariant is represented in package tests", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));
  it("no secrets/tokens/customer data/private endpoints in fixtures/docs", () => {
    const serialized = JSON.stringify({ LOCALHOST_CONFIG_FIXTURE, TUNNEL_CONFIG_REQUIRED_FIXTURE, LOOPBACK_MCP_URL }).toLowerCase();
    expect(serialized).not.toContain("customer ssn");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("private_key");
  });
});
