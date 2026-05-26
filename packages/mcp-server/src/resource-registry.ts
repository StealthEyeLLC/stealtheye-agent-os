import { listRuntimeResources, readRuntimeResource } from "@stealtheye/mcp-runtime";
import { createControlledLocalhostPreviewReadinessReport } from "./controlled-localhost-command";
import { createDeveloperModeResourceConnectionManifest } from "./developer-mode-resource-connection";
import { createManualDeveloperModeConnectionManifest } from "./manual-developer-mode-checklist";
import { createSafeLocalPreviewRunnerManualRunChecklist, createSafeLocalPreviewRunnerReadinessReport, createSafeLocalPreviewRunnerReceiptPreview } from "./safe-local-preview-runner";
import { MCP_SERVER_RESOURCE_URIS } from "./fixtures";
import { McpServerSchemaVersion, McpServerResourceDescriptorSchema, type McpServerResourceDescriptor } from "./schemas";
import { createSafetyInventory } from "./tool-registry";
import { createDevConnectionManifest, getMcpServerCapabilities, getMcpServerHealth, getProtocolMetadata, getServerMetadata } from "./server";
import { getTransportDiagnostics } from "./transport";
import { isMcpUiResourceUri, listMcpUiResourceDescriptors, readMcpUiResource } from "./ui-resource-adapter";

export const BUILD_21_RESOURCE_URIS = {
  controlledLocalhostPreviewReadiness: "controlled-localhost-preview://stealtheye/control-plane/readiness",
  developerModeResourceConnectionManifest: "developer-mode-resource-connection://stealtheye/control-plane/manifest"
} as const;

export const BUILD_22_RESOURCE_URIS = {
  safeLocalPreviewRunnerReadiness: "safe-local-preview-runner://stealtheye/control-plane/readiness",
  safeLocalPreviewRunnerManualRunChecklist: "safe-local-preview-runner://stealtheye/control-plane/manual-run-checklist",
  developerModeManualConnectionChecklist: "developer-mode-checklist://stealtheye/control-plane/manual-connection",
  safeLocalPreviewRunnerReceiptPreview: "safe-local-preview-runner://stealtheye/control-plane/receipt-preview"
} as const;

export function listServerResources(): McpServerResourceDescriptor[] {
  const runtimeResources = listRuntimeResources().map((resource) => McpServerResourceDescriptorSchema.parse({
    schema_version: McpServerSchemaVersion.ResourceDescriptor,
    uri: resource.uri,
    name: resource.name,
    description: resource.description,
    mimeType: "application/json",
    readOnly: true,
    fixtureOnly: resource.fixtureOnly,
    public_safe: true,
    sourcePackage: "@stealtheye/mcp-runtime"
  }));
  const serverResources = [
    { uri: MCP_SERVER_RESOURCE_URIS.metadata, name: "MCP Server Metadata", description: "Official-MCP-aligned server metadata for Build 14." },
    { uri: MCP_SERVER_RESOURCE_URIS.health, name: "MCP Server Health", description: "Health status for the local/dev server wrapper." },
    { uri: MCP_SERVER_RESOURCE_URIS.capabilities, name: "MCP Server Capabilities", description: "Capability summary and safety boundaries." },
    { uri: MCP_SERVER_RESOURCE_URIS.devConnectionManifest, name: "MCP Server Dev Connection Manifest", description: "Public-safe local/dev connection manifest for ChatGPT developer-mode preparation." },
    { uri: MCP_SERVER_RESOURCE_URIS.safetyInventory, name: "MCP Server Safety Inventory", description: "Tool safety inventory preserving read-only, preview-only, and fixture-only truth." },
    { uri: MCP_SERVER_RESOURCE_URIS.transportDiagnostics, name: "MCP Server Transport Diagnostics", description: "Transport mode diagnostics for in-process, stdio dev, HTTP dev preview, and hosted future modes." },
    { uri: BUILD_21_RESOURCE_URIS.controlledLocalhostPreviewReadiness, name: "Controlled Localhost Preview Readiness", description: "Build 21 command/readiness metadata; no process start and no default server binding." },
    { uri: BUILD_21_RESOURCE_URIS.developerModeResourceConnectionManifest, name: "Developer-Mode Resource Connection Manifest", description: "Build 21 read-only developer-mode connection metadata for future safe local endpoint configuration." },
    { uri: BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerReadiness, name: "Safe Local Preview Runner Readiness", description: "Build 22 safe local preview runner readiness metadata; no default server binding and no default-mode process start." },
    { uri: BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerManualRunChecklist, name: "Safe Local Preview Runner Manual Run Checklist", description: "Build 22 manual-run checklist for local preview prerequisites and safety boundaries." },
    { uri: BUILD_22_RESOURCE_URIS.developerModeManualConnectionChecklist, name: "Manual Developer-Mode Connection Checklist", description: "Build 22 manual developer-mode connection checklist; no real app creation, submission, OAuth, tunnel, or public endpoint." },
    { uri: BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerReceiptPreview, name: "Safe Local Preview Runner Receipt Preview", description: "Build 22 public-safe receipt preview and handoff evidence metadata." }
  ].map((resource) => McpServerResourceDescriptorSchema.parse({
    schema_version: McpServerSchemaVersion.ResourceDescriptor,
    ...resource,
    mimeType: "application/json",
    readOnly: true,
    fixtureOnly: true,
    public_safe: true,
    sourcePackage: "@stealtheye/mcp-server"
  }));
  return [...runtimeResources, ...serverResources, ...listMcpUiResourceDescriptors()];
}

export function readServerResource(uri: string) {
  const known = listServerResources().find((resource) => resource.uri === uri);
  if (!known) throw new Error(`Unknown MCP server resource URI: ${uri}`);
  if (isMcpUiResourceUri(uri)) return readMcpUiResource(uri);
  let contents: unknown;
  if (uri === MCP_SERVER_RESOURCE_URIS.metadata) contents = getServerMetadata();
  else if (uri === MCP_SERVER_RESOURCE_URIS.health) contents = getMcpServerHealth();
  else if (uri === MCP_SERVER_RESOURCE_URIS.capabilities) contents = getMcpServerCapabilities();
  else if (uri === MCP_SERVER_RESOURCE_URIS.devConnectionManifest) contents = createDevConnectionManifest();
  else if (uri === MCP_SERVER_RESOURCE_URIS.safetyInventory) contents = createSafetyInventory();
  else if (uri === MCP_SERVER_RESOURCE_URIS.transportDiagnostics) contents = getTransportDiagnostics();
  else if (uri === BUILD_21_RESOURCE_URIS.controlledLocalhostPreviewReadiness) contents = createControlledLocalhostPreviewReadinessReport();
  else if (uri === BUILD_21_RESOURCE_URIS.developerModeResourceConnectionManifest) contents = createDeveloperModeResourceConnectionManifest();
  else if (uri === BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerReadiness) contents = createSafeLocalPreviewRunnerReadinessReport();
  else if (uri === BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerManualRunChecklist) contents = createSafeLocalPreviewRunnerManualRunChecklist("manual_config_required");
  else if (uri === BUILD_22_RESOURCE_URIS.developerModeManualConnectionChecklist) contents = createManualDeveloperModeConnectionManifest();
  else if (uri === BUILD_22_RESOURCE_URIS.safeLocalPreviewRunnerReceiptPreview) contents = createSafeLocalPreviewRunnerReceiptPreview("manual_config_required");
  else return readRuntimeResource(uri);
  return { schema_version: "stealtheye-mcp-server-resource-read-result.v1", uri, mimeType: "application/json", contents, readOnly: true, public_safe: true };
}
