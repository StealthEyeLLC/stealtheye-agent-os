import { createControlPlaneActions, createControlPlaneNavigation, createControlPlaneReceiptPreview, createControlPlaneStateSnapshot, createControlPlaneViews } from "@stealtheye/control-plane-app";
import type { ControlPlaneUiHydrationPayload } from "./schemas";

export const createControlPlaneUiHydrationPayload = (): ControlPlaneUiHydrationPayload => {
  const actions = createControlPlaneActions();
  return {
    schema_version: "control-plane-ui.hydration.v1",
    control_plane_state_snapshot: createControlPlaneStateSnapshot(),
    navigation: createControlPlaneNavigation(),
    views: createControlPlaneViews(),
    panels: createControlPlaneViews().flatMap((view) => view.panels),
    actions,
    safety_inventory: [
      "read_only",
      "preview_only",
      "fixture_only",
      "no_external_side_effects",
      "no_production_mutation",
      "no_customer_private_data",
      "no_credential_entry",
      "receipt_refs_required"
    ],
    receipt_previews: actions.slice(0, 4).map((action) => createControlPlaneReceiptPreview(action)),
    known_gaps: [
      "No production frontend is deployed.",
      "No public app submission exists.",
      "No production OAuth, real app IDs, production domains, or real public endpoints are added.",
      "No unrestricted live write, protected branch mutation, destructive, production mutation, customer/private data, money movement, material external send, or credential entry path exists.",
      "Build 19 should add a local dev UI shell or resource rendering path depending on environment readiness."
    ],
    fixture_only: true,
    preview_only: true,
    read_only: true
  };
};
