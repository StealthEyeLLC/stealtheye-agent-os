import { ControlPlaneFixtureStateSchema } from "./schemas";
import { createControlPlaneActions } from "./actions";
import { createControlPlaneApp } from "./app-model";
import { createControlPlaneNavigation } from "./navigation";
import { createControlPlaneStateSnapshot } from "./state";

export const CONTROL_PLANE_APP_NOW = "2026-01-01T00:00:00.000Z";
export const CONTROL_PLANE_APP_FIXTURE_URI = "control-plane://fixture/stealtheye-agent-os";

export function createControlPlaneFixtureState() {
  return ControlPlaneFixtureStateSchema.parse({
    schema_version: "stealtheye-control-plane-fixture-state.v1",
    snapshot: createControlPlaneStateSnapshot(),
    navigation: createControlPlaneNavigation(),
    actions: createControlPlaneActions()
  });
}

export const CONTROL_PLANE_APP_FIXTURE = createControlPlaneApp();
export const CONTROL_PLANE_FIXTURE_STATE = createControlPlaneFixtureState();
