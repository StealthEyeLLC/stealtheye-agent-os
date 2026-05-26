import { listRuntimeResources, readRuntimeResource } from "@stealtheye/mcp-runtime";
import { createControlledLocalhostPreviewReadinessReport } from "./controlled-localhost-command";
import { createDeveloperModeResourceConnectionManifest } from "./developer-mode-resource-connection";
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
    { uri: BUILD_21_RESOURCE_URIS.developerModeResourceConnectionManifest, name: "Developer-Mode Resource Connection Manifest", description: "Build 21 read-only developer-mode connection metadata for future safe local endpoint configuration." }
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
  else return readRuntimeResource(uri);
  return { schema_version: "stealtheye-mcp-server-resource-read-result.v1", uri, mimeType: "application/json", contents, readOnly: true, public_safe: true };
}
