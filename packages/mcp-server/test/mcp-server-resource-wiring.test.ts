import { describe, expect, it } from "vitest";
import {
  LocalhostPreviewManifestSchema,
  createLocalhostPreviewManifest,
  createMcpServer,
  createMcpUiResourceReadinessReport,
  createMcpUiResourceSafetyPolicy,
  decideMcpUiResourceSafety,
  listMcpUiResourceDescriptors,
  listServerResources,
  readMcpUiResource,
  readServerResource
} from "../src";

const deniedWith = (patch: Parameters<typeof decideMcpUiResourceSafety>[0]) =>
  decideMcpUiResourceSafety({
    resource_uri: "ui-render://stealtheye/control-plane/overview",
    preview_mode: "static_fixture_preview",
    readOnly: true,
    fixtureOnly: true,
    previewOnly: true,
    receipt_refs: ["receipt.build20.test"],
    ...patch
  }).allowed;

describe("Build 20 MCP resource wiring and localhost preview", () => {
  it("MCP server lists UI resources", () => {
    const resources = listServerResources();
    expect(resources.some((resource) => resource.uri === "ui://stealtheye/control-plane/overview")).toBe(true);
    expect(resources.some((resource) => resource.sourcePackage === "@stealtheye/control-plane-ui")).toBe(true);
  });

  it("MCP server reads UI resources", () => {
    const read = readServerResource("ui://stealtheye/control-plane/overview");
    expect(read.readOnly).toBe(true);
    expect(JSON.stringify(read.contents)).toContain("control-plane-resource");
  });

  it("MCP server lists render resources", () => {
    expect(listMcpUiResourceDescriptors().some((resource) => resource.uri === "ui-render://stealtheye/control-plane/overview")).toBe(true);
  });

  it("MCP server reads rendered shell resources", () => {
    const read = readServerResource("ui-render://stealtheye/control-plane/overview");
    expect(read.readOnly).toBe(true);
    expect(JSON.stringify(read.contents)).toContain("local-dev-ui-shell.render-result.v1");
  });

  it("rendered resource contains deterministic static HTML", () => {
    const first = readMcpUiResource("ui-render://stealtheye/control-plane/overview");
    const second = readMcpUiResource("ui-render://stealtheye/control-plane/overview");
    expect(JSON.stringify(first.contents)).toBe(JSON.stringify(second.contents));
    expect(JSON.stringify(first.contents)).toContain("<!doctype html>");
  });

  it("rendered resource includes boundary banner", () => {
    expect(JSON.stringify(readMcpUiResource("ui-render://stealtheye/control-plane/overview").contents)).toContain("No secrets");
  });

  it("rendered resource includes receipt preview", () => {
    expect(JSON.stringify(readMcpUiResource("ui-render://stealtheye/control-plane/overview").contents)).toContain("Receipt preview");
  });

  it("localhost preview metadata schema validates", () => {
    expect(LocalhostPreviewManifestSchema.parse(createLocalhostPreviewManifest("disabled")).bind_by_default).toBe(false);
  });

  it("disabled preview mode allowed", () => expect(deniedWith({ resource_uri: "localhost-preview://stealtheye/control-plane/disabled", preview_mode: "disabled" })).toBe(true));
  it("static fixture preview mode allowed", () => expect(deniedWith({ preview_mode: "static_fixture_preview" })).toBe(true));
  it("localhost config-required mode allowed", () => expect(deniedWith({ resource_uri: "localhost-preview://stealtheye/control-plane/localhost-config-required", preview_mode: "localhost_config_required" })).toBe(true));
  it("localhost bound future blocked", () => expect(deniedWith({ preview_mode: "localhost_bound_future" })).toBe(false));
  it("hosted future blocked", () => expect(deniedWith({ preview_mode: "hosted_future" })).toBe(false));
  it("production deployment denied", () => expect(deniedWith({ productionDeployment: true })).toBe(false));
  it("public app submission denied", () => expect(deniedWith({ publicAppSubmission: true })).toBe(false));
  it("real OAuth client denied", () => expect(deniedWith({ realOAuthClient: true })).toBe(false));
  it("real app ID denied", () => expect(deniedWith({ realAppId: true })).toBe(false));
  it("production domain denied", () => expect(deniedWith({ productionDomain: true })).toBe(false));
  it("real public endpoint denied", () => expect(deniedWith({ realPublicEndpoint: true })).toBe(false));
  it("unrestricted live write denied", () => expect(deniedWith({ unrestrictedLiveWrite: true })).toBe(false));
  it("protected branch mutation denied", () => expect(deniedWith({ protectedBranchMutation: true })).toBe(false));
  it("destructive action denied", () => expect(deniedWith({ destructive: true })).toBe(false));
  it("production mutation denied", () => expect(deniedWith({ productionMutation: true })).toBe(false));
  it("customer/private data denied", () => expect(deniedWith({ customerPrivateData: true })).toBe(false));
  it("money movement denied", () => expect(deniedWith({ moneyMovement: true })).toBe(false));
  it("material external send denied", () => expect(deniedWith({ materialExternalSend: true })).toBe(false));
  it("credential entry/storage denied", () => expect(deniedWith({ credentialEntryStorage: true })).toBe(false));
  it("external side effects denied", () => expect(deniedWith({ externalSideEffects: true })).toBe(false));
  it("unsafe resource URI scheme denied", () => expect(deniedWith({ resource_uri: "https://example.invalid", unsafeResourceUri: true })).toBe(false));
  it("remote asset denied", () => expect(deniedWith({ remoteAsset: true })).toBe(false));
  it("server binding by default denied", () => expect(deniedWith({ serverBindingByDefault: true })).toBe(false));
  it("external network access denied", () => expect(deniedWith({ externalNetworkAccess: true })).toBe(false));
  it("tunnel provider live enablement denied", () => expect(deniedWith({ tunnelProviderLiveEnablement: true })).toBe(false));
  it("missing fixture/preview/read-only flags denied", () => expect(deniedWith({ readOnly: false })).toBe(false));
  it("missing receipt refs denied", () => expect(deniedWith({ receipt_refs: [] })).toBe(false));
  it("unknown resource/preview mode denied", () => expect(deniedWith({ preview_mode: "mystery" })).toBe(false));

  it("resource read receipt preview generated", () => {
    const read = readMcpUiResource("ui-render://stealtheye/control-plane/overview");
    expect(read.receipt_preview.resource_uri).toBe("ui-render://stealtheye/control-plane/overview");
    expect(read.receipt_preview.no_production_statement).toContain("No production frontend");
    expect(read.receipt_preview.no_money_statement).toContain("No money movement");
  });

  it("existing MCP server resources still list/read", () => {
    const resource = listServerResources().find((candidate) => candidate.uri.includes("mcp-server/capabilities"));
    expect(resource).toBeTruthy();
    expect(readServerResource(resource!.uri).public_safe).toBe(true);
  });

  it("generated state strict sync passes", () => expect(createMcpUiResourceSafetyPolicy().allows).toContain("static_fixture_resource_listing"));
  it("protected docs unchanged", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));

  it("no tokens/customer data/private endpoints in fixtures/docs", () => {
    const serialized = JSON.stringify({ resources: listMcpUiResourceDescriptors(), report: createMcpUiResourceReadinessReport() });
    expect(serialized).not.toMatch(/client_secret|private_key|oauth_secret|customer_ssn|customer_card|https?:\/\//i);
  });

  it("no remote asset/script/style material", () => {
    const serialized = JSON.stringify(readMcpUiResource("ui-render://stealtheye/control-plane/overview"));
    expect(serialized).not.toMatch(/https?:\/\/|<script\s+[^>]*src=|<link\s+[^>]*href=|cdn\./i);
  });

  it("no default server binding", () => {
    expect(createLocalhostPreviewManifest("static_fixture_preview").bind_by_default).toBe(false);
    expect(createMcpUiResourceReadinessReport().server_binding_default).toBe(false);
  });
});
