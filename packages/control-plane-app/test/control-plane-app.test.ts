import { describe, expect, it } from "vitest";
import { ControlPlaneActionSchema, ControlPlaneAppSchema, ControlPlaneNavigationSchema, ControlPlanePanelSchema, ControlPlaneStateSnapshotSchema, ControlPlaneViewSchema, assertNoControlPlaneLiveMaterial, createControlPlaneActions, createControlPlaneApp, createControlPlaneNavigation, createControlPlaneReceiptPreview, createControlPlaneStateSnapshot, createControlPlaneViews, decideControlPlaneSafety, findControlPlaneAction, type ControlPlaneAction, type ControlPlaneView, type ControlPlaneViewId } from "../src";

const baseAction = (): ControlPlaneAction => findControlPlaneAction("view_overview");
const deniedWith = (patch: Partial<ControlPlaneAction>) => decideControlPlaneSafety({ ...baseAction(), ...patch }).allowed;
const viewById = (id: ControlPlaneViewId): ControlPlaneView => {
  const view = createControlPlaneViews().find((candidate) => candidate.id === id);
  if (!view) throw new Error(`Missing control-plane view: ${id}`);
  return view;
};
const firstPanel = (id: ControlPlaneViewId) => {
  const panel = viewById(id).panels[0];
  if (!panel) throw new Error(`Missing panel for view: ${id}`);
  return panel;
};

describe("control plane app", () => {
  it("control plane app schema validates", () => expect(ControlPlaneAppSchema.parse(createControlPlaneApp()).build).toBe(17));
  it("navigation schema validates", () => expect(ControlPlaneNavigationSchema.parse(createControlPlaneNavigation()).views.length).toBeGreaterThan(10));
  it("view schema validates", () => expect(ControlPlaneViewSchema.parse(viewById("overview")).id).toBe("overview"));
  it("panel schema validates", () => expect(ControlPlanePanelSchema.parse(firstPanel("overview")).data_classification).toBe("public_fixture_only"));
  it("action schema validates", () => expect(ControlPlaneActionSchema.parse(baseAction()).name).toBe("view_overview"));
  it("state snapshot schema validates", () => expect(ControlPlaneStateSnapshotSchema.parse(createControlPlaneStateSnapshot()).current_build).toBe(17));
  it("safety policy allows navigation actions", () => expect(decideControlPlaneSafety(baseAction()).allowed).toBe(true));
  it("safety policy allows fixture preview actions", () => expect(decideControlPlaneSafety(findControlPlaneAction("preview_mission_compile")).allowed).toBe(true));
  it("production deployment denied", () => expect(deniedWith({ productionDeployment: true })).toBe(false));
  it("public app submission denied", () => expect(deniedWith({ publicAppSubmission: true })).toBe(false));
  it("real OAuth client denied", () => expect(deniedWith({ realOAuthClient: true })).toBe(false));
  it("real app ID denied", () => expect(deniedWith({ realAppId: true })).toBe(false));
  it("production domain denied", () => expect(deniedWith({ productionDomain: true })).toBe(false));
  it("real public endpoint denied", () => expect(deniedWith({ realPublicEndpoint: true })).toBe(false));
  it("unrestricted live write action denied", () => expect(deniedWith({ unrestrictedLiveWrite: true })).toBe(false));
  it("protected branch mutation action denied", () => expect(deniedWith({ protectedBranchMutation: true })).toBe(false));
  it("destructive action denied", () => expect(deniedWith({ destructive: true })).toBe(false));
  it("production mutation action denied", () => expect(deniedWith({ productionMutation: true })).toBe(false));
  it("customer/private data action denied", () => expect(deniedWith({ customerPrivateData: true })).toBe(false));
  it("money movement action denied", () => expect(deniedWith({ moneyMovement: true })).toBe(false));
  it("material external send denied", () => expect(deniedWith({ materialExternalSend: true })).toBe(false));
  it("credential entry/storage denied", () => expect(deniedWith({ credentialEntryStorage: true })).toBe(false));
  it("unknown action category denied", () => expect(deniedWith({ category: "unknown" })).toBe(false));
  it("receipt preview generated", () => expect(createControlPlaneReceiptPreview(baseAction()).result_status).toBe("ok"));
  it("overview view includes major subsystems", () => expect(firstPanel("overview").summary).toContain("@stealtheye/mission-os"));
  it("missions view includes Mission OS status", () => expect(firstPanel("missions").summary).toContain("Mission OS"));
  it("guard view includes Guard status", () => expect(firstPanel("guard").summary).toContain("Guard"));
  it("memory view includes Memory Graph status", () => expect(firstPanel("memory").summary).toContain("Memory Graph"));
  it("repo status view includes Repo Status capability", () => expect(firstPanel("repo_status").summary).toContain("Repo status"));
  it("mcp server view includes MCP Server status", () => expect(firstPanel("mcp_server").summary).toContain("MCP server"));
  it("dev endpoint view includes Dev Endpoint readiness", () => expect(firstPanel("dev_endpoint").summary).toContain("Dev endpoint"));
  it("ChatGPT developer-mode view includes connection readiness", () => expect(firstPanel("chatgpt_developer_mode").summary).toContain("ChatGPT developer-mode"));
  it("actions are preview/fixture/read-only only", () => expect(createControlPlaneActions().every((action) => action.fixture_only && action.preview_only && action.read_only && !action.productionDeployment && !action.destructive)).toBe(true));
  it("generated state strict sync passes", () => expect(createControlPlaneApp().model_fixture_preview_only).toBe(true));
  it("protected docs unchanged", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));
  it("no secrets/tokens/customer data/private endpoints in fixtures/docs", () => expect(assertNoControlPlaneLiveMaterial(createControlPlaneApp())).toBe(true));
});
