import { createMcpServer } from "./server";
import { MCP_SERVER_ID } from "./fixtures";
import { McpServerSchemaVersion, TransportModeSchema, type TransportMode } from "./schemas";

export interface McpServerTransportRequest { method: "GET" | "POST"; path: string; body?: unknown; }
export interface McpServerTransportResponse { status: number; json: unknown; }

export function getTransportDiagnostics(mode: TransportMode = "in_process") {
  const parsedMode = TransportModeSchema.parse(mode);
  return {
    schema_version: McpServerSchemaVersion.TransportDiagnostics,
    server_id: MCP_SERVER_ID,
    requested_mode: parsedMode,
    modes: {
      in_process: { implemented: true, local_dev_only: true, network_bound: false, production_endpoint: false },
      stdio_dev: { implemented: true, local_dev_only: true, network_bound: false, production_endpoint: false },
      http_dev_preview: { implemented: false, modeled: true, local_dev_only: true, production_endpoint: false },
      hosted_future: { implemented: false, modeled: true, local_dev_only: false, production_endpoint: false }
    },
    official_sdk_adapter_boundary: true,
    official_sdk_package_used: false,
    public_endpoint_bound: false,
    production_hosting_configured: false,
    oauth_production_client_configured: false,
    unrestricted_live_write_available: false
  };
}

export function createInProcessTransport(server = createMcpServer()) {
  return {
    mode: "in_process" as const,
    local_dev_only: true,
    diagnostics: () => getTransportDiagnostics("in_process"),
    async initialize() { return { status: 200, json: { server: server.metadata, protocol: server.protocol, capabilities: server.capabilities() } }; },
    listTools: server.listTools,
    callTool: server.callTool,
    listResources: server.listResources,
    readResource: server.readResource
  };
}

export function createStdioDevTransport(server = createMcpServer()) {
  return {
    mode: "stdio_dev" as const,
    local_dev_only: true,
    diagnostics: () => getTransportDiagnostics("stdio_dev"),
    async handle(request: McpServerTransportRequest): Promise<McpServerTransportResponse> {
      if (request.method === "GET" && request.path === "/health") return { status: 200, json: server.health() };
      if (request.method === "GET" && request.path === "/metadata") return { status: 200, json: server.metadata };
      if (request.method === "GET" && request.path === "/protocol") return { status: 200, json: server.protocol };
      if (request.method === "GET" && request.path === "/capabilities") return { status: 200, json: server.capabilities() };
      if (request.method === "GET" && request.path === "/tools") return { status: 200, json: server.listTools() };
      if (request.method === "GET" && request.path === "/resources") return { status: 200, json: server.listResources() };
      if (request.method === "GET" && request.path === "/dev-connection") return { status: 200, json: server.devConnectionManifest() };
      if (request.method === "POST" && request.path === "/tools/call") {
        const body = request.body as { name?: string; input?: unknown };
        if (!body?.name) return { status: 400, json: { ok: false, error: "missing tool name" } };
        return { status: 200, json: await server.callTool(body.name, body.input ?? {}, "stdio_dev") };
      }
      if (request.method === "POST" && request.path === "/resources/read") {
        const body = request.body as { uri?: string };
        if (!body?.uri) return { status: 400, json: { ok: false, error: "missing resource uri" } };
        return { status: 200, json: server.readResource(body.uri) };
      }
      return { status: 404, json: { ok: false, error: "unknown stdio dev transport route" } };
    }
  };
}

export function createHttpDevPreviewTransport() {
  return {
    mode: "http_dev_preview" as const,
    implemented: false,
    modeled: true,
    production_endpoint: false,
    diagnostics: () => getTransportDiagnostics("http_dev_preview")
  };
}

export function createHostedFutureTransport() {
  return {
    mode: "hosted_future" as const,
    implemented: false,
    modeled: true,
    production_endpoint: false,
    public_app_submitted: false,
    diagnostics: () => getTransportDiagnostics("hosted_future")
  };
}
