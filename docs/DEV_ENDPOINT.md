# Dev Endpoint

Build 15 creates a dev-only reachable endpoint and tunnel foundation for connecting `@stealtheye/mcp-server` to ChatGPT developer mode in a later build.

## What Build 15 adds

- `@stealtheye/dev-endpoint` package with configuration schemas, tunnel-provider schemas, safety policy checks, health checks, readiness reports, manifests, and receipt previews.
- Endpoint modes for `disabled`, `localhost_only`, `tunnel_config_required`, `reachable_dev_preview`, and `hosted_future`.
- Tunnel providers for `none`, `cloudflare_tunnel_future`, `ngrok_future`, `localhost_forward_future`, and `custom_future`.
- Local/fixture modeling only. Any real tunnel provider remains future/config-required and blocked unless safety inventory, health, and receipt preview requirements are satisfied.

## Explicit boundary

Build 15 does not deploy production infrastructure. It does not create a public endpoint. It does not submit a public ChatGPT app. It does not add production OAuth credentials. It does not add tunnel secrets. It does not add cloud credentials. It does not expose unrestricted live write tools.

Developer-mode connection remains local/dev or future config-required. Future Build 16 may connect from ChatGPT developer mode once a safe reachable dev endpoint exists.

## Safety policy

The dev endpoint safety policy denies production mode, public production domains, real production OAuth clients or secrets, tunnel auth values, cloud credentials, unrestricted live write tools, protected branch mutation, destructive operations, customer/private data, money movement, material external sends, production deployment, missing safety inventory, missing health checks, missing receipt preview, and unknown tunnel provider live enablement.

The policy may allow disabled mode, localhost-only mode, fixture/dev preview manifests, and placeholder-only tunnel-config-required mode. These allowed modes have no secrets, no real endpoint, no production domain, no external side effects, and no public app submission.

## Manifest and readiness

The manifest describes endpoint name, mode, transport mode, server package, fixture endpoint identifier, tunnel provider status, required future config, tool/resource/safety inventory summaries, health status, readiness status, connection instructions, and explicit no-secret/no-production/no-OAuth/no-public-app-submission statements.

Readiness reports can mark a fixture as ready for local development or ready for tunnel configuration while still blocking public submission and production. This is intentional: Build 15 prepares the shape of the endpoint and the safety gate, not a public deployment.

## Official docs checked

Only official documentation was used for endpoint, transport, and app-connection behavior:

- OpenAI Apps SDK Quickstart and MCP Server docs: apps use MCP servers to expose tools and connect to ChatGPT.
- OpenAI Apps SDK Connect from ChatGPT, Test your integration, Submit your app, and Security & Privacy docs: developer-mode connection and public submission remain separate later steps.
- OpenAI Secure MCP Tunnel docs: checked only to understand future development tunnel behavior; no tunnel credential or live tunnel configuration is committed.
- Model Context Protocol transport specification: checked stdio local process transport and Streamable HTTP remote transport guidance.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Not included

- No production hosting.
- No public endpoint.
- No real tunnel URL.
- No OAuth production app.
- No public ChatGPT app submission.
- No real app identifiers.
- No unrestricted live write path.
- No protected branch mutation path.
- No destructive deletion path.
- No customer/private data path.
- No money movement path.
