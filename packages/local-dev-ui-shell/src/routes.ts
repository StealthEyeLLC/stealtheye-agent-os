import { createControlPlaneUiComponents } from "@stealtheye/control-plane-ui";
import type { ControlPlaneUiComponentType } from "@stealtheye/control-plane-ui";
import type { LocalDevUiRoute } from "./schemas";

const routeSpecs: Array<{ path: string; title: string; component_type: ControlPlaneUiComponentType }> = [
  { path: "/", title: "Overview", component_type: "overview_dashboard" },
  { path: "/overview", title: "Overview", component_type: "overview_dashboard" },
  { path: "/missions", title: "Missions", component_type: "mission_list" },
  { path: "/agents", title: "Agents", component_type: "agent_registry" },
  { path: "/tools", title: "Tools", component_type: "tool_inventory" },
  { path: "/guard", title: "Guard Decisions", component_type: "guard_decisions" },
  { path: "/receipts", title: "Receipt Timeline", component_type: "receipt_timeline" },
  { path: "/replay", title: "Replay Report", component_type: "replay_report" },
  { path: "/memory", title: "Memory Context", component_type: "memory_context" },
  { path: "/repo-status", title: "Repo Status", component_type: "repo_status" },
  { path: "/codeops", title: "CodeOps", component_type: "codeops_panel" },
  { path: "/browserops", title: "BrowserOps", component_type: "browserops_panel" },
  { path: "/worker-fleet", title: "Worker Fleet", component_type: "worker_fleet" },
  { path: "/mcp-server", title: "MCP Server", component_type: "mcp_server_status" },
  { path: "/dev-endpoint", title: "Dev Endpoint", component_type: "dev_endpoint_status" },
  { path: "/chatgpt-developer-mode", title: "ChatGPT Developer Mode", component_type: "chatgpt_developer_mode_status" },
  { path: "/settings", title: "Safe Settings", component_type: "safe_settings" }
];

export const requiredLocalDevUiRoutePaths = routeSpecs.map((route) => route.path);

export const createLocalDevUiRoutes = (): LocalDevUiRoute[] => {
  const components = createControlPlaneUiComponents();
  return routeSpecs.map((spec) => {
    const component = components.find((candidate) => candidate.component_type === spec.component_type);
    if (!component) throw new Error(`Missing Control Plane UI component for ${spec.component_type}`);
    return {
      schema_version: "local-dev-ui-shell.route.v1",
      route_id: `local-dev-ui.route.${spec.path === "/" ? "root" : spec.path.slice(1).replaceAll("-", "_")}`,
      path: spec.path,
      title: spec.title,
      resource_uri: component.resource_uri,
      component_type: spec.component_type,
      shell_mode: "static_fixture_preview",
      read_only: true,
      preview_only: true,
      fixture_only: true,
      external_side_effects: false,
      destructive: false,
      production_mutation: false,
      customer_private_data: false,
      credential_entry: false,
      material_external_send: false,
      receipt_refs: [`receipt.build19.${spec.path === "/" ? "root" : spec.path.slice(1).replaceAll("-", "_")}`]
    };
  });
};

export const findLocalDevUiRoute = (routePathOrResourceUri: string): LocalDevUiRoute | undefined =>
  createLocalDevUiRoutes().find((route) => route.path === routePathOrResourceUri || route.resource_uri === routePathOrResourceUri);
