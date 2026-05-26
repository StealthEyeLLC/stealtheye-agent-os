# ChatGPT Developer Mode Connection

Build 16 models the ChatGPT developer-mode connection workflow for `@stealtheye/mcp-server` through `@stealtheye/dev-endpoint`.

Build 16 does not perform a real ChatGPT connection. It does not submit a public app. It does not add OAuth production credentials. It does not add tunnel secrets. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools.

Developer-mode connection remains local/dev, fixture-only, or future manual configuration. The package uses fake/local placeholders such as `chatgpt-dev://fixture/stealtheye-agent-os`, `dev-endpoint://fixture/stealtheye-agent-os`, and `http://localhost:3000/mcp`.

## What Build 16 adds

- `@stealtheye/chatgpt-dev-connection` with schemas for connection plans, checklists, manifests, safety policies, safety decisions, readiness reports, and receipt previews.
- Connection stages for `prerequisites`, `endpoint_ready`, `app_manifest_ready`, `connect_from_chatgpt`, `test_integration`, and `submit_app_future`.
- Fixture-only manifest generation around Build 14 MCP server metadata and Build 15 dev endpoint readiness.
- Safety decisions that deny production submission, real app IDs, production OAuth clients/secrets, production domains, real public endpoints, tunnel auth values, cloud credentials, unrestricted live write tools, protected branch mutation tools, destructive tools, production mutation tools, customer/private data, money movement, missing dev endpoint readiness, missing MCP server safety inventory, missing receipt preview, and missing no-secret/no-production boundary statements.

## Official docs checked

Only official documentation was checked for app/developer-mode connection behavior:

- OpenAI Apps SDK overview: apps extend ChatGPT and use MCP server concepts.
- OpenAI Apps SDK Connect from ChatGPT guide: developer-mode connection remains a later manual connection step.
- OpenAI Apps SDK Test your integration guide: Build 16 represents only fixture/local testing plans.
- OpenAI Apps SDK Submit your app guide: public submission is separate and remains blocked/future.
- OpenAI Apps SDK Security & Privacy guide: Build 16 keeps the no-secret, no-production, no-customer-data, no-unrestricted-live-write boundary.
- Model Context Protocol docs: Build 16 keeps MCP server/tool/resource modeling aligned with the official MCP client/server pattern.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Future

Build 17 should create the first app/control-plane UX surface or perform the safe manual developer-mode connection step, depending on environment readiness.
