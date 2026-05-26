import { hydrateLocalDevUiResource } from "./hydration";
import { renderLocalDevUiResource } from "./renderer";
import { createLocalDevUiRoutes } from "./routes";
import { LocalDevUiFixtureBundleSchema } from "./schemas";
import { createLocalDevUiSafetyPolicy } from "./safety";
import { createLocalDevUiShell } from "./shell";
import { createLocalDevUiStaticAssets } from "./static-assets";

export const LOCAL_DEV_UI_SHELL_FIXTURE_URI = "ui://stealtheye/control-plane/local-dev-ui-shell/fixture-bundle";

export const createLocalDevUiFixtureBundle = () =>
  LocalDevUiFixtureBundleSchema.parse({
    schema_version: "local-dev-ui-shell.fixture-bundle.v1",
    shell: createLocalDevUiShell(),
    routes: createLocalDevUiRoutes(),
    assets: createLocalDevUiStaticAssets(),
    hydration: hydrateLocalDevUiResource(),
    rendered_preview: renderLocalDevUiResource({
      schema_version: "local-dev-ui-shell.render-request.v1",
      route_path: "/overview",
      shell_mode: "static_fixture_preview",
      include_receipt_preview: true,
      deterministic: true
    }),
    safety_policy: createLocalDevUiSafetyPolicy()
  });

export const LOCAL_DEV_UI_SHELL_FIXTURE_BUNDLE = createLocalDevUiFixtureBundle();
