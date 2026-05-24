import { APP_HOST_RESOURCES, readAppHostResource } from "@stealtheye/app-host";
import { createDevModeConnectionInfo } from "./dev-mode";
import { MCP_RUNTIME_ID, RUNTIME_RESOURCE_URIS } from "./fixtures";
import { McpRuntimeSchemaVersion, RuntimeResourceDescriptorSchema, RuntimeResourceReadResultSchema, type RuntimeResourceDescriptor, type RuntimeResourceReadResult } from "./schemas";
export function listRuntimeResources(): RuntimeResourceDescriptor[] {
  const appHostResources = APP_HOST_RESOURCES.map((resource) => RuntimeResourceDescriptorSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeResourceDescriptor, uri: resource.uri, name: resource.name, description: resource.description, mimeType: "application/json", readOnly: true, fixtureOnly: true, public_safe: true }));
  return [...appHostResources, RuntimeResourceDescriptorSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeResourceDescriptor, uri: RUNTIME_RESOURCE_URIS.runtime, name: "MCP Runtime Metadata", description: "Public-safe local/dev runtime metadata for Build 10.", mimeType: "application/json", readOnly: true, fixtureOnly: true, public_safe: true }), RuntimeResourceDescriptorSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeResourceDescriptor, uri: RUNTIME_RESOURCE_URIS.devMode, name: "ChatGPT Developer Mode Connection Info", description: "Fixture-safe connection metadata for later ChatGPT developer-mode wiring.", mimeType: "application/json", readOnly: true, fixtureOnly: true, public_safe: true })];
}
export function readRuntimeResource(uri: string): RuntimeResourceReadResult {
  const known = listRuntimeResources().find((resource) => resource.uri === uri);
  if (!known) throw new Error(`Unknown runtime resource URI: ${uri}`);
  const contents = uri === RUNTIME_RESOURCE_URIS.runtime ? { runtime_id: MCP_RUNTIME_ID, build: 10, mode: "local_dev_preview", production_ready: false, live_write_tools: false } : uri === RUNTIME_RESOURCE_URIS.devMode ? createDevModeConnectionInfo() : readAppHostResource(uri);
  return RuntimeResourceReadResultSchema.parse({ schema_version: McpRuntimeSchemaVersion.RuntimeResourceReadResult, uri, mimeType: "application/json", contents, public_safe: true, readOnly: true });
}
