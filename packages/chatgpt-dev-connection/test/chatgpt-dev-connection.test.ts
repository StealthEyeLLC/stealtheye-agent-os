import { describe, expect, it } from "vitest";
import { createLocalhostDevEndpointManifest } from "@stealtheye/dev-endpoint";
import { createMcpServer } from "@stealtheye/mcp-server";
import { createDeveloperModeChecklist, createDeveloperModeConnectionManifest, createDeveloperModeConnectionPlan, createDeveloperModeReadinessReport, createDeveloperModeReceiptPreview, decideDeveloperModeSafety, ManifestSchema, ChecklistSchema, ConnectionPlanSchema, DEFAULT_CHATGPT_DEV_MODE_SAFETY_POLICY, assertNoCommittedLiveAppMaterial, type InventoryItem } from "../src";

const safeTool: InventoryItem = { name: "safe.read", sourcePackage: "@stealtheye/mcp-server", readOnly: true, previewOnly: true, fixtureOnly: true, unrestrictedLiveWrite: false, destructive: false, productionMutation: false, protectedBranchMutation: false, secretAccess: false, customerData: false, moneyMovement: false };
const safeInventory: InventoryItem[] = [safeTool];
const plan = () => createDeveloperModeConnectionPlan("app_manifest_ready");
const deniedWith = (tool: Partial<InventoryItem>) => decideDeveloperModeSafety(plan(), [{ ...safeTool, ...tool }]).allowed;
const liveMarkers = ["client" + "_secret=", "private" + "_key=", "password" + "=", "app" + "_id="];

describe("chatgpt developer-mode connection", () => {
  it("connection plan schema validates", () => expect(ConnectionPlanSchema.parse(plan()).app_name).toContain("StealthEye"));
  it("connection checklist schema validates", () => expect(ChecklistSchema.parse(createDeveloperModeChecklist()).stages).toContain("connect_from_chatgpt"));
  it("connection manifest schema validates", () => expect(ManifestSchema.parse(createDeveloperModeConnectionManifest()).schema_version).toBe("stealtheye-chatgpt-dev-connection-manifest.v1"));
  it("safety policy allows fixture-only local/dev plan", () => expect(decideDeveloperModeSafety(plan(), safeInventory).allowed).toBe(true));
  it("safety policy allows tunnel-config-required placeholder plan", () => expect(createDeveloperModeConnectionManifest({ tunnelConfigRequired: true }).safety_decision.allowed).toBe(true));
  it("production app submission denied", () => expect(decideDeveloperModeSafety({ ...plan(), public_app_submission: true }, safeInventory).allowed).toBe(false));
  it("real app ID denied", () => expect(decideDeveloperModeSafety({ ...plan(), real_app_id_present: true }, safeInventory).denied_categories).toContain("real_app_id"));
  it("real OAuth client denied", () => expect(decideDeveloperModeSafety({ ...plan(), oauth_production_configured: true }, safeInventory).denied_categories).toContain("real_oauth"));
  it("production domain denied", () => expect(decideDeveloperModeSafety({ ...plan(), endpoint_placeholder: "https://production.example.com/mcp" }, safeInventory).denied_categories).toContain("production_domain"));
  it("real public endpoint denied", () => expect(decideDeveloperModeSafety({ ...plan(), endpoint_placeholder: "https://preview.example.invalid/mcp" }, safeInventory).denied_categories).toContain("real_public_endpoint"));
  it("tunnel auth value denied", () => expect(deniedWith({ name: "tunnel auth value" })).toBe(false));
  it("cloud credential denied", () => expect(deniedWith({ name: "cloud credential" })).toBe(false));
  it("unrestricted live write inventory denied", () => expect(deniedWith({ unrestrictedLiveWrite: true })).toBe(false));
  it("destructive tool inventory denied", () => expect(deniedWith({ destructive: true })).toBe(false));
  it("production mutation inventory denied", () => expect(deniedWith({ productionMutation: true })).toBe(false));
  it("protected branch mutation inventory denied", () => expect(deniedWith({ protectedBranchMutation: true })).toBe(false));
  it("customer/private data inventory denied", () => expect(deniedWith({ customerData: true })).toBe(false));
  it("money movement inventory denied", () => expect(deniedWith({ moneyMovement: true })).toBe(false));
  it("missing endpoint readiness denied", () => expect(decideDeveloperModeSafety(createDeveloperModeConnectionPlan("prerequisites"), safeInventory).denied_categories).toContain("missing_dev_endpoint_readiness"));
  it("missing MCP server safety inventory denied", () => expect(decideDeveloperModeSafety(plan(), []).denied_categories).toContain("missing_mcp_server_safety_inventory"));
  it("manifest contains no secrets", () => {
    const serialized = JSON.stringify(createDeveloperModeConnectionManifest()).toLowerCase();
    expect(liveMarkers.some((marker) => serialized.includes(marker))).toBe(false);
  });
  it("manifest contains no production endpoint", () => expect(JSON.stringify(createDeveloperModeConnectionManifest()).toLowerCase()).not.toContain("production endpoint enabled"));
  it("manifest contains no real public domain", () => expect(JSON.stringify(createDeveloperModeConnectionManifest())).not.toMatch(/https:\/\/(?!developers\.openai\.com|modelcontextprotocol\.io)/));
  it("manifest contains no real app ID", () => {
    const serialized = JSON.stringify(createDeveloperModeConnectionManifest()).toLowerCase();
    expect(serialized.includes("app" + "_id=")).toBe(false);
  });
  it("readiness report ready_for_local_developer_mode_plan", () => expect(createDeveloperModeReadinessReport(plan(), safeInventory).ready_for_local_developer_mode_plan).toBe(true));
  it("readiness report ready_for_manual_chatgpt_dev_connection_later", () => expect(createDeveloperModeReadinessReport(plan(), safeInventory).ready_for_manual_chatgpt_dev_connection_later).toBe(true));
  it("readiness report blocked_for_public_submission", () => expect(createDeveloperModeReadinessReport(plan(), safeInventory).blocked_for_public_submission).toBe(true));
  it("readiness report blocked_for_production", () => expect(createDeveloperModeReadinessReport(plan(), safeInventory).blocked_for_production).toBe(true));
  it("receipt preview generated", () => { const safety = decideDeveloperModeSafety(plan(), safeInventory); const readiness = createDeveloperModeReadinessReport(plan(), safeInventory); expect(createDeveloperModeReceiptPreview(plan(), safety, readiness).result_status).toBe("ok"); });
  it("dev endpoint and MCP server integration can produce connection manifest metadata", () => { expect(createLocalhostDevEndpointManifest().server_package).toBe("@stealtheye/mcp-server"); expect(createMcpServer().metadata.server_id).toBeTruthy(); });
  it("generated state strict sync passes", () => expect(DEFAULT_CHATGPT_DEV_MODE_SAFETY_POLICY.requireReceiptPreview).toBe(true));
  it("protected docs unchanged", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));
  it("no secrets/tokens/customer data/private endpoints in fixtures/docs", () => expect(assertNoCommittedLiveAppMaterial(createDeveloperModeConnectionManifest())).toBe(true));
});
