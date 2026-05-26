# MCP Server Resource Wiring / Controlled Localhost Preview

Build 20 wires local UI shell resources into the MCP server resource layer and models a controlled localhost preview path.

The MCP server can now list and read existing MCP resources, Control Plane UI resources, rendered Local Dev UI Shell resources, and localhost-preview metadata resources. Resource wiring is static/local/fixture/preview-only and does not start or bind a server by default.

Build 20 does not deploy a production frontend. It does not bind a server by default. It does not submit a public app. It does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows. It does not add remote scripts/assets. It does not add tunnel credentials.

## What Build 20 adds

- MCP UI resource adapter for `ui://stealtheye/control-plane/...` resources from `@stealtheye/control-plane-ui`.
- Render-resource adapter for `ui-render://stealtheye/control-plane/...` resources from `@stealtheye/local-dev-ui-shell`.
- Controlled localhost-preview metadata resources under `localhost-preview://stealtheye/control-plane/...`.
- Readiness report, safety policy, safety decision, and receipt-preview helpers for resource listing and reading.
- MCP server tests proving existing resources still list/read while UI resources, render resources, and localhost-preview metadata remain read-only, fixture-only, preview-only, and public-safe.

## Official docs checked

Only official documentation was checked for app/component/tool/resource/transport behavior:

- OpenAI Apps SDK reference for component resources, resource metadata, tool metadata, and output-template metadata.
- OpenAI Apps SDK Build your ChatGPT UI guide for resource templates, HTML rendering, hydration concepts, and `window.openai` bridge context.
- OpenAI Apps SDK UI/state guidance for component state and hydration.
- Model Context Protocol specification for server resources, including resource listing and resource reading.
- Model Context Protocol specification for server transports, including stdio and streamable HTTP transport concepts.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Boundary

Build 20 resource wiring is static/local/fixture/preview-only. It does not include hosted app code, production OAuth clients, real app IDs, production domains, public deployed app URLs, real public endpoints, customer/private data, credential entry/storage, unrestricted live writes, production mutations, protected branch mutations, destructive actions, material external sends, remote scripts/styles/assets, external network access, tunnel live enablement, default server binding, or money movement.

`disabled`, `static_fixture_preview`, and `localhost_config_required` metadata are modeled as read-only resources. `localhost_bound_future` and `hosted_future` remain blocked/future.

## Future

Future Build 21 should add an explicit controlled localhost preview command if environment supports it, or connect developer-mode resources using config-required metadata.
