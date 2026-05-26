# ADR 0023: Controlled Localhost Preview Command / Developer-Mode Resource Connection

## Status

Accepted for Build 21.

## Context

Build 18 added `@stealtheye/control-plane-ui`. Build 19 added `@stealtheye/local-dev-ui-shell`. Build 20 wired those resources into `@stealtheye/mcp-server` and modeled controlled localhost-preview metadata. Build 21 needs an explicit command/readiness layer that defines how a controlled localhost preview would be started later, while still not binding a server by default.

## Decision

Extend `@stealtheye/mcp-server` with controlled localhost preview command/readiness schemas and developer-mode resource connection metadata.

Build 21 adds schemas and helpers for:

- `ControlledLocalhostPreviewCommand`
- `ControlledLocalhostPreviewConfig`
- `ControlledLocalhostPreviewPlan`
- `ControlledLocalhostPreviewReadinessReport`
- `ControlledLocalhostPreviewSafetyPolicy`
- `ControlledLocalhostPreviewSafetyDecision`
- `ControlledLocalhostPreviewReceiptPreview`
- `DeveloperModeResourceConnectionPlan`
- `DeveloperModeResourceConnectionManifest`

The allowed Build 21 command modes are `disabled`, `dry_run_plan`, `static_fixture_preview`, and `localhost_config_required`. `localhost_command_future` and `hosted_future` remain blocked/future.

The MCP server exposes Build 21 metadata as read-only resources. It does not expose live command execution, unrestricted resource reads, external fetches, a production web server, port binding, remote assets, public app submission, production OAuth, real app IDs, production domains, tunnel credentials, customer/private data, or live mutation paths.

## Official documentation checked

Build 21 checked current official documentation only:

- OpenAI Apps SDK reference for tools, resources, component metadata, and output-template concepts.
- OpenAI Apps SDK Connect from ChatGPT documentation for developer-mode connection expectations.
- OpenAI Apps SDK Test your integration documentation for local integration testing expectations.
- OpenAI Apps SDK component/resource documentation for resource template and component rendering boundaries.
- Model Context Protocol server resources specification for resource listing and resource reading.
- Model Context Protocol server transport specification for stdio and streamable HTTP transport concepts.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Safety boundaries

Build 21 does not bind a server by default. It does not start a process in CI/default mode. It does not deploy a production frontend. It does not submit a public app. It does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows. It does not add remote scripts/assets. It does not add tunnel credentials.

The safety policy denies production deployment, public app submission, real OAuth clients or secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry or storage, external side effects, unsafe command strings, unsafe working directories, unsafe host, unsafe port, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, starts-process behavior in CI/default mode, external network access, tunnel provider live enablement, hosted/public mode, missing read-only/preview/fixture flags, missing receipt references, and unknown command/connection modes.

## Consequences

Build 21 establishes a safe command-plan/readiness contract for future localhost preview work without changing the public/private boundary. Developer-mode resource connection metadata can now be inspected through MCP resources, but it remains manual, config-required, fixture-only, preview-only, and read-only.

## Next

Future Build 22 should implement a controlled local preview runner only if the environment supports safe local execution and no default binding, plus a manual developer-mode connection checklist.
