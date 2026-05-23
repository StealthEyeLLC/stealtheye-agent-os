# Security

Security is a first-class control layer, not a post-hoc review step.

## Hard stops

- deletion/destruction
- raw secrets/credentials
- money/refunds/purchases/billing/subscriptions
- production deployment or production data mutation
- production-impacting DB migrations
- auth/security-critical changes
- direct protected branch mutation
- force push/history rewrite
- weakening CI/tests/security controls to pass
- material external sends as Jamie/company
- legal commitments/contracts
- platform/OpenAI-required confirmations

## Build 2 signing posture

Agent cards and tool manifests are verified over canonical unsigned payloads with SHA-256 digests and Ed25519 signatures. The repo contains no real private keys. Test fixtures generate local in-memory test keys and are labeled as public test fixtures. Future production signing should be backed by private KMS/HSM or equivalent private systems.

## Build 3 Guard posture

Guard capability tokens are delegated-authority records, not credential storage and not production auth tokens. They encode mission-scoped authority, target constraints, tool/manifest constraints, time windows, usage budgets, evidence requirements, receipt requirements, escalation requirements, and lifecycle status.

Guard policy evaluation must never silently allow hard stops. Build 3 maps hard stops to deny or escalate decisions and records matched hard stops and reason codes in Guard decision receipts. Registry trust summaries are consumed as enforcement input; a valid signed manifest is necessary for trusted operation but is not sufficient authority by itself.

## Build 4 Mission OS posture

Mission OS turns user intent into typed mission structures, authority envelopes, plan steps, status summaries, receipt references, and Guard-compatible action templates. Mission OS does not issue production credentials, store secrets, bypass Guard, or execute workers. Hard-stop missions may appear as fixtures to verify escalation behavior, not as enabled production actions.

## Build 5 App Host posture

App Host exposes only read-only, fixture-only, or preview-only tools. It can validate, compile, preview, summarize, and produce fixture-backed Guard/Registry/Mission outputs, but it cannot mutate repositories, create branches, commit, open PRs, rerun CI, automate browsers, deploy, delete, access secrets, move money, send external messages, access customer data, or execute workers.

## Build 6 Worker Fleet posture

Worker Fleet defines durable execution contracts for worker tasks, leases, fencing tokens, idempotency, retry state, artifacts, receipts, Mission OS plan handoff, and Guard preflight. It must not execute live actions, mutate repositories, run browsers, deploy, access raw secrets, store customer data, move money, or connect to live queues in this build.

Action-bearing worker tasks must pass Guard preflight before any future executor can run them. Deny decisions block the task; escalate decisions wait/block for escalation; allowed decisions only move the task toward readiness. Worker fixtures are fake, local, public-safe, and include no live queue credentials, storage buckets, production endpoints, or real account identifiers.

## Secrets broker

Secrets must remain in private systems. A Secrets Broker may provide brokered operations, scoped environment injection, or signing/delegation without returning raw secret values to agents, logs, receipts, or public repo files.

## Semantic firewall

The Semantic Firewall treats repo content, logs, browser pages, documents, issue comments, model outputs, Mission Language input, app-host input, worker artifacts/receipts, and tool outputs as potentially malicious. It detects prompt injection, data exfiltration attempts, authority confusion, and instruction smuggling.

## Prompt injection and tool poisoning

Threats include malicious README files, CI logs, web pages, browser DOM content, issue comments, generated manifests, Mission Language documents, app-host tool inputs, worker artifacts/receipts, and remote MCP tool descriptions. Tool outputs must not override system, developer, repo, mission, worker, or Guard policy.

Signed manifests reduce tool poisoning risk but do not remove the need for Guard checks. A valid signature proves provenance and integrity for a signed payload; it does not prove a tool call is authorized for a mission.

## MCP authorization requirements

Protected HTTP MCP servers should align toward OAuth 2.1 practices: protected resource metadata, authorization server metadata discovery, controlled client registration, auth discovery, audience-bound tokens, scope enforcement per tool and mission, no token passthrough, exact redirect URI validation, PKCE where relevant, and confused-deputy defense.

Build 5 does not implement OAuth or production MCP authorization. Build 6 does not implement production worker authorization or live queue credentials.

## Public/private boundary

Public repo content may contain architecture, public specs, schemas, mock data, eval templates, app-host descriptors, worker-fleet contracts, preview fixtures, and governance docs. Private systems contain secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, sensitive runbooks, production signing keys, production capability issuance systems, production Mission OS state, deployed app-host runtime configuration, live queue credentials, and worker infrastructure.

## Security evidence

Receipts should capture denials, approvals, policy decisions, mission ids, authority envelopes, app-host previews, worker task events, leases, retries, idempotency records, manifest identities, manifest digests, registry decisions, Guard decisions, matched capability tokens, policy checks, hard stops, tool calls, redactions, auth scopes, CI/security check results, and incident-relevant artifacts.
