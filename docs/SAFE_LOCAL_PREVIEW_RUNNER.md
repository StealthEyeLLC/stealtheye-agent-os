# Safe Local Preview Runner / Manual Developer-Mode Connection Checklist

Build 22 advances Build 21 from controlled command/readiness metadata to a safe local preview runner model and manual developer-mode connection checklist. The build remains local/dev only, preview-only, fixture-safe, read-only by default, manually gated, and public-safe.

## Purpose

Build 21 established controlled localhost preview command/readiness metadata and developer-mode resource connection metadata. Build 22 adds a schema-validated runner model that describes how a developer would manually prepare a safe local preview later without starting a process, binding a server, enabling a tunnel, creating a real ChatGPT app, or exposing a public endpoint.

## What was added

- Safe local preview runner modes, configuration, command-plan, readiness, safety policy, safety decision, manual-run checklist, and receipt-preview schemas.
- Manual developer-mode connection checklist and manifest schemas.
- Read-only MCP resources for Build 22 readiness, manual-run checklist, developer-mode checklist, and receipt-preview metadata.
- Generated Build 22 manifest, acceptance, handoff, receipt, project memory, known gaps, safety capability matrix, eval registry, tool inventory, and build state.
- Build 22 CI with required-file, generated-sync, protected-doc, sensitive-string, live-app-material, remote-asset, default-binding, process-start, tunnel, and public-endpoint guards.

## Runner modes

Allowed metadata-only modes are `disabled`, `dry_run_only`, `manual_config_required`, `fixture_preview_only`, and `manual_localhost_ready`.

Blocked/future modes are `auto_start_future`, `hosted_public_future`, `tunnel_future`, and `production_future`.

Allowed modes are deterministic metadata modes only. Blocked/future modes are represented so safety policy and tests can prove they are denied.

## Manual-run checklist

The manual-run checklist covers Build 21 baseline confirmation, Build 22 runner readiness, localhost-only endpoint prerequisites, no-secret-material checks, no-production checks, no-public-submission checks, no-real-app-ID checks, no-production-OAuth checks, no-tunnel checks, no-customer/private-data checks, no-unrestricted-write checks, no-protected-branch-mutation checks, no-destructive-action checks, no-money-movement checks, no-material-external-send checks, no-default-binding checks, no-process-start checks, no-remote-asset/script/style checks, expected manual verification steps, known gaps, and receipt preview references.

## Developer-mode checklist

The developer-mode checklist is manual and checklist-based. It records prerequisites for a future developer-mode connection without creating, registering, or submitting a real ChatGPT app. It does not include real app IDs, production OAuth clients, secret material, public URLs, tunnels, public endpoints, customer/private data, unrestricted writes, protected branch mutation paths, destructive actions, money movement, or material external sends.

## Configuration boundary

The Build 22 runner model is limited to deterministic public-safe metadata:

- Host is `localhost` or `127.0.0.1`.
- Port is `config-required`, `placeholder`, or `metadata-port-placeholder`.
- Command plan is inert, fixture metadata, or config-required.
- Working directory is `repo-root-placeholder`.
- `bind_by_default` is false.
- `starts_process` is false.
- `starts_process_in_ci_or_default_mode` is false.
- `external_network_access` is false.
- `public_url` is null.
- Tunnel provider is `none` or `config-required` only.
- Production mode is false.
- Read-only, fixture-only, preview-only, and manual-run-required flags are true.
- Receipt references are required.

## Safety boundary

The safety policy denies secret material, production deployment, public app submission, real domains, real app IDs, production OAuth clients, real public endpoints, customer/private data workflows, unrestricted live writes, protected branch mutation, destructive actions, production mutations, money movement, material external sends, credential entry or storage, external side effects, unsafe command strings, unsafe working directories, unsafe hosts, unsafe ports, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, process start in CI/default mode, external network access, tunnel provider live enablement, hosted/public mode, production mode, auto-start mode, missing read-only/preview/manual-gating flags, missing receipt references, and unknown runner or connection modes.

The safety policy allows dry-run command planning, fixture preview metadata, read-only MCP resource metadata, manual local preview checklist metadata, manual developer-mode connection checklist metadata, localhost config-required metadata, safe settings summaries, receipt preview display, and deterministic local-only instructions that do not execute in CI/default mode.

## Public/private boundary

All committed Build 22 artifacts are public-safe. They contain deterministic fixture metadata, localhost placeholders, config-required placeholders, public-safe docs, generated state, tests, and receipt previews. They do not contain secret material, private endpoints, customer data, private operational data, production domains, real app IDs, real OAuth clients, real public URLs, cloud account identifiers, or sensitive operational details.

## Official docs checked

Only official documentation was checked for app, MCP resource, transport, component, and developer-mode behavior:

- OpenAI Apps SDK Build your MCP server.
- OpenAI Apps SDK Connect from ChatGPT.
- OpenAI Apps SDK Test your integration.
- OpenAI Apps SDK Reference.
- Model Context Protocol server resources specification.
- Model Context Protocol transport specification.

The implementation intentionally does not encode live tunnel, public endpoint, production OAuth, app submission, or real app creation behavior from those docs because Build 22 is constrained to local/dev metadata and manual checklist readiness.

## Known gaps

- No real ChatGPT app is created.
- No public app submission exists.
- No production OAuth exists.
- No real app ID exists.
- No production domain exists.
- No public endpoint exists.
- No tunnel live enablement exists.
- No default server binding exists.
- No process start occurs in CI/default mode.
- Manual local preview execution remains gated and config-required.
- Developer-mode connection remains manual and checklist-based.
- No customer/private data workflow exists.
- No unrestricted live write path exists.
- No durable live preview ledger exists beyond public-safe receipt preview metadata.

## Future work

A future build may implement an explicitly configured, manually invoked local preview execution path only after preserving localhost-only binding, no CI/default process start, no public endpoint, no tunnel live enablement, no secret material, and no production/public behavior. The recommended next target is a durable public-safe preview receipt ledger or verifier-reviewed manual local preview exercise, depending on the next planning prompt.
