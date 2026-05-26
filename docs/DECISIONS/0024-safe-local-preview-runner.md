# ADR 0024: Safe Local Preview Runner / Manual Developer-Mode Connection Checklist

## Status

Accepted for Build 22.

## Context

Build 21 added controlled localhost preview command/readiness metadata and developer-mode resource connection metadata. Build 22 advances that baseline with a safe local preview runner model and manual developer-mode connection checklist while preserving the public-safe/local-dev boundary.

## Decision

Add schema-validated, deterministic, fixture-safe, read-only, preview-only, manually gated runner and checklist metadata inside `@stealtheye/mcp-server`.

Build 22 adds `SafeLocalPreviewRunnerMode`, `SafeLocalPreviewRunnerConfig`, `SafeLocalPreviewRunnerCommand`, `SafeLocalPreviewRunnerReadinessReport`, `SafeLocalPreviewRunnerManualRunChecklist`, `SafeLocalPreviewRunnerSafetyPolicy`, `SafeLocalPreviewRunnerSafetyDecision`, `SafeLocalPreviewRunnerReceiptPreview`, `ManualDeveloperModeConnectionChecklist`, and `ManualDeveloperModeConnectionManifest`.

## Safe local preview runner model

Allowed metadata-only modes are `disabled`, `dry_run_only`, `manual_config_required`, `fixture_preview_only`, and `manual_localhost_ready`. Blocked/future modes are `auto_start_future`, `hosted_public_future`, `tunnel_future`, and `production_future`.

The runner configuration requires localhost or loopback host placeholders, config-required or metadata-only port placeholders, inert/config-required command plans, repo-root working-directory placeholders, no default binding, no process start, no external network access, no public URL, no live tunnel provider, no production mode, read-only defaults, preview-only behavior, fixture-safe metadata, manual-run gating, and receipt references.

## Manual developer-mode connection checklist

The checklist records manual prerequisites for future developer-mode connection readiness. It covers the Build 21 baseline, Build 22 runner readiness, manual local endpoint prerequisites, developer-mode connection prerequisites, no-secret-material checks, no-production checks, no-public-submission checks, no-real-app-ID checks, no-production-OAuth checks, no-tunnel checks, no-customer/private-data checks, no-unrestricted-write checks, no-protected-branch-mutation checks, no-destructive-action checks, no-money-movement checks, no-material-external-send checks, no-default-binding checks, no-process-start checks, no-remote-asset/script/style checks, expected manual verification steps, known gaps, and receipt preview references.

## Why no default binding

Build 22 does not bind a server by default because the public repo must not introduce reachable endpoint behavior, accidental exposure, or all-interface binding risk. Host and port remain localhost/config-required metadata only.

## Why no process start in CI/default mode

Build 22 does not start a process in CI/default mode because the target is deterministic metadata and manual checklist readiness, not execution. CI validates schemas, generated state, guards, and resources without launching local preview servers or subprocesses.

## Why no tunnel/public endpoint

Build 22 does not enable tunnels, public endpoint output, production OAuth, real app IDs, production domains, or app submission. Official docs describe developer-mode and testing flows, but Build 22 intentionally models only manual readiness and safety gates.

## Safety boundaries

Build 22 denies secret material, production deployment, public app submission, real domains, real app IDs, production OAuth clients, real public endpoints, customer/private data workflows, unrestricted live writes, protected branch mutation, destructive actions, production mutations, money movement, material external sends, credential entry or storage, external side effects, unsafe command strings, unsafe working directories, unsafe hosts, unsafe ports, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, process start in CI/default mode, external network access, tunnel provider live enablement, hosted/public mode, production mode, auto-start mode, missing read-only/preview/manual-gating flags, missing receipt references, and unknown runner or connection modes.

## Official documentation checked

Only official documentation was checked: OpenAI Apps SDK Build your MCP server, OpenAI Apps SDK Connect from ChatGPT, OpenAI Apps SDK Test your integration, OpenAI Apps SDK Reference, Model Context Protocol server resources specification, and Model Context Protocol transport specification.

No blog posts, third-party tutorials, scraped behavior, forum guesses, or stale memory were used as implementation authority.

## Consequences

Build 22 provides a controlled local preview workflow model without crossing into execution. The repo gains schema-validated runner/checklist/receipt metadata, tests, docs, generated state, CI guards, and read-only MCP resources. It still cannot run a local preview, create a real ChatGPT app, submit a public app, configure production OAuth, expose a public endpoint, or enable tunnels.

## Next target recommendation

The next build should add either a verifier-reviewed manual local preview exercise or a durable public-safe preview receipt ledger, while preserving no default binding, no CI/default process start, no tunnel/public endpoint, no secret material, no production behavior, and no real app submission.
