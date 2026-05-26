import { ControlPlaneActionSchema, type ControlPlaneAction, type ControlPlaneActionName, type ControlPlaneViewId } from "./schemas";

const actionMap: Array<[ControlPlaneActionName, string, ControlPlaneViewId, string, ControlPlaneAction["category"]]> = [
  ["view_overview", "View overview", "overview", "major_subsystems", "navigation"],
  ["view_missions", "View missions", "missions", "mission_os_status", "navigation"],
  ["view_agents", "View agents", "agents", "registry_status", "navigation"],
  ["view_tools", "View tools", "tools", "tool_inventory", "navigation"],
  ["view_guard_decisions", "View guard decisions", "guard", "guard_status", "navigation"],
  ["view_receipts", "View receipts", "receipts", "receipt_previews", "navigation"],
  ["view_replay", "View replay", "replay", "replay_preview", "navigation"],
  ["view_memory", "View memory", "memory", "memory_graph_status", "navigation"],
  ["view_repo_status", "View repo status", "repo_status", "repo_status_capability", "navigation"],
  ["view_codeops", "View CodeOps", "codeops", "codeops_status", "navigation"],
  ["view_browserops", "View BrowserOps", "browserops", "browserops_status", "navigation"],
  ["view_worker_fleet", "View worker fleet", "worker_fleet", "worker_fleet_status", "navigation"],
  ["view_mcp_server", "View MCP server", "mcp_server", "mcp_server_status", "navigation"],
  ["view_dev_endpoint", "View dev endpoint", "dev_endpoint", "dev_endpoint_readiness", "navigation"],
  ["view_chatgpt_developer_mode", "View ChatGPT developer mode", "chatgpt_developer_mode", "connection_readiness", "navigation"],
  ["preview_mission_compile", "Preview mission compile", "missions", "mission_compile_preview", "fixture_preview"],
  ["preview_guard_decision", "Preview guard decision", "guard", "guard_status", "fixture_preview"],
  ["preview_codeops_plan", "Preview CodeOps plan", "codeops", "codeops_status", "fixture_preview"],
  ["preview_browserops_plan", "Preview BrowserOps plan", "browserops", "browserops_status", "fixture_preview"],
  ["preview_memory_context", "Preview memory context", "memory", "memory_graph_status", "fixture_preview"],
  ["preview_receipt_report", "Preview receipt report", "receipts", "receipt_previews", "fixture_preview"],
  ["refresh_fixture_state", "Refresh fixture state", "settings_safe", "settings_boundary", "refresh_fixture_state"]
];

export function createControlPlaneActions(): ControlPlaneAction[] {
  return actionMap.map(([name, label, view, panel, category]) => ControlPlaneActionSchema.parse({ name, label, view, panel, category, fixture_only: true, preview_only: true, read_only: category !== "fixture_preview" ? true : false }));
}

export function findControlPlaneAction(name: ControlPlaneActionName) {
  const action = createControlPlaneActions().find((candidate) => candidate.name === name);
  if (!action) throw new Error(`Unknown control-plane action: ${name}`);
  return action;
}
