import { ControlPlaneViewSchema, type ControlPlanePanel, type ControlPlaneView } from "./schemas";
import { createControlPlaneStateSnapshot } from "./state";

function panel(id: string, title: string, summary: string, package_refs: string[], status: ControlPlanePanel["status"] = "preview"): ControlPlanePanel {
  return { id, title, summary, status, package_refs, data_classification: "public_fixture_only" };
}

function view(input: ControlPlaneView): ControlPlaneView {
  return ControlPlaneViewSchema.parse(input);
}

export function createControlPlaneViews() {
  const snapshot = createControlPlaneStateSnapshot();
  const majorSubsystems = snapshot.package_inventory.filter((name) => name !== "@stealtheye/control-plane-app");
  return [
    view({ id: "overview", title: "Overview", description: "Public-safe control surface summary for all modeled subsystems.", default_action: "view_overview", preview_only: true, read_only: true, panels: [panel("major_subsystems", "Major subsystems", `Includes ${majorSubsystems.join(", ")}.`, majorSubsystems, "ok"), panel("build_state", "Build state", "Build 17 model/fixture/preview-only app state is current.", ["@stealtheye/control-plane-app"], "preview")] }),
    view({ id: "missions", title: "Missions", description: "Mission OS planning and compile preview surface.", default_action: "view_missions", preview_only: true, read_only: true, panels: [panel("mission_os_status", "Mission OS status", snapshot.mission_os_status.summary, ["@stealtheye/mission-os"]), panel("mission_compile_preview", "Mission compile preview", "Preview-only mission compilation; no live execution.", ["@stealtheye/mission-os", "@stealtheye/guard"])] }),
    view({ id: "agents", title: "Agents", description: "Agent registry and worker organization summary.", default_action: "view_agents", preview_only: true, read_only: true, panels: [panel("registry_status", "Agent Registry status", snapshot.registry_status.summary, ["@stealtheye/agent-registry"], "ok"), panel("worker_summary", "Worker summary", snapshot.worker_fleet_status.summary, ["@stealtheye/worker-fleet"])] }),
    view({ id: "tools", title: "Tools", description: "Public-safe tool inventory summary.", default_action: "view_tools", preview_only: true, read_only: true, panels: [panel("tool_inventory", "Tool inventory", "Only navigation, read-only summaries, and fixture previews are exposed.", ["@stealtheye/mcp-server", "@stealtheye/codeops", "@stealtheye/browserops"])] }),
    view({ id: "guard", title: "Guard", description: "Guard decisions and app safety boundaries.", default_action: "view_guard_decisions", preview_only: true, read_only: true, panels: [panel("guard_status", "Guard status", snapshot.guard_status.summary, ["@stealtheye/guard"], "ok"), panel("safety_boundaries", "Safety boundaries", snapshot.safety_boundaries.join(" "), ["@stealtheye/control-plane-app", "@stealtheye/guard"], "ok")] }),
    view({ id: "receipts", title: "Receipts", description: "Receipt preview summary surface.", default_action: "view_receipts", preview_only: true, read_only: true, panels: [panel("receipt_previews", "Receipt previews", snapshot.receipts_replay_status.summary, ["@stealtheye/receipts-replay"])] }),
    view({ id: "replay", title: "Replay", description: "Replay report preview surface.", default_action: "view_replay", preview_only: true, read_only: true, panels: [panel("replay_preview", "Replay preview", "Replay report planning remains fixture-only; no durable ledger is added.", ["@stealtheye/receipts-replay"])] }),
    view({ id: "memory", title: "Memory", description: "Memory Graph context preview surface.", default_action: "view_memory", preview_only: true, read_only: true, panels: [panel("memory_graph_status", "Memory Graph status", snapshot.memory_graph_status.summary, ["@stealtheye/memory-graph"])] }),
    view({ id: "repo_status", title: "Repo Status", description: "Read-only repo status capability summary.", default_action: "view_repo_status", preview_only: true, read_only: true, panels: [panel("repo_status_capability", "Repo Status capability", snapshot.repo_status_capability.summary, ["@stealtheye/repo-status"], "ok")] }),
    view({ id: "codeops", title: "CodeOps", description: "CodeOps planning preview surface.", default_action: "view_codeops", preview_only: true, read_only: true, panels: [panel("codeops_status", "CodeOps status", snapshot.codeops_status.summary, ["@stealtheye/codeops"])] }),
    view({ id: "browserops", title: "BrowserOps", description: "BrowserOps planning preview surface.", default_action: "view_browserops", preview_only: true, read_only: true, panels: [panel("browserops_status", "BrowserOps status", snapshot.browserops_status.summary, ["@stealtheye/browserops"])] }),
    view({ id: "worker_fleet", title: "Worker Fleet", description: "Worker Fleet model preview surface.", default_action: "view_worker_fleet", preview_only: true, read_only: true, panels: [panel("worker_fleet_status", "Worker Fleet status", snapshot.worker_fleet_status.summary, ["@stealtheye/worker-fleet"])] }),
    view({ id: "mcp_server", title: "MCP Server", description: "MCP server metadata and inventory surface.", default_action: "view_mcp_server", preview_only: true, read_only: true, panels: [panel("mcp_server_status", "MCP Server status", snapshot.mcp_server_status.summary, ["@stealtheye/mcp-server"], "ok")] }),
    view({ id: "dev_endpoint", title: "Dev Endpoint", description: "Dev endpoint readiness surface.", default_action: "view_dev_endpoint", preview_only: true, read_only: true, panels: [panel("dev_endpoint_readiness", "Dev Endpoint readiness", snapshot.dev_endpoint_readiness.summary, ["@stealtheye/dev-endpoint"], "blocked")] }),
    view({ id: "chatgpt_developer_mode", title: "ChatGPT Developer Mode", description: "ChatGPT developer-mode connection readiness surface.", default_action: "view_chatgpt_developer_mode", preview_only: true, read_only: true, panels: [panel("connection_readiness", "Connection readiness", snapshot.chatgpt_developer_mode_readiness.summary, ["@stealtheye/chatgpt-dev-connection"], "blocked")] }),
    view({ id: "settings_safe", title: "Safe Settings", description: "Safe settings summary; no credential entry or storage.", default_action: "refresh_fixture_state", preview_only: true, read_only: true, panels: [panel("settings_boundary", "Settings boundary", "Settings display is public-safe and does not collect credentials or production configuration.", ["@stealtheye/control-plane-app"], "ok")] })
  ];
}
