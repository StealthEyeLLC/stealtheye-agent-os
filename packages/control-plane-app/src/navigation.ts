import { ControlPlaneNavigationSchema, type ControlPlaneViewId } from "./schemas";
import { createControlPlaneViews } from "./views";

export const CONTROL_PLANE_VIEW_IDS: ControlPlaneViewId[] = ["overview", "missions", "agents", "tools", "guard", "receipts", "replay", "memory", "repo_status", "codeops", "browserops", "worker_fleet", "mcp_server", "dev_endpoint", "chatgpt_developer_mode", "settings_safe"];

export function createControlPlaneNavigation() {
  return ControlPlaneNavigationSchema.parse({
    schema_version: "stealtheye-control-plane-navigation.v1",
    default_view: "overview",
    views: createControlPlaneViews(),
    safe_settings_view: "settings_safe"
  });
}
