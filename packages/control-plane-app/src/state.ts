import { ControlPlaneStateSnapshotSchema } from "./schemas";

export const CONTROL_PLANE_PACKAGE_INVENTORY = [
  "@stealtheye/agent-registry",
  "@stealtheye/guard",
  "@stealtheye/mission-os",
  "@stealtheye/app-host",
  "@stealtheye/worker-fleet",
  "@stealtheye/codeops",
  "@stealtheye/browserops",
  "@stealtheye/receipts-replay",
  "@stealtheye/mcp-runtime",
  "@stealtheye/repo-status",
  "@stealtheye/memory-graph",
  "@stealtheye/mcp-server",
  "@stealtheye/dev-endpoint",
  "@stealtheye/chatgpt-dev-connection",
  "@stealtheye/control-plane-app"
];

export const CONTROL_PLANE_BOUNDARIES = [
  "No production frontend deployment is created.",
  "No public app submission is performed.",
  "No production OAuth credential, real app ID, production domain, public deployed endpoint, tunnel token, cloud credential, or private key is added.",
  "No unrestricted live write, protected branch mutation, destructive action, production mutation, customer/private data workflow, material external send, or money movement action is exposed.",
  "The control plane app is model/fixture/preview-only."
];

const status = (pkg: string, statusValue: "modeled" | "preview" | "read_only" | "blocked_future", summary: string) => ({ package: pkg, status: statusValue, summary });

export function createControlPlaneStateSnapshot() {
  return ControlPlaneStateSnapshotSchema.parse({
    schema_version: "stealtheye-control-plane-state-snapshot.v1",
    current_build: 17,
    package_inventory: CONTROL_PLANE_PACKAGE_INVENTORY,
    mission_os_status: status("@stealtheye/mission-os", "modeled", "Mission OS language, planning, authority envelopes, status, and receipt helpers are summarized for preview."),
    guard_status: status("@stealtheye/guard", "modeled", "Guard policy and decision boundaries are represented before every action preview."),
    registry_status: status("@stealtheye/agent-registry", "read_only", "Agent registry manifests and public-safe registry metadata are shown read-only."),
    worker_fleet_status: status("@stealtheye/worker-fleet", "preview", "Worker fleet capability and dispatch modeling remain fixture/preview-only."),
    codeops_status: status("@stealtheye/codeops", "preview", "CodeOps branch-write planning remains preview-only with no protected branch mutation path."),
    browserops_status: status("@stealtheye/browserops", "preview", "BrowserOps planning is displayed as public-safe fixtures only."),
    receipts_replay_status: status("@stealtheye/receipts-replay", "preview", "Receipt previews and replay reports are summarized without a durable ledger."),
    memory_graph_status: status("@stealtheye/memory-graph", "preview", "Memory Graph context is fixture-only and contains no customer/private data."),
    repo_status_capability: status("@stealtheye/repo-status", "read_only", "Repo status is modeled as a read-only capability summary."),
    mcp_server_status: status("@stealtheye/mcp-server", "modeled", "MCP server metadata, tools, resources, health, and safety inventory are summarized."),
    dev_endpoint_readiness: status("@stealtheye/dev-endpoint", "blocked_future", "Dev endpoint readiness is local/dev or placeholder-only; no public hosted endpoint is configured."),
    chatgpt_developer_mode_readiness: status("@stealtheye/chatgpt-dev-connection", "blocked_future", "ChatGPT developer-mode connection remains fixture/planning-only until a later manual safe connection."),
    known_gaps: [
      "No production frontend, hosted app, real app auth, public app submission, or production OAuth exists.",
      "No real user data, customer/private data workflow, unrestricted live write path, protected branch mutation path, destructive action path, production mutation path, material external send path, or money movement path exists.",
      "First UI/component resources remain future Build 18 work."
    ],
    next_recommended_action: "Build 18 — Control Plane UI Component Resources",
    safety_boundaries: CONTROL_PLANE_BOUNDARIES
  });
}
