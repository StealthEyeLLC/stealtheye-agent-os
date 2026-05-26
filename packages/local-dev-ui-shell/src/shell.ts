import { createLocalDevUiRoutes } from "./routes";
import { createLocalDevUiStaticAssets } from "./static-assets";
import { LocalDevUiShellSchema, type LocalDevUiShell } from "./schemas";

export const createLocalDevUiShell = (): LocalDevUiShell =>
  LocalDevUiShellSchema.parse({
    schema_version: "local-dev-ui-shell.shell.v1",
    shell_id: "local-dev-ui-shell:stealtheye-control-plane:build-19",
    package_name: "@stealtheye/local-dev-ui-shell",
    build: 19,
    implemented_modes: ["disabled", "static_fixture_preview"],
    modeled_modes: ["disabled", "static_fixture_preview", "localhost_dev_preview", "hosted_future"],
    default_mode: "static_fixture_preview",
    default_route: "/",
    server_binding_default: false,
    production_frontend: false,
    public_app_submission: false,
    remote_assets: false,
    routes: createLocalDevUiRoutes(),
    assets: createLocalDevUiStaticAssets()
  });
