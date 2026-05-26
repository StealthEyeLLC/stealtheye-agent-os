import { createControlPlaneUiComponents } from "./components";
import type { ControlPlaneUiResource } from "./schemas";

export const createControlPlaneUiResources = (): ControlPlaneUiResource[] =>
  createControlPlaneUiComponents().map((component) => ({
    schema_version: "control-plane-ui.resource.v1",
    resource_id: component.component_id.replace("control-plane-ui.", "control-plane-resource."),
    uri: component.resource_uri,
    mime_type: "application/vnd.stealtheye.control-plane-ui+json",
    component_id: component.component_id,
    title: component.title,
    description: component.description,
    read_only: true,
    preview_only: true,
    fixture_only: true,
    external_side_effects: false,
    production_mutation: false,
    customer_private_data: false,
    receipt_refs: component.receipt_refs
  }));

export const listControlPlaneUiResourceUris = (): string[] => createControlPlaneUiResources().map((resource) => resource.uri);
export const readControlPlaneUiResource = (uri: string): ControlPlaneUiResource | undefined => createControlPlaneUiResources().find((resource) => resource.uri === uri);
