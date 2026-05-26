import { ControlPlaneAppSchema } from "./schemas";
import { createControlPlaneActions } from "./actions";
import { createControlPlaneNavigation } from "./navigation";
import { createControlPlaneStateSnapshot } from "./state";
import { DEFAULT_CONTROL_PLANE_SAFETY_POLICY } from "./safety";

export const OFFICIAL_CONTROL_PLANE_DOCS_CHECKED = [
  "OpenAI Apps SDK docs for app, component, resource, and tool model behavior.",
  "OpenAI Apps SDK component/resource docs for future UI component resources; Build 17 does not add component resources.",
  "OpenAI Apps SDK tool metadata docs for future action metadata; Build 17 keeps actions fixture/model/preview-only.",
  "Model Context Protocol docs for server, client, tool, and resource concepts."
] as const;

export function createControlPlaneApp() {
  return ControlPlaneAppSchema.parse({
    schema_version: "stealtheye-control-plane-app.v1",
    app_name: "StealthEye Agent OS Control Plane Fixture",
    package_name: "@stealtheye/control-plane-app",
    build: 17,
    navigation: createControlPlaneNavigation(),
    actions: createControlPlaneActions(),
    state_snapshot: createControlPlaneStateSnapshot(),
    safety_policy: DEFAULT_CONTROL_PLANE_SAFETY_POLICY,
    receipt_preview_available: true,
    model_fixture_preview_only: true,
    official_docs_checked: [...OFFICIAL_CONTROL_PLANE_DOCS_CHECKED]
  });
}
