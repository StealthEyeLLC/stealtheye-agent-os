import { createControlPlaneUiComponents } from "./components";
import { createControlPlaneUiHydrationPayload } from "./hydration";
import { createControlPlaneUiMetadata } from "./metadata";
import { createControlPlaneUiResources } from "./resources";
import { ControlPlaneUiFixtureBundleSchema } from "./schemas";
import { createControlPlaneUiSafetyPolicy } from "./safety";
import { createControlPlaneUiTemplates } from "./templates";

export const CONTROL_PLANE_UI_FIXTURE_URI = "ui://stealtheye/control-plane/fixture-bundle";

export const createControlPlaneUiFixtureBundle = () =>
  ControlPlaneUiFixtureBundleSchema.parse({
    schema_version: "control-plane-ui.fixture-bundle.v1",
    components: createControlPlaneUiComponents(),
    resources: createControlPlaneUiResources(),
    templates: createControlPlaneUiTemplates(),
    metadata: createControlPlaneUiMetadata(),
    hydration: createControlPlaneUiHydrationPayload(),
    safety_policy: createControlPlaneUiSafetyPolicy()
  });

export const CONTROL_PLANE_UI_FIXTURE_BUNDLE = createControlPlaneUiFixtureBundle();
