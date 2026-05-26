import { createControlPlaneUiHydrationPayload } from "@stealtheye/control-plane-ui";
import { LocalDevUiHydrationResultSchema, type LocalDevUiHydrationResult } from "./schemas";

export const hydrateLocalDevUiResource = (resourceUri = "ui://stealtheye/control-plane/overview"): LocalDevUiHydrationResult => {
  const hydration = createControlPlaneUiHydrationPayload();
  return LocalDevUiHydrationResultSchema.parse({
    schema_version: "local-dev-ui-shell.hydration-result.v1",
    resource_uri: resourceUri,
    hydration_schema_id: hydration.schema_version,
    control_plane_state_snapshot_present: Boolean(hydration.control_plane_state_snapshot),
    view_count: hydration.views.length,
    panel_count: hydration.panels.length,
    action_count: hydration.actions.length,
    receipt_preview_count: hydration.receipt_previews.length,
    known_gap_count: hydration.known_gaps.length,
    read_only: hydration.read_only,
    preview_only: hydration.preview_only,
    fixture_only: hydration.fixture_only
  });
};
