# ADR 0020: Control Plane UI Component Resources

## Status

Accepted for Build 18.

## Context

Build 17 added `@stealtheye/control-plane-app` as a model/fixture/preview-only control surface. Build 18 needs the first UI component/resource descriptors that can later be served by `@stealtheye/mcp-server` or Apps SDK resources without adding production hosting, real credentials, real app IDs, production domains, public app submission, or live mutation.

## Decision

Add `@stealtheye/control-plane-ui` as a model/static/fixture/preview-only package. It defines Apps SDK-style Control Plane UI component descriptors, resource descriptors, templates, metadata, hydration contracts, safety policies, safety decisions, and fixture bundles.

The package uses only local app-safe `ui://stealtheye/control-plane/...` resource URIs and static declarative templates. Hydration payloads summarize the existing Build 17 control-plane app fixture state, navigation, views, panels, actions, safety inventory, receipt previews, and known gaps.

## Official documentation checked

Build 18 checked current official documentation only:

- OpenAI Apps SDK overview.
- OpenAI Apps SDK reference for component resources, `registerResource`, resource `_meta` fields, and tool metadata.
- OpenAI Apps SDK reference for `_meta["openai/outputTemplate"]` tool metadata.
- OpenAI Apps SDK examples for component/resource patterns.
- Model Context Protocol specification for server resources and server tools.

No blog posts, third-party tutorials, or scraping-based API behavior were used as implementation authority.

## Safety boundaries

Build 18 does not deploy a production frontend, does not submit a public app, does not add production OAuth credentials, does not add real app IDs, does not add production domains, does not add customer/private data workflows, and does not expose unrestricted live write tools.

The UI safety policy denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe resource URI schemes, missing read-only/preview/fixture flags, missing receipt references, and unknown component/resource types.

## Consequences

The repo now has public-safe UI component/resource contracts that can be reviewed and later connected to MCP server/App SDK resource serving. It does not include production hosting, real authentication, real user data, credential entry, public submission, or live mutation.

## Next

Build 19 should implement a local dev UI shell or wire these resources into a developer-mode connection, depending on environment readiness.
