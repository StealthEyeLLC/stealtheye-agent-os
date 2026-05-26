# Control Plane UI Component Resources

Build 18 creates the first Control Plane UI Component Resources for StealthEye Agent OS.

The resources model Apps SDK-style component/resource descriptors around `@stealtheye/control-plane-app`. They define static descriptors, local `ui://stealtheye/control-plane/...` resource URIs, fixture-safe templates, metadata, hydration payloads, UI safety policy decisions, and a fixture bundle.

Build 18 does not deploy a production frontend. It does not submit a public app. It does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows.

## What Build 18 adds

- `@stealtheye/control-plane-ui` package.
- Schemas/helpers for `ControlPlaneUiComponent`, `ControlPlaneUiResource`, `ControlPlaneUiTemplate`, `ControlPlaneUiMetadata`, `ControlPlaneUiHydrationPayload`, `ControlPlaneUiSafetyPolicy`, `ControlPlaneUiSafetyDecision`, and `ControlPlaneUiFixtureBundle`.
- Static descriptors for overview dashboard, mission list/detail, agent registry, tool inventory, Guard decisions, receipt timeline, replay report, memory context, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server status, Dev Endpoint status, ChatGPT developer-mode status, and safe settings.
- Fixture-only hydration that summarizes the control-plane state snapshot, navigation, views, panels, actions, safety inventory, receipt previews, and known gaps.
- A UI safety policy that denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, external side effects, unsafe resource URI schemes, missing read-only/preview/fixture flags, missing receipt references, and unknown component/resource types.

## Official docs checked

Only official documentation was checked for app/component/tool/resource behavior:

- OpenAI Apps SDK overview for ChatGPT app and MCP concepts.
- OpenAI Apps SDK reference for component resources, `registerResource`, and resource `_meta` fields.
- OpenAI Apps SDK reference for tool metadata including `_meta["openai/outputTemplate"]`.
- OpenAI Apps SDK examples for component/resource patterns.
- Model Context Protocol specification for server resources and server tools.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Boundary

UI resources are model/static/fixture/preview-only. They do not include hosted app code, production OAuth clients, real app IDs, production domains, public deployed app URLs, real public endpoints, customer/private data, credential entry/storage, unrestricted live writes, production mutations, protected branch mutations, destructive actions, material external sends, external side effects, or money movement.

## Future

Future Build 19 should implement a local dev UI shell or wire these resources into a developer-mode connection, depending on environment readiness.
