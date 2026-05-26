import type { ControlPlaneUiComponent, ControlPlaneUiComponentType } from "./schemas";

export const requiredControlPlaneUiComponentTypes: ControlPlaneUiComponentType[] = [
  "overview_dashboard",
  "mission_list",
  "mission_detail",
  "agent_registry",
  "tool_inventory",
  "guard_decisions",
  "receipt_timeline",
  "replay_report",
  "memory_context",
  "repo_status",
  "codeops_panel",
  "browserops_panel",
  "worker_fleet",
  "mcp_server_status",
  "dev_endpoint_status",
  "chatgpt_developer_mode_status",
  "safe_settings"
];

const typeToPath: Record<ControlPlaneUiComponentType, string> = {
  overview_dashboard: "overview",
  mission_list: "missions",
  mission_detail: "missions/detail",
  agent_registry: "agents",
  tool_inventory: "tools",
  guard_decisions: "guard",
  receipt_timeline: "receipts",
  replay_report: "replay",
  memory_context: "memory",
  repo_status: "repo-status",
  codeops_panel: "codeops",
  browserops_panel: "browserops",
  worker_fleet: "worker-fleet",
  mcp_server_status: "mcp-server",
  dev_endpoint_status: "dev-endpoint",
  chatgpt_developer_mode_status: "chatgpt-developer-mode",
  safe_settings: "settings-safe"
};

const titleFor = (componentType: ControlPlaneUiComponentType): string =>
  componentType
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

export const createControlPlaneUiComponent = (componentType: ControlPlaneUiComponentType): ControlPlaneUiComponent => {
  const path = typeToPath[componentType];
  const componentId = `control-plane-ui.${componentType}`;
  return {
    schema_version: "control-plane-ui.component.v1",
    component_id: componentId,
    component_type: componentType,
    title: titleFor(componentType),
    description: `Static preview-only Control Plane UI descriptor for ${titleFor(componentType)}.`,
    resource_uri: `ui://stealtheye/control-plane/${path}`,
    template_uri: `ui://stealtheye/control-plane/templates/${path}`,
    view_id: path.replaceAll("-", "_").replaceAll("/", "_"),
    panel_ids: [`${componentType}.panel.main`],
    required_data_refs: ["control_plane_state_snapshot", "navigation", "safety_inventory", "receipt_previews"],
    hydration_schema_id: "control-plane-ui.hydration.v1",
    safety_classification: "public_fixture_preview_only",
    read_only: true,
    preview_only: true,
    fixture_only: true,
    external_side_effects: false,
    destructive: false,
    production_mutation: false,
    customer_private_data: false,
    credential_entry: false,
    material_external_send: false,
    allowed_actions: ["view_fixture_panel", "render_static_preview", "show_receipt_preview"],
    blocked_actions: [
      "production_deployment",
      "public_app_submission",
      "real_oauth_client",
      "real_app_id",
      "production_domain",
      "real_public_endpoint",
      "unrestricted_live_write",
      "protected_branch_mutation",
      "destructive_action",
      "production_mutation",
      "customer_private_data",
      "money_movement",
      "material_external_send",
      "credential_entry_storage",
      "external_side_effect"
    ],
    receipt_refs: [`receipt.build18.${componentType}`]
  };
};

export const createControlPlaneUiComponents = (): ControlPlaneUiComponent[] =>
  requiredControlPlaneUiComponentTypes.map(createControlPlaneUiComponent);
