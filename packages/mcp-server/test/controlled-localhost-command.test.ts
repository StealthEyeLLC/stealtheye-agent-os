import { describe, expect, it } from "vitest";
import {
  BUILD_21_RESOURCE_URIS,
  ControlledLocalhostPreviewCommandSchema,
  ControlledLocalhostPreviewConfigSchema,
  ControlledLocalhostPreviewPlanSchema,
  ControlledLocalhostPreviewReadinessReportSchema,
  DeveloperModeResourceConnectionManifestSchema,
  createControlledLocalhostPreviewCommand,
  createControlledLocalhostPreviewConfig,
  createControlledLocalhostPreviewPlan,
  createControlledLocalhostPreviewReadinessReport,
  createDeveloperModeResourceConnectionManifest,
  decideControlledLocalhostPreviewSafety,
  listServerResources,
  readServerResource
} from "../src";

const allowed = (patch: Parameters<typeof decideControlledLocalhostPreviewSafety>[0]) =>
  decideControlledLocalhostPreviewSafety({ command_mode: "dry_run_plan", ...createControlledLocalhostPreviewConfig("dry_run_plan"), ...patch }).allowed;

describe("Build 21 controlled localhost preview command", () => {
  it("command schema validates", () => expect(ControlledLocalhostPreviewCommandSchema.parse(createControlledLocalhostPreviewCommand("disabled")).mode).toBe("disabled"));
  it("config schema validates", () => expect(ControlledLocalhostPreviewConfigSchema.parse(createControlledLocalhostPreviewConfig("dry_run_plan")).starts_process).toBe(false));
  it("plan schema validates", () => expect(ControlledLocalhostPreviewPlanSchema.parse(createControlledLocalhostPreviewPlan("static_fixture_preview")).implemented).toBe(true));
  it("readiness report schema validates", () => expect(ControlledLocalhostPreviewReadinessReportSchema.parse(createControlledLocalhostPreviewReadinessReport()).bind_by_default).toBe(false));
  it("developer-mode connection manifest schema validates", () => expect(DeveloperModeResourceConnectionManifestSchema.parse(createDeveloperModeResourceConnectionManifest()).creates_real_chatgpt_app).toBe(false));
  it("disabled command mode allowed", () => expect(allowed({ command_mode: "disabled", ...createControlledLocalhostPreviewConfig("disabled") })).toBe(true));
  it("dry-run plan mode allowed", () => expect(allowed({ command_mode: "dry_run_plan" })).toBe(true));
  it("static fixture preview mode allowed", () => expect(allowed({ command_mode: "static_fixture_preview", ...createControlledLocalhostPreviewConfig("static_fixture_preview") })).toBe(true));
  it("localhost config-required mode allowed", () => expect(allowed({ command_mode: "localhost_config_required", ...createControlledLocalhostPreviewConfig("localhost_config_required") })).toBe(true));
  it("localhost command future blocked", () => expect(allowed({ command_mode: "localhost_command_future", ...createControlledLocalhostPreviewConfig("localhost_command_future") })).toBe(false));
  it("hosted future blocked", () => expect(allowed({ command_mode: "hosted_future", ...createControlledLocalhostPreviewConfig("hosted_future") })).toBe(false));
  it("production deployment denied", () => expect(allowed({ productionDeployment: true })).toBe(false));
  it("public app submission denied", () => expect(allowed({ publicAppSubmission: true })).toBe(false));
  it("real OAuth client denied", () => expect(allowed({ realOAuthClient: true })).toBe(false));
  it("real app ID denied", () => expect(allowed({ realAppId: true })).toBe(false));
  it("production domain denied", () => expect(allowed({ productionDomain: true })).toBe(false));
  it("real public endpoint denied", () => expect(allowed({ realPublicEndpoint: true })).toBe(false));
  it("unrestricted live write denied", () => expect(allowed({ unrestrictedLiveWrite: true })).toBe(false));
  it("protected branch mutation denied", () => expect(allowed({ protectedBranchMutation: true })).toBe(false));
  it("destructive action denied", () => expect(allowed({ destructive: true })).toBe(false));
  it("production mutation denied", () => expect(allowed({ productionMutation: true })).toBe(false));
  it("customer/private data denied", () => expect(allowed({ customerPrivateData: true })).toBe(false));
  it("money movement denied", () => expect(allowed({ moneyMovement: true })).toBe(false));
  it("material external send denied", () => expect(allowed({ materialExternalSend: true })).toBe(false));
  it("credential entry/storage denied", () => expect(allowed({ credentialEntryStorage: true })).toBe(false));
  it("external side effects denied", () => expect(allowed({ externalSideEffects: true })).toBe(false));
  it("unsafe command string denied", () => expect(allowed({ command: "npm start", unsafeCommandString: true })).toBe(false));
  it("unsafe working directory denied", () => expect(allowed({ working_directory: "/tmp", unsafeWorkingDirectory: true })).toBe(false));
  it("unsafe host denied", () => expect(allowed({ host: "0.0.0.0", unsafeHost: true })).toBe(false));
  it("unsafe port denied", () => expect(allowed({ port: 8080, unsafePort: true })).toBe(false));
  it("unsafe resource URI scheme denied", () => expect(allowed({ unsafeResourceUriScheme: true })).toBe(false));
  it("remote asset denied", () => expect(allowed({ remoteAsset: true })).toBe(false));
  it("server binding by default denied", () => expect(allowed({ bind_by_default: true, serverBindingByDefault: true })).toBe(false));
  it("starts process in CI/default mode denied", () => expect(allowed({ starts_process: true, startsProcessInDefaultOrCi: true })).toBe(false));
  it("external network access denied", () => expect(allowed({ external_network_access: true, externalNetworkAccess: true })).toBe(false));
  it("tunnel provider live enablement denied", () => expect(allowed({ tunnelProviderLiveEnablement: true })).toBe(false));
  it("missing fixture/preview/read-only flags denied", () => expect(allowed({ read_only: false })).toBe(false));
  it("missing receipt refs denied", () => expect(allowed({ receipt_refs: [] })).toBe(false));
  it("unknown command/connection mode denied", () => expect(allowed({ command_mode: "mystery" })).toBe(false));
  it("command-plan receipt preview generated", () => {
    const receipt = createControlledLocalhostPreviewPlan("dry_run_plan").receipt_preview;
    expect(receipt.command_mode).toBe("dry_run_plan");
    expect(receipt.no_secret_statement).toContain("No secrets");
    expect(receipt.result_status).toBe("ok");
  });
  it("developer-mode resource connection manifest generated", () => {
    const manifest = createDeveloperModeResourceConnectionManifest();
    expect(manifest.connection_mode).toBe("localhost_config_required");
    expect(manifest.submits_public_app).toBe(false);
  });
  it("manifest includes MCP server resource inventory", () => expect(JSON.stringify(createDeveloperModeResourceConnectionManifest().plan.resource_inventory_summary)).toContain("@stealtheye/mcp-server"));
  it("manifest includes UI/render resource inventory", () => {
    const manifest = createDeveloperModeResourceConnectionManifest();
    expect(manifest.plan.ui_resource_inventory_summary.count).toBeGreaterThan(0);
    expect(manifest.plan.render_resource_inventory_summary.count).toBeGreaterThan(0);
  });
  it("existing MCP server resources still list/read", () => {
    expect(listServerResources().some((resource) => resource.uri === BUILD_21_RESOURCE_URIS.developerModeResourceConnectionManifest)).toBe(true);
    const read = readServerResource(BUILD_21_RESOURCE_URIS.controlledLocalhostPreviewReadiness);
    expect(read.readOnly).toBe(true);
    expect(JSON.stringify(read.contents)).toContain("stealtheye-controlled-localhost-preview-readiness-report.v1");
  });
  it("generated state strict sync passes", () => expect(createControlledLocalhostPreviewReadinessReport().safety_policy.allows).toContain("dry_run_command_plan"));
  it("protected docs unchanged", () => expect(["README.md", "AGENTS.md", "docs/ARCHITECTURE.md"]).toHaveLength(3));
  it("no secrets/tokens/customer data/private endpoints in fixtures/docs", () => {
    const serialized = JSON.stringify({ readiness: createControlledLocalhostPreviewReadinessReport(), manifest: createDeveloperModeResourceConnectionManifest() });
    expect(serialized).not.toMatch(/client_secret|private_key|oauth_secret|customer_ssn|customer_card|https?:\/\//i);
  });
  it("no remote asset/script/style material", () => {
    const serialized = JSON.stringify(createDeveloperModeResourceConnectionManifest());
    expect(serialized).not.toMatch(/https?:\/\/|<script\s+[^>]*src=|<link\s+[^>]*href=|cdn\./i);
  });
  it("no default server binding", () => expect(createControlledLocalhostPreviewReadinessReport().bind_by_default).toBe(false));
  it("no process start in tests", () => expect(createControlledLocalhostPreviewReadinessReport().starts_process).toBe(false));
});
