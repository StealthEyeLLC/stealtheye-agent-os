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

## Secrets broker

Secrets must remain in private systems. A Secrets Broker may provide brokered operations, scoped environment injection, or signing/delegation without returning raw secret values to agents, logs, receipts, or public repo files.

## Semantic firewall

The Semantic Firewall treats repo content, logs, browser pages, documents, issue comments, model outputs, and tool outputs as potentially malicious. It detects prompt injection, data exfiltration attempts, authority confusion, and instruction smuggling.

## Prompt injection and tool poisoning

Threats include malicious README files, CI logs, web pages, browser DOM content, issue comments, generated manifests, and remote MCP tool descriptions. Tool outputs must not override system, developer, repo, mission, or Guard policy.

## MCP authorization requirements

Protected HTTP MCP servers should align toward OAuth 2.1 practices:

- protected resource metadata for MCP resources;
- authorization server metadata discovery;
- dynamic client registration or a documented controlled alternative;
- `WWW-Authenticate` auth discovery where relevant;
- audience-bound tokens;
- scope enforcement per tool and mission;
- no token passthrough between services;
- exact redirect URI validation;
- PKCE where relevant;
- confused-deputy defense through audience, issuer, subject, scope, and resource checks.

## Public/private boundary

Public repo content may contain architecture, public specs, schemas, mock data, eval templates, and governance docs. Private systems contain secrets, credentials, production endpoints, customer data, internal OAuth clients, cloud/account details, and sensitive runbooks.

## Security evidence

Receipts should capture denials, approvals, policy decisions, manifest identities, tool calls, redactions, auth scopes, CI/security check results, and incident-relevant artifacts.
