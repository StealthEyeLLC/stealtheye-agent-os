import { createDeveloperModeConnectionManifest } from "./manifest";
import { createDeveloperModeConnectionPlan } from "./connection-plan";

export const CHATGPT_DEV_CONNECTION_NOW = "2026-01-01T00:00:00.000Z";
export const CHATGPT_DEV_CONNECTION_FIXTURE_URI = "chatgpt-dev://fixture/stealtheye-agent-os";
export const DEV_ENDPOINT_FIXTURE_URI = "dev-endpoint://fixture/stealtheye-agent-os";
export const LOCAL_MCP_PLACEHOLDER_URL = "http://localhost:3000/mcp";

export const LOCAL_DEVELOPER_MODE_PLAN_FIXTURE = createDeveloperModeConnectionPlan("app_manifest_ready");
export const TUNNEL_CONFIG_REQUIRED_PLAN_FIXTURE = createDeveloperModeConnectionPlan("endpoint_ready");
export const LOCAL_DEVELOPER_MODE_MANIFEST_FIXTURE = createDeveloperModeConnectionManifest();
export const TUNNEL_CONFIG_REQUIRED_MANIFEST_FIXTURE = createDeveloperModeConnectionManifest({ tunnelConfigRequired: true, stage: "endpoint_ready" });
