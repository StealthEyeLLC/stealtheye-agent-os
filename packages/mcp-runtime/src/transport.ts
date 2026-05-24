import { createMcpRuntimeServer } from "./server";
export interface RuntimeHttpLikeRequest { method: "GET" | "POST"; path: string; body?: unknown; }
export interface RuntimeHttpLikeResponse { status: number; json: unknown; }
export function createLocalDevTransport(server = createMcpRuntimeServer()) {
  return { local_dev_only: true, bind_default: "127.0.0.1", routes: ["GET /health", "GET /capabilities", "GET /metadata", "GET /dev-mode", "POST /tools/call", "GET /resources", "POST /resources/read"], handle(request: RuntimeHttpLikeRequest): RuntimeHttpLikeResponse {
    if (request.method === "GET" && request.path === "/health") return { status: 200, json: server.health() };
    if (request.method === "GET" && request.path === "/capabilities") return { status: 200, json: server.capabilities() };
    if (request.method === "GET" && request.path === "/metadata") return { status: 200, json: server.metadata };
    if (request.method === "GET" && request.path === "/dev-mode") return { status: 200, json: server.devMode() };
    if (request.method === "GET" && request.path === "/resources") return { status: 200, json: server.listResources() };
    if (request.method === "POST" && request.path === "/tools/call") { const body = request.body as { name?: string; input?: unknown }; if (!body?.name) return { status: 400, json: { ok: false, error: "missing tool name" } }; return { status: 200, json: server.callTool(body.name, body.input ?? {}) }; }
    if (request.method === "POST" && request.path === "/resources/read") { const body = request.body as { uri?: string }; if (!body?.uri) return { status: 400, json: { ok: false, error: "missing resource uri" } }; return { status: 200, json: server.readResource(body.uri) }; }
    return { status: 404, json: { ok: false, error: "unknown local/dev runtime route" } };
  } };
}
