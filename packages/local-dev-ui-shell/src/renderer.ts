import { createControlPlaneUiComponents, createControlPlaneUiHydrationPayload } from "@stealtheye/control-plane-ui";
import { hydrateLocalDevUiResource } from "./hydration";
import { loadLocalDevUiResource } from "./resource-loader";
import { createLocalDevUiReceiptPreview } from "./receipts";
import { decideLocalDevUiSafety } from "./safety";
import { LocalDevUiRenderRequestSchema, LocalDevUiRenderResultSchema, type LocalDevUiRenderRequest, type LocalDevUiRenderResult } from "./schemas";

const escapeHtml = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export const renderLocalDevUiResource = (request: LocalDevUiRenderRequest): LocalDevUiRenderResult => {
  const parsed = LocalDevUiRenderRequestSchema.parse(request);
  const key = parsed.route_path ?? parsed.resource_uri ?? "/";
  const loaded = loadLocalDevUiResource(key);
  const component = createControlPlaneUiComponents().find((candidate) => candidate.component_id === loaded.resource.component_id);
  if (!component) throw new Error(`Unable to render missing component ${loaded.resource.component_id}`);
  const hydrationPayload = createControlPlaneUiHydrationPayload();
  const hydrationSummary = hydrateLocalDevUiResource(loaded.route.resource_uri);
  const safetyDecision = decideLocalDevUiSafety(loaded.route);
  const receiptPreview = createLocalDevUiReceiptPreview(loaded.route, hydrationSummary, safetyDecision);
  const panelSummary = hydrationPayload.panels.slice(0, 5).map((panel) => `<li>${escapeHtml(String(panel.title ?? "panel"))}: ${escapeHtml(String(panel.summary ?? "fixture panel"))}</li>`).join("");
  const gaps = hydrationPayload.known_gaps.map((gap) => `<li>${escapeHtml(gap)}</li>`).join("");
  const html = [
    "<!doctype html>",
    "<html>",
    "<head><meta charset=\"utf-8\"><title>" + escapeHtml(component.title) + "</title></head>",
    "<body data-shell-mode=\"" + escapeHtml(parsed.shell_mode) + "\" data-fixture-only=\"true\">",
    "<aside class=\"boundary\">No secrets • No production deployment • No public app submission • No money movement • No remote assets • No default server binding</aside>",
    "<main>",
    "<h1>" + escapeHtml(component.title) + "</h1>",
    "<p>" + escapeHtml(component.description) + "</p>",
    "<section id=\"safety\"><h2>Safety classification</h2><p>" + escapeHtml(component.safety_classification) + "</p></section>",
    "<section id=\"fixture-summary\"><h2>Fixture data summary</h2><p>views=" + hydrationSummary.view_count + "; panels=" + hydrationSummary.panel_count + "; actions=" + hydrationSummary.action_count + "; receipts=" + hydrationSummary.receipt_preview_count + "</p></section>",
    "<section id=\"panels\"><h2>Panels</h2><ul>" + panelSummary + "</ul></section>",
    "<section id=\"receipt-preview\"><h2>Receipt preview</h2><p>" + escapeHtml(receiptPreview.result_status) + " for " + escapeHtml(receiptPreview.resource_uri) + "</p></section>",
    "<section id=\"known-gaps\"><h2>Known gaps</h2><ul>" + gaps + "</ul></section>",
    "</main>",
    "</body>",
    "</html>"
  ].join("");
  return LocalDevUiRenderResultSchema.parse({
    schema_version: "local-dev-ui-shell.render-result.v1",
    route: loaded.route,
    resource_uri: loaded.route.resource_uri,
    template_uri: component.template_uri,
    component_type: loaded.route.component_type,
    render_mode: parsed.shell_mode,
    html,
    hydration_summary: hydrationSummary,
    safety_decision: safetyDecision,
    receipt_preview: receiptPreview,
    deterministic: true,
    read_only: true,
    preview_only: true,
    fixture_only: true,
    external_side_effects: false
  });
};
