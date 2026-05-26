import { z } from "zod";

export const LocalhostPreviewModeSchema = z.enum([
  "disabled",
  "static_fixture_preview",
  "localhost_config_required",
  "localhost_bound_future",
  "hosted_future"
]);
export type LocalhostPreviewMode = z.infer<typeof LocalhostPreviewModeSchema>;

export const LocalhostPreviewManifestSchema = z.object({
  schema_version: z.literal("stealtheye-mcp-server-localhost-preview-manifest.v1"),
  uri: z.string().regex(/^localhost-preview:\/\/stealtheye\/control-plane\/[a-z0-9-]+$/),
  mode: LocalhostPreviewModeSchema,
  host: z.enum(["localhost", "127.0.0.1"]).nullable(),
  port: z.union([z.literal("config-required"), z.number().int().positive().max(65535)]).nullable(),
  bind_by_default: z.literal(false),
  external_network_access: z.literal(false),
  public_url: z.null(),
  tunnel_provider: z.enum(["none", "config-required"]),
  production_mode: z.literal(false),
  fixture_only: z.literal(true),
  preview_only: z.literal(true),
  read_only: z.literal(true),
  implemented: z.boolean(),
  blocked: z.boolean(),
  reasons: z.array(z.string().min(1)).min(1),
  receipt_refs: z.array(z.string().min(1)).min(1)
});
export type LocalhostPreviewManifest = z.infer<typeof LocalhostPreviewManifestSchema>;

export const LOCALHOST_PREVIEW_RESOURCE_URIS = {
  disabled: "localhost-preview://stealtheye/control-plane/disabled",
  staticFixturePreview: "localhost-preview://stealtheye/control-plane/static-fixture-preview",
  localhostConfigRequired: "localhost-preview://stealtheye/control-plane/localhost-config-required"
} as const;

export const createLocalhostPreviewManifest = (mode: LocalhostPreviewMode = "disabled"): LocalhostPreviewManifest => {
  const implemented = mode === "disabled" || mode === "static_fixture_preview" || mode === "localhost_config_required";
  const blocked = mode === "localhost_bound_future" || mode === "hosted_future";
  const uri = mode === "static_fixture_preview"
    ? LOCALHOST_PREVIEW_RESOURCE_URIS.staticFixturePreview
    : mode === "localhost_config_required"
      ? LOCALHOST_PREVIEW_RESOURCE_URIS.localhostConfigRequired
      : LOCALHOST_PREVIEW_RESOURCE_URIS.disabled;
  return LocalhostPreviewManifestSchema.parse({
    schema_version: "stealtheye-mcp-server-localhost-preview-manifest.v1",
    uri,
    mode,
    host: mode === "disabled" ? null : "localhost",
    port: mode === "disabled" ? null : "config-required",
    bind_by_default: false,
    external_network_access: false,
    public_url: null,
    tunnel_provider: mode === "localhost_config_required" ? "config-required" : "none",
    production_mode: false,
    fixture_only: true,
    preview_only: true,
    read_only: true,
    implemented,
    blocked,
    reasons: blocked
      ? [`${mode} remains blocked/future and cannot bind or expose a public endpoint in Build 20.`]
      : [`${mode} metadata is read-only, fixture-only, and does not bind a server by default.`],
    receipt_refs: [`receipt.build20.localhost_preview.${mode}`]
  });
};

export const listLocalhostPreviewManifests = (): LocalhostPreviewManifest[] => [
  createLocalhostPreviewManifest("disabled"),
  createLocalhostPreviewManifest("static_fixture_preview"),
  createLocalhostPreviewManifest("localhost_config_required")
];
