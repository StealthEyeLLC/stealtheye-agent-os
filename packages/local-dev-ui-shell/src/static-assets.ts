import type { LocalDevUiStaticAsset } from "./schemas";

export const createLocalDevUiStaticAssets = (): LocalDevUiStaticAsset[] => [
  {
    schema_version: "local-dev-ui-shell.static-asset.v1",
    asset_id: "local-dev-ui.asset.boundary-style",
    uri: "ui-asset://stealtheye/control-plane/static/boundary-style",
    kind: "style",
    content: ".boundary{font-weight:700}.panel{border:1px solid currentColor;padding:0.5rem}",
    remote: false,
    external_cdn: false,
    fixture_only: true,
    preview_only: true
  },
  {
    schema_version: "local-dev-ui-shell.static-asset.v1",
    asset_id: "local-dev-ui.asset.static-shell-fragment",
    uri: "ui://stealtheye/control-plane/static/shell-fragment",
    kind: "markup_fragment",
    content: "<section data-static-fixture=\"true\">Static fixture preview shell</section>",
    remote: false,
    external_cdn: false,
    fixture_only: true,
    preview_only: true
  }
];
