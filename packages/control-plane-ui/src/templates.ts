import { createControlPlaneUiComponents } from "./components";
import type { ControlPlaneUiTemplate } from "./schemas";

export const createControlPlaneUiTemplates = (): ControlPlaneUiTemplate[] =>
  createControlPlaneUiComponents().map((component) => ({
    schema_version: "control-plane-ui.template.v1",
    template_id: component.component_id.replace("control-plane-ui.", "control-plane-template."),
    template_uri: component.template_uri,
    component_type: component.component_type,
    static_layout: {
      regions: ["header", "summary", "panels", "receipt_preview", "safety_boundary"],
      empty_state: "Fixture data unavailable; render the public-safe empty state without network fetches or credential prompts."
    },
    allowed_slots: ["title", "description", "panel_summary", "known_gaps", "receipt_refs"],
    fixture_only: true,
    preview_only: true
  }));

export const readControlPlaneUiTemplate = (templateUri: string): ControlPlaneUiTemplate | undefined =>
  createControlPlaneUiTemplates().find((template) => template.template_uri === templateUri);
