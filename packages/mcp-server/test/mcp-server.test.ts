import { describe, expect, it } from "vitest";
import { listRuntimeTools } from "@stealtheye/mcp-runtime";
import {
  McpServerToolDescriptorSchema,
  ServerMetadataSchema,
  ProtocolMetadataSchema,
  TransportModeSchema,
  createDevConnectionManifest,
  createHostedFutureTransport,
  createHttpDevPreviewTransport,
  createInProcessTransport,
  createMcpServer,
  createSafetyInventory,
  createStdioDevTransport,
  createToolRegistry,
  getMcpServerCapabilities,
  getMcpServerHealth,
  getProtocolMetadata,
  getServerMetadata,
  getTransportDiagnostics,
  listServerResources,
  readServerResource,
  assertNoDuplicateToolNames,
  assertServerToolDescriptorSafe,
  toServerToolDescriptor,
  type McpServerToolDescriptor
} from "../src";

const appHostToolNames = ["host.health", "host.capabilities", "mission.validate", "mission.compile", "mission.preview", "mission.status.preview", "guard.evaluate.preview", "guard.receipt.preview", "registry.agent_card.validate", "registry.tool_manifest.validate", "registry.manifest.diff.preview", "registry.trust.preview", "policy.hard_stops", "policy.autonomy.summary"];
const repoToolNames = ["repo.status.summary", "repo.metadata.read", "repo.branch.read", "repo.pr.list", "repo.pr.read", "repo.issue.list", "repo.issue.read", "repo.workflow.status.read", "repo.file.metadata.read", "repo.file.content.read"];
const memoryToolNames = ["memory.graph.preview", "memory.node.search.preview", "memory.context.preview", "memory.retention.preview"];
const codeopsToolNames = ["codeops.write.plan.preview", "codeops.branch.write.preview", "codeops.branch.write.fixture", "codeops.write.receipt.preview"];
const unsafeName = /repo\.commit\.live|repo\.file\.write\.live|workflow\.dispatch|deploy|payment|purchase|production/i;
const privateKeyHeaderPattern = `BEGIN (RSA|OPENSSH|EC|DSA) ${"PRIVATE"} ${"KEY"}`;
const secretLike = new RegExp([`client_${"secret"}`, `private_${"key"}`, `oauth_${"secret"}`, `${"AK"}${"IA"}[0-9A-Z]{16}`, privateKeyHeaderPattern].join("|"), "i");
const prodEndpointLike = /https?:\/\//i;

function tool(name: string): McpServerToolDescriptor {
  const found = createToolRegistry().find((candidate) => candidate.name === name);
  if (!found) throw new Error(`Missing test tool: ${name}`);
  return found;
}

describe("Build 14 MCP server transport package", () => {
  it("server metadata validates", () => {
    const metadata = ServerMetadataSchema.parse(getServerMetadata());
    expect(metadata.build).toBe(14);
    expect(metadata.official_mcp_aligned).toBe(true);
    expect(metadata.production_ready).toBe(false);
    expect(metadata.unrestricted_live_write_tools).toBe(false);
  });

  it("protocol/version metadata validates", () => {
    const protocol = ProtocolMetadataSchema.parse(getProtocolMetadata());
    expect(protocol.protocol_version).toBe("2025-06-18");
    expect(protocol.methods).toContain("tools/list");
    expect(protocol.methods).toContain("resources/read");
    expect(protocol.official_docs_checked.length).toBeGreaterThanOrEqual(3);
  });

  it("transport mode schemas validate", () => {
    expect(TransportModeSchema.parse("in_process")).toBe("in_process");
    expect(TransportModeSchema.parse("stdio_dev")).toBe("stdio_dev");
    expect(TransportModeSchema.parse("http_dev_preview")).toBe("http_dev_preview");
    expect(TransportModeSchema.parse("hosted_future")).toBe("hosted_future");
  });

  it("tool registry lists existing runtime tools", () => {
    const registryNames = createToolRegistry().map((candidate) => candidate.name);
    for (const name of [...appHostToolNames, ...repoToolNames, ...memoryToolNames, ...codeopsToolNames]) expect(registryNames).toContain(name);
    expect(registryNames.length).toBe(listRuntimeTools().length);
  });

  it("resource registry lists resources", () => {
    const resources = listServerResources();
    expect(resources.length).toBeGreaterThan(5);
    expect(resources.some((resource) => resource.uri.includes("mcp-server/metadata"))).toBe(true);
    expect(resources.every((resource) => resource.readOnly)).toBe(true);
  });

  it("duplicate tool names are rejected", () => {
    const first = createToolRegistry()[0];
    expect(first).toBeDefined();
    expect(() => assertNoDuplicateToolNames([first!, first!])).toThrow(/Duplicate MCP server tool name/);
  });

  it("unsafe descriptor is rejected", () => {
    const unsafe = { ...tool("host.health"), name: "unsafe.live.write", safety: { ...tool("host.health").safety, liveWrite: true } } as unknown as McpServerToolDescriptor;
    expect(() => McpServerToolDescriptorSchema.parse(unsafe)).toThrow();
  });

  it("App Host tools are exposed safely", () => {
    for (const name of appHostToolNames) {
      const descriptor = tool(name);
      expect(descriptor.sourcePackage).toBe("@stealtheye/app-host");
      expect(descriptor.safety.readOnly).toBe(true);
      expect(descriptor.safety.previewOnly || descriptor.safety.fixtureOnly).toBe(true);
      expect(assertServerToolDescriptorSafe(descriptor)).toBe(true);
    }
  });

  it("repo/status tools remain read-only", () => {
    for (const name of repoToolNames) {
      const descriptor = tool(name);
      expect(descriptor.sourcePackage).toBe("@stealtheye/repo-status");
      expect(descriptor.safety.readOnly).toBe(true);
      expect(descriptor.safety.liveCapabilityStatus).toBe("read_only_live");
      expect(descriptor.safety.liveWrite).toBe(false);
    }
  });

  it("memory graph tools remain preview/fixture-only", () => {
    for (const name of memoryToolNames) {
      const descriptor = tool(name);
      expect(descriptor.sourcePackage).toBe("@stealtheye/memory-graph");
      expect(descriptor.safety.previewOnly).toBe(true);
      expect(descriptor.safety.fixtureOnly).toBe(true);
      expect(descriptor.safety.live).toBe(false);
    }
  });

  it("CodeOps write preview tools remain preview-only", () => {
    for (const name of ["codeops.write.plan.preview", "codeops.branch.write.preview", "codeops.write.receipt.preview"]) {
      const descriptor = tool(name);
      expect(descriptor.sourcePackage).toBe("@stealtheye/codeops");
      expect(descriptor.safety.previewOnly).toBe(true);
      expect(descriptor.safety.liveWrite).toBe(false);
      expect(descriptor.safety.destructive).toBe(false);
    }
  });

  it("CodeOps fixture tool remains fixture-only and non-destructive", () => {
    const descriptor = tool("codeops.branch.write.fixture");
    expect(descriptor.safety.fixtureOnly).toBe(true);
    expect(descriptor.safety.readOnly).toBe(false);
    expect(descriptor.safety.destructive).toBe(false);
    expect(descriptor.safety.productionMutation).toBe(false);
  });

  it("no unrestricted live write, destructive, production, protected branch, secret, customer-data, or money tools are exposed", () => {
    for (const descriptor of createToolRegistry()) {
      expect(descriptor.name).not.toMatch(unsafeName);
      expect(descriptor.safety.unrestrictedLiveWrite).toBe(false);
      expect(descriptor.safety.liveWrite).toBe(false);
      expect(descriptor.safety.destructive).toBe(false);
      expect(descriptor.safety.productionMutation).toBe(false);
      expect(descriptor.safety.protectedBranchMutation).toBe(false);
      expect(descriptor.safety.secretAccess).toBe(false);
      expect(descriptor.safety.customerData).toBe(false);
      expect(descriptor.safety.moneyMovement).toBe(false);
      expect(descriptor.annotations.destructiveHint).toBe(false);
      expect(descriptor.annotations.openWorldHint).toBe(false);
    }
  });

  it("tool call receipt preview generated", async () => {
    const result = await createMcpServer().callTool("host.health");
    expect(result.ok).toBe(true);
    expect(result.mcp_server_receipt.tool_name).toBe("host.health");
    expect(result.mcp_server_receipt.no_secret_statement).toContain("No secrets");
    expect(result.mcp_server_receipt.no_production_statement).toContain("No production endpoint");
    expect(result.mcp_server_receipt.no_money_statement).toContain("No money movement");
  });

  it("health helper works", () => {
    const health = getMcpServerHealth();
    expect(health.status).toBe("ok");
    expect(health.build).toBe(14);
    expect(health.production_ready).toBe(false);
  });

  it("capabilities summary works", () => {
    const capabilities = getMcpServerCapabilities();
    expect(capabilities.tool_sources).toContain("@stealtheye/codeops");
    expect(capabilities.unrestricted_live_write_tools).toBe(false);
    expect(capabilities.safety_inventory.safety_truth_preserved).toBe(true);
  });

  it("transport diagnostics work", async () => {
    expect(getTransportDiagnostics("in_process").modes.in_process.implemented).toBe(true);
    expect(getTransportDiagnostics("stdio_dev").modes.stdio_dev.implemented).toBe(true);
    expect(createHttpDevPreviewTransport().implemented).toBe(false);
    expect(createHostedFutureTransport().public_app_submitted).toBe(false);
    const stdio = createStdioDevTransport();
    expect((await stdio.handle({ method: "GET", path: "/health" })).status).toBe(200);
    expect((await stdio.handle({ method: "POST", path: "/tools/call", body: { name: "codeops.branch.write.fixture" } })).status).toBe(200);
    const inProcess = createInProcessTransport();
    expect((await inProcess.callTool("repo.metadata.read")).ok).toBe(true);
  });

  it("dev connection manifest contains no secrets or production endpoints", () => {
    const manifest = createDevConnectionManifest();
    const serialized = JSON.stringify(manifest);
    expect(manifest.contains_secret_material).toBe(false);
    expect(manifest.contains_production_endpoint).toBe(false);
    expect(manifest.contains_public_app_id).toBe(false);
    expect(manifest.contains_oauth_client).toBe(false);
    expect(serialized).not.toMatch(secretLike);
    expect(serialized).not.toMatch(prodEndpointLike);
  });

  it("official SDK adapter boundary is covered", () => {
    const metadata = getServerMetadata();
    expect(metadata.official_sdk_package_used).toBe(false);
    expect(metadata.sdk_adapter_boundary).toBe(true);
    expect(getTransportDiagnostics().official_sdk_adapter_boundary).toBe(true);
    expect(createToolRegistry().every((descriptor) => descriptor.officialMcpAligned && descriptor.sdkAdapterBoundary)).toBe(true);
  });

  it("resources can be read", () => {
    const resource = listServerResources().find((candidate) => candidate.uri.includes("mcp-server/capabilities"));
    expect(resource).toBeTruthy();
    const read = readServerResource(resource!.uri);
    expect(read.readOnly).toBe(true);
    expect(read.public_safe).toBe(true);
  });

  it("descriptor validation preserves runtime safety truth", () => {
    for (const runtimeTool of listRuntimeTools()) {
      const descriptor = toServerToolDescriptor(runtimeTool);
      expect(descriptor.safety.readOnly).toBe(runtimeTool.safety.readOnly);
      expect(descriptor.safety.previewOnly).toBe(runtimeTool.safety.previewOnly);
      expect(descriptor.safety.fixtureOnly).toBe(runtimeTool.safety.fixtureOnly);
    }
  });

  it("generated state strict sync, protected docs, and sensitive fixture checks have test anchors", () => {
    const serialized = JSON.stringify({ tools: createToolRegistry(), resources: listServerResources(), manifest: createDevConnectionManifest(), inventory: createSafetyInventory() });
    const manifestSerialized = JSON.stringify(createDevConnectionManifest());
    expect(serialized).not.toMatch(secretLike);
    expect(manifestSerialized).not.toMatch(prodEndpointLike);
    expect(serialized).toContain("sdkAdapterBoundary");
    expect(serialized).toContain("safety_truth_preserved");
  });
});
