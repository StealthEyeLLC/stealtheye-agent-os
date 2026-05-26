# ADR 0021: Local Dev UI Shell / Resource Rendering

## Status

Accepted for Build 19.

## Context

Build 17 added `@stealtheye/control-plane-app` as a model/fixture/preview-only control surface. Build 18 added `@stealtheye/control-plane-ui` as Apps SDK-style component/resource descriptors, templates, metadata, and hydration contracts. Build 19 needs a local/dev-only shell that can render those static fixture resources into deterministic HTML/resource previews without adding production hosting, real credentials, real app IDs, production domains, public app submission, remote assets, default server binding, or live mutation.

## Decision

Add `@stealtheye/local-dev-ui-shell` as a static/local/fixture/preview-only package. It defines route descriptors, local shell modes, resource loading, deterministic static rendering, hydration summaries, local static asset descriptors, safety policy decisions, and receipt previews.

Build 19 implements `disabled` and `static_fixture_preview`. `localhost_dev_preview` is modeled only. `hosted_future` is blocked/future.

The package uses only local app-safe route paths and `ui://stealtheye/control-plane/...` resources from `@stealtheye/control-plane-ui`. Static assets use only `ui-asset://stealtheye/control-plane/...` or `ui://stealtheye/control-plane/...` fixture-safe schemes. No remote scripts, remote styles, external CDN assets, public domains, production endpoints, or default server bindings are added.

## Official documentation checked

Build 19 checked current official documentation only:

- OpenAI Apps SDK reference for MCP Apps UI bridge behavior, Apps SDK resource metadata, component resources, and tool metadata including output-template metadata.
- OpenAI Apps SDK Build your ChatGPT UI guide for rendering HTML from MCP resources, resource templates, hydration, and bridge concepts.
- OpenAI Apps SDK UI/state guidance for component state and hydration concepts.
- Model Context Protocol specification for server resources, resources/list, and resources/read.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Safety boundaries

Build 19 does not deploy a production frontend, does not submit a public app, does not add production OAuth credentials, does not add real app IDs, does not add production domains, does not add customer/private data workflows, does not expose unrestricted live write tools, does not add remote scripts/assets, and does not bind a server by default.

The Local Dev UI Shell safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe route paths, unsafe resource URI schemes, remote scripts/styles/assets, server binding by default, missing read-only/preview/fixture flags, missing receipt references, and unknown route/component/resource types.

## Consequences

The repo now has a deterministic local fixture renderer for Control Plane UI resources. It can be reviewed in tests and later wired into MCP server/dev endpoint resource serving without changing the public/private boundary.

## Next

Build 20 should connect shell resources into the MCP server/dev endpoint path or implement a controlled localhost preview command, depending on environment readiness.
