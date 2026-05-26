import { createControlPlaneUiComponents, readControlPlaneUiResource, readControlPlaneUiTemplate } from "@stealtheye/control-plane-ui";
import { findLocalDevUiRoute } from "./routes";
import { LocalDevUiResourceLoadResultSchema, type LocalDevUiResourceLoadResult } from "./schemas";

export const loadLocalDevUiResource = (routePathOrResourceUri: string): LocalDevUiResourceLoadResult => {
  const route = findLocalDevUiRoute(routePathOrResourceUri);
  if (!route) throw new Error(`Unknown local dev UI route or resource: ${routePathOrResourceUri}`);
  const resource = readControlPlaneUiResource(route.resource_uri);
  if (!resource) throw new Error(`Unknown Control Plane UI resource: ${route.resource_uri}`);
  const component = createControlPlaneUiComponents().find((candidate) => candidate.component_id === resource.component_id);
  if (!component) throw new Error(`Unknown Control Plane UI component: ${resource.component_id}`);
  const template = readControlPlaneUiTemplate(component.template_uri);
  if (!template) throw new Error(`Unknown Control Plane UI template: ${component.template_uri}`);
  return LocalDevUiResourceLoadResultSchema.parse({
    schema_version: "local-dev-ui-shell.resource-load-result.v1",
    route,
    resource,
    template,
    loaded: true,
    read_only: true,
    preview_only: true,
    fixture_only: true,
    external_side_effects: false
  });
};
