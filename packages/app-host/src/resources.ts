import { APP_HOST_BOUNDARIES, APP_HOST_METADATA } from "./app-metadata";
import { compileFixtureMission } from "./fixtures";

export interface AppHostResourceDescriptor {
  uri: string;
  name: string;
  description: string;
  mime_type: "application/json" | "text/markdown";
  readOnly: true;
}

export const APP_HOST_RESOURCES: AppHostResourceDescriptor[] = [
  {
    uri: "app://stealtheye-agent-os/health",
    name: "App Host Health",
    description: "Static health/status resource for the Build 5 app-host foundation shell.",
    mime_type: "application/json",
    readOnly: true
  },
  {
    uri: "app://stealtheye-agent-os/capabilities",
    name: "App Host Capabilities",
    description: "Static capabilities resource listing preview-only tool families and boundaries.",
    mime_type: "application/json",
    readOnly: true
  },
  {
    uri: "app://stealtheye-agent-os/policy",
    name: "StealthEye Policy Boundary",
    description: "Static policy boundary resource for hard stops and autonomy limits.",
    mime_type: "application/json",
    readOnly: true
  },
  {
    uri: "app://stealtheye-agent-os/sample-mission",
    name: "Sample Mission Preview",
    description: "Fixture-backed compiled Mission Language preview.",
    mime_type: "application/json",
    readOnly: true
  }
];

export function readAppHostResource(uri: string): unknown {
  if (uri === "app://stealtheye-agent-os/health") {
    return {
      status: "ok",
      metadata: APP_HOST_METADATA,
      boundaries: APP_HOST_BOUNDARIES
    };
  }
  if (uri === "app://stealtheye-agent-os/capabilities") {
    return {
      metadata: APP_HOST_METADATA,
      supported_tool_families: APP_HOST_METADATA.supported_tool_families,
      live_write_capability: false
    };
  }
  if (uri === "app://stealtheye-agent-os/policy") {
    return {
      boundaries: APP_HOST_BOUNDARIES,
      hard_stop_policy: "hard-stop actions require denial or escalation; Build 5 exposes preview-only tools only"
    };
  }
  if (uri === "app://stealtheye-agent-os/sample-mission") {
    return compileFixtureMission("normal_repo_feature");
  }
  throw new Error(`Unknown app-host resource URI: ${uri}`);
}
