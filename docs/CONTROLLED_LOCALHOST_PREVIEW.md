# Controlled Localhost Preview Command / Developer-Mode Resource Connection

Build 21 adds a controlled localhost preview command model and developer-mode resource connection metadata.

The command and connection metadata is dry-run, config-required, fixture-only, preview-only, and read-only. Build 21 does not bind a server by default, does not start a process in CI/default mode, does not deploy a production frontend, and does not submit a public app.

## What Build 21 adds

- `ControlledLocalhostPreviewCommand` schemas and helpers.
- `ControlledLocalhostPreviewConfig` schemas and helpers.
- `ControlledLocalhostPreviewPlan` schemas and helpers.
- `ControlledLocalhostPreviewReadinessReport` schemas and helpers.
- `ControlledLocalhostPreviewSafetyPolicy` and safety-decision helpers.
- `ControlledLocalhostPreviewReceiptPreview` generation through public-safe fixture receipt previews.
- `DeveloperModeResourceConnectionPlan` and `DeveloperModeResourceConnectionManifest` metadata.
- Read-only MCP server resources for command readiness and developer-mode connection manifests.

## Supported command modes

Build 21 may model these metadata-only modes:

- `disabled`
- `dry_run_plan`
- `static_fixture_preview`
- `localhost_config_required`

`localhost_command_future` and `hosted_future` remain blocked/future. They are represented only so policy and tests can prove they are denied in Build 21.

## Configuration boundary

Controlled preview config is limited to localhost placeholders and inert commands:

- Host must be `localhost` or `127.0.0.1`.
- Port must be `config-required` or `placeholder`.
- Command must be `config-required`, `pnpm --filter @stealtheye/mcp-server preview:fixture`, or `node ./scripts/dev-preview-placeholder.mjs --dry-run`.
- Working directory must be `repo-root-placeholder`.
- `bind_by_default` is false.
- `starts_process` is false.
- `external_network_access` is false.
- `public_url` is null.
- Tunnel provider is `none` or `config-required` only.
- Production mode is false.
- Fixture-only, preview-only, read-only, and manual-run-required flags are true.
- Receipt references are required.

Build 21 does not add a script that actually binds a server by default. It does not add a script that starts a tunnel. It does not add commands using external services.

## Developer-mode resource connection metadata

Build 21 models how ChatGPT developer-mode would connect to dev resources once a safe reachable local endpoint exists. The manifest summarizes:

- MCP server package readiness.
- Dev endpoint readiness.
- Localhost preview readiness.
- Resource inventory.
- UI resource inventory.
- Render resource inventory.
- Required manual steps.
- Blocked/future steps.
- No-secret, no-production, no-public-submission, and no-money statements.
- Receipt preview status.

Build 21 does not create a real ChatGPT app, does not submit a public app, does not include real app IDs, does not include real OAuth clients, and does not include real public URLs.

## Safety boundary

Build 21 does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows. It does not add remote scripts/assets. It does not add tunnel credentials.

The safety policy denies production deployment, public app submission, real OAuth clients or secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry or storage, external side effects, unsafe command strings, unsafe working directories, unsafe host, unsafe port, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, starts-process behavior in CI/default mode, external network access, tunnel provider live enablement, hosted/public mode, missing read-only/preview/fixture flags, missing receipt references, and unknown command/connection modes.

The safety policy may allow dry-run command plans, fixture preview plans, static fixture resource reading, local app-safe UI/render resource URIs, localhost config-required metadata, developer-mode manual connection checklist metadata, receipt preview display, and safe settings summary display.

## Official docs checked

Only official documentation was checked for app/component/tool/resource/transport/developer-mode behavior:

- OpenAI Apps SDK reference for tools, resources, component metadata, and output-template concepts.
- OpenAI Apps SDK Connect from ChatGPT documentation for developer-mode connection expectations.
- OpenAI Apps SDK Test your integration documentation for local integration testing expectations.
- OpenAI Apps SDK component/resource documentation for resource template and component rendering boundaries.
- Model Context Protocol server resources specification for resource listing and resource reading.
- Model Context Protocol server transport specification for stdio and streamable HTTP transport concepts.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Future

Future Build 22 should implement a controlled local preview runner only if the environment supports safe local execution and no default binding. It should also add a manual developer-mode connection checklist that continues to avoid secrets, production domains, real app IDs, production OAuth clients, public submissions, tunnels, customer/private data, unrestricted writes, and external side effects.
