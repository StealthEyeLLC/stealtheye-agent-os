# Build 21 acceptance checklist: Controlled Localhost Preview Command / Developer-Mode Resource Connection

## Package foundation

- ControlledLocalhostPreviewCommand, config, plan, readiness report, safety policy, safety decision, receipt preview, and developer-mode connection schemas validate.
- disabled, dry_run_plan, static_fixture_preview, and localhost_config_required modes are allowed as metadata-only modes.
- localhost_command_future and hosted_future remain blocked/future.
- Developer-mode resource connection manifest includes MCP server, dev endpoint, localhost preview, UI resource, and render resource summaries.
- Receipt previews include command mode, config summary, resource inventory summary, developer-mode connection stage, safety decision, read-only/fixture/preview status, no-secret/no-production/no-public-submission/no-money statements, and result status.
- Existing MCP server resources still list and read.
- Official docs checked are documented in docs/CONTROLLED_LOCALHOST_PREVIEW.md and ADR 0023.
- Strict generated sync is true.
- Protected docs are untouched.

## Build automation engine

- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.
- Generated files exist under docs/generated/.
- Public-safe/no-live scanner runs in check mode.
- Hand-authored docs are preserved outside explicit additive markers.

## Boundary

- No server is bound by default.
- No process starts in CI or default mode.
- No production frontend deployment, production endpoint, production domain, public app submission, production OAuth credential, real app identifier, real public URL, tunnel credential, cloud credential, or customer/private data workflow is added.
- No unrestricted live write, protected branch mutation, destructive action, production mutation, material external send, credential entry/storage, external network access, tunnel live enablement, hosted public mode, remote script/style/asset, or money movement path is exposed.
- Command and connection metadata remains dry-run, config-required, fixture-only, preview-only, and read-only.

## Next target

- Build 22 - Safe Local Preview Runner / Manual Developer-Mode Connection Checklist.
