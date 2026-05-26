# Local Dev UI Shell / Resource Rendering

Build 19 creates a local-dev UI shell/resource renderer for StealthEye Agent OS.

The shell renders the static fixture resources from `@stealtheye/control-plane-ui` into deterministic HTML/resource previews and readiness summaries. It remains static/local/fixture/preview-only and does not start a server by default.

Build 19 does not deploy a production frontend. It does not submit a public app. It does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows. It does not add remote scripts/assets. It does not bind a server by default.

## What Build 19 adds

- `@stealtheye/local-dev-ui-shell` package.
- Schemas/helpers for `LocalDevUiShell`, `LocalDevUiRoute`, `LocalDevUiRenderRequest`, `LocalDevUiRenderResult`, `LocalDevUiStaticAsset`, `LocalDevUiResourceLoadResult`, `LocalDevUiHydrationResult`, `LocalDevUiSafetyPolicy`, `LocalDevUiSafetyDecision`, `LocalDevUiReceiptPreview`, and `LocalDevUiFixtureBundle`.
- Static local routes for overview, missions, agents, tools, Guard, receipts, replay, memory, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server, Dev Endpoint, ChatGPT developer-mode status, and safe settings.
- Deterministic fixture rendering that loads a Control Plane UI resource, its template, hydration payload, safety decision, and receipt preview.
- Static asset descriptors that use only local app-safe `ui-asset://stealtheye/control-plane/...` or `ui://stealtheye/control-plane/...` schemes.

## Official docs checked

Only official documentation was checked for app/component/tool/resource behavior:

- OpenAI Apps SDK reference for MCP Apps UI bridge behavior, Apps SDK component resource metadata, and tool output-template metadata.
- OpenAI Apps SDK Build your ChatGPT UI guide for rendering HTML from an MCP server, resource templates, hydration, and `window.openai` bridge context.
- OpenAI Apps SDK UI and state guidance for component state and hydration concepts.
- Model Context Protocol specification for server resources, resource listing, and resource reading.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Boundary

The shell is static/local/fixture/preview-only. It does not include hosted app code, production OAuth clients, real app IDs, production domains, public deployed app URLs, real public endpoints, customer/private data, credential entry/storage, unrestricted live writes, production mutations, protected branch mutations, destructive actions, material external sends, remote scripts/styles/assets, external side effects, default server binding, or money movement.

## Future

Future Build 20 should connect the shell resources into the MCP server/dev endpoint path or implement a controlled localhost preview command, depending on environment.
