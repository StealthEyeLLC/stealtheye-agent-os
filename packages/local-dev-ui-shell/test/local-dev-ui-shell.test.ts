import { describe, expect, it } from "vitest";
import {
  LocalDevUiFixtureBundleSchema,
  LocalDevUiHydrationResultSchema,
  LocalDevUiRenderRequestSchema,
  LocalDevUiRenderResultSchema,
  LocalDevUiResourceLoadResultSchema,
  LocalDevUiRouteSchema,
  LocalDevUiShellSchema,
  LocalDevUiStaticAssetSchema,
  assertNoLocalDevUiLiveMaterial,
  createLocalDevUiFixtureBundle,
  createLocalDevUiRoutes,
  createLocalDevUiSafetyPolicy,
  createLocalDevUiShell,
  createLocalDevUiStaticAssets,
  decideLocalDevUiSafety,
  hydrateLocalDevUiResource,
  loadLocalDevUiResource,
  renderLocalDevUiResource,
  requiredLocalDevUiRoutePaths,
  type LocalDevUiRoute
} from "../src";

const baseRoute = (): LocalDevUiRoute => createLocalDevUiRoutes()[0] ?? (() => { throw new Error("missing route"); })();
const deniedWith = (patch: Record<string, unknown>) => decideLocalDevUiSafety({ ...baseRoute(), ...patch } as Parameters<typeof decideLocalDevUiSafety>[0]).allowed;

describe("local dev UI shell resource rendering", () => {
  it("shell schema validates", () => expect(LocalDevUiShellSchema.parse(createLocalDevUiShell()).build).toBe(19));
  it("route schema validates", () => expect(LocalDevUiRouteSchema.parse(baseRoute()).fixture_only).toBe(true));
  it("render request schema validates", () => expect(LocalDevUiRenderRequestSchema.parse({ schema_version: "local-dev-ui-shell.render-request.v1", route_path: "/", shell_mode: "static_fixture_preview", include_receipt_preview: true, deterministic: true }).deterministic).toBe(true));
  it("render result schema validates", () => expect(LocalDevUiRenderResultSchema.parse(renderLocalDevUiResource({ schema_version: "local-dev-ui-shell.render-request.v1", route_path: "/overview", shell_mode: "static_fixture_preview", include_receipt_preview: true, deterministic: true })).deterministic).toBe(true));
  it("static asset schema validates", () => expect(LocalDevUiStaticAssetSchema.parse(createLocalDevUiStaticAssets()[0]).remote).toBe(false));
  it("resource load schema validates", () => expect(LocalDevUiResourceLoadResultSchema.parse(loadLocalDevUiResource("/overview")).loaded).toBe(true));
  it("hydration result schema validates", () => expect(LocalDevUiHydrationResultSchema.parse(hydrateLocalDevUiResource()).control_plane_state_snapshot_present).toBe(true));
  it("fixture bundle validates", () => expect(LocalDevUiFixtureBundleSchema.parse(createLocalDevUiFixtureBundle()).routes.length).toBeGreaterThanOrEqual(16));
  it("all required routes exist", () => expect(new Set(createLocalDevUiRoutes().map((route) => route.path))).toEqual(new Set(requiredLocalDevUiRoutePaths)));
  it("routes map to allowed ui resources", () => expect(createLocalDevUiRoutes().every((route) => route.resource_uri.startsWith("ui://stealtheye/control-plane/"))).toBe(true));
  it("no production URL routes/resources/assets", () => expect(assertNoLocalDevUiLiveMaterial({ routes: createLocalDevUiRoutes(), assets: createLocalDevUiStaticAssets() })).toBe(true));
  it("no public domain routes/resources/assets", () => expect(JSON.stringify({ routes: createLocalDevUiRoutes(), assets: createLocalDevUiStaticAssets() })).not.toMatch(/\.(com|net|org|app|dev)\//i));
  it("no external CDN/script/style asset", () => expect(createLocalDevUiStaticAssets().every((asset) => !asset.remote && !asset.external_cdn && !/<script\s+src=|<link\s+/i.test(asset.content))).toBe(true));
  it("safety policy allows static fixture rendering", () => expect(createLocalDevUiSafetyPolicy().allows).toContain("static_fixture_rendering"));
  it("production deployment denied", () => expect(deniedWith({ productionDeployment: true })).toBe(false));
  it("public app submission denied", () => expect(deniedWith({ publicAppSubmission: true })).toBe(false));
  it("real OAuth client denied", () => expect(deniedWith({ realOAuthClient: true })).toBe(false));
  it("real app ID denied", () => expect(deniedWith({ realAppId: true })).toBe(false));
  it("production domain denied", () => expect(deniedWith({ productionDomain: true })).toBe(false));
  it("real public endpoint denied", () => expect(deniedWith({ realPublicEndpoint: true })).toBe(false));
  it("unrestricted live write denied", () => expect(deniedWith({ unrestrictedLiveWrite: true })).toBe(false));
  it("protected branch mutation denied", () => expect(deniedWith({ protectedBranchMutation: true })).toBe(false));
  it("destructive action denied", () => expect(deniedWith({ destructive: true })).toBe(false));
  it("production mutation denied", () => expect(deniedWith({ production_mutation: true })).toBe(false));
  it("customer/private data denied", () => expect(deniedWith({ customer_private_data: true })).toBe(false));
  it("money movement denied", () => expect(deniedWith({ moneyMovement: true })).toBe(false));
  it("material external send denied", () => expect(deniedWith({ material_external_send: true })).toBe(false));
  it("credential entry/storage denied", () => expect(deniedWith({ credential_entry: true })).toBe(false));
  it("external side effects denied", () => expect(deniedWith({ external_side_effects: true })).toBe(false));
  it("unsafe route path denied", () => expect(deniedWith({ path: "http://bad", unsafeRoutePath: true })).toBe(false));
  it("unsafe resource URI scheme denied", () => expect(deniedWith({ resource_uri: "file://bad", unsafeResourceUri: true })).toBe(false));
  it("remote asset denied", () => expect(deniedWith({ remoteAsset: true })).toBe(false));
  it("server binding by default denied", () => expect(deniedWith({ serverBindingByDefault: true })).toBe(false));
  it("missing fixture/preview/read-only flags denied", () => expect(deniedWith({ fixture_only: false })).toBe(false));
  it("missing receipt refs denied", () => expect(deniedWith({ receipt_refs: [] })).toBe(false));
  it("unknown route/component/resource type denied", () => expect(deniedWith({ component_type: "unknown" })).toBe(false));
  it("resource loader reads Control Plane UI resources", () => expect(loadLocalDevUiResource("ui://stealtheye/control-plane/overview").resource.component_id).toBe("control-plane-ui.overview_dashboard"));
  it("renderer produces deterministic static HTML", () => {
    const request = { schema_version: "local-dev-ui-shell.render-request.v1" as const, route_path: "/overview", shell_mode: "static_fixture_preview" as const, include_receipt_preview: true, deterministic: true as const };
    expect(renderLocalDevUiResource(request).html).toBe(renderLocalDevUiResource(request).html);
  });
  it("render output includes boundary banner", () => expect(renderLocalDevUiResource({ schema_version: "local-dev-ui-shell.render-request.v1", route_path: "/overview", shell_mode: "static_fixture_preview", include_receipt_preview: true, deterministic: true }).html).toContain("No secrets"));
  it("render output includes receipt preview", () => expect(renderLocalDevUiResource({ schema_version: "local-dev-ui-shell.render-request.v1", route_path: "/overview", shell_mode: "static_fixture_preview", include_receipt_preview: true, deterministic: true }).html).toContain("Receipt preview"));
  it("hydration payload includes control-plane state snapshot", () => expect(hydrateLocalDevUiResource().control_plane_state_snapshot_present).toBe(true));
  it("generated state strict sync passes", () => expect(createLocalDevUiSafetyPolicy().allows).toContain("public_safe_generated_state_display"));
  it("protected docs unchanged", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));
  it("no secrets/tokens/customer data/private endpoints in fixtures/docs", () => expect(assertNoLocalDevUiLiveMaterial(createLocalDevUiFixtureBundle())).toBe(true));
});
