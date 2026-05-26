import type { ControlPlaneUiMetadata } from "./schemas";

export const officialDocsChecked = [
  "OpenAI Apps SDK overview for ChatGPT app and MCP concepts",
  "OpenAI Apps SDK reference for registerResource component resources and _meta fields",
  "OpenAI Apps SDK reference for tool metadata including openai/outputTemplate",
  "Model Context Protocol specification for server resources",
  "Model Context Protocol specification for server tools"
];

export const createControlPlaneUiMetadata = (): ControlPlaneUiMetadata => ({
  schema_version: "control-plane-ui.metadata.v1",
  app_sdk_alignment: {
    official_docs_checked: officialDocsChecked,
    resource_descriptor_model: "static_apps_sdk_style_resource_descriptor",
    tool_metadata_model: "read_only_output_template_metadata"
  },
  build: 18,
  package_name: "@stealtheye/control-plane-ui",
  production_frontend: false,
  public_app_submission: false,
  production_oauth: false,
  real_app_ids: false,
  production_domains: false,
  unrestricted_live_write_tools: false,
  customer_private_data_workflows: false
});
