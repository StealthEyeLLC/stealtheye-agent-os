import { ChecklistSchema } from "./schemas";

export const CONNECTION_STAGES = ["prerequisites", "endpoint_ready", "app_manifest_ready", "connect_from_chatgpt", "test_integration", "submit_app_future"] as const;

export const OFFICIAL_DOCS_CHECKED = [
  "OpenAI Apps SDK overview for app and MCP server model.",
  "OpenAI Apps SDK Connect from ChatGPT guide for developer-mode connection flow.",
  "OpenAI Apps SDK Test your integration guide for local/manual test flow.",
  "OpenAI Apps SDK Submit your app guide for public submission boundary.",
  "OpenAI Apps SDK Security & Privacy guide for data, tool, and submission safety boundaries.",
  "Model Context Protocol docs for MCP server/client/resource/tool connection model."
] as const;

export function createDeveloperModeChecklist() {
  return ChecklistSchema.parse({
    schema_version: "stealtheye-chatgpt-dev-connection-checklist.v1",
    stages: CONNECTION_STAGES,
    prerequisites: [
      "Confirm @stealtheye/mcp-server metadata, tool inventory, resource inventory, and safety inventory are present.",
      "Confirm @stealtheye/dev-endpoint manifest exists and is disabled, localhost-only, or tunnel-config-required placeholder only.",
      "Confirm no secrets, production domains, app IDs, production OAuth clients, tunnel auth tokens, cloud credentials, customer data, or money paths are present."
    ],
    endpoint_ready: [
      "Use only fixture/dev endpoint identifiers or loopback placeholders.",
      "Require endpoint health, safety decision, and receipt preview before any future manual ChatGPT connection."
    ],
    app_manifest_ready: [
      "Prepare a developer-mode manifest summary only.",
      "Keep public submission, production OAuth, real app IDs, and production domains blocked."
    ],
    connect_from_chatgpt: [
      "Do not perform a real ChatGPT connection in Build 16.",
      "Record the future manual connection step as blocked until a safe reachable dev endpoint exists."
    ],
    test_integration: [
      "Use fixture/local-only test integration planning.",
      "Verify no unrestricted live write, destructive, production mutation, protected branch mutation, customer data, or money tools are exposed."
    ],
    submit_app_future: [
      "Mark public app submission as future/blocked.",
      "Require later review before any public app submission or production deployment."
    ],
    official_docs_checked: [...OFFICIAL_DOCS_CHECKED]
  });
}
