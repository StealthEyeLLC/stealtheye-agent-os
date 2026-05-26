# Control Plane App

Build 17 creates the first Core Control Plane App model for StealthEye Agent OS.

The app organizes missions, agents, tools, Guard decisions, receipts, replay, memory, repo status, CodeOps, BrowserOps, Worker Fleet, MCP server, Dev Endpoint readiness, and ChatGPT developer-mode connection readiness into a coherent model/fixture/preview-only control surface.

Build 17 does not deploy a production frontend. It does not submit a public app. It does not add production OAuth credentials. It does not add real app IDs. It does not add production domains. It does not expose unrestricted live write tools. It does not add customer/private data workflows.

## What Build 17 adds

- `@stealtheye/control-plane-app` package.
- Schemas for `ControlPlaneApp`, navigation, views, panels, actions, state snapshots, safety policies, safety decisions, receipt previews, and fixture state.
- Fixture navigation for overview, missions, agents, tools, guard, receipts, replay, memory, repo_status, codeops, browserops, worker_fleet, mcp_server, dev_endpoint, chatgpt_developer_mode, and settings_safe.
- Preview-only app actions for navigation, mission compile preview, guard decision preview, CodeOps plan preview, BrowserOps plan preview, memory context preview, receipt report preview, and fixture state refresh.
- A safety policy that denies production deployment, public app submission, real OAuth clients/secrets, real app IDs, production domains, real public endpoints, unrestricted live write actions, protected branch mutation actions, destructive actions, production mutation actions, customer/private data actions, money movement actions, material external sends, credential entry/storage, missing Guard boundary, missing receipt preview, and unknown action categories.

## Official docs checked

Only official documentation was checked for app/component/tool/resource behavior:

- OpenAI Apps SDK overview for ChatGPT app structure and MCP app concepts.
- OpenAI Apps SDK reference for tool, component, resource, and metadata concepts.
- OpenAI Apps SDK examples for future UI component/resource direction.
- Model Context Protocol docs for server, client, tool, and resource concepts.

No blog posts, third-party tutorials, or unofficial API behavior were used as implementation authority.

## Future

Future Build 18 should implement the first UI/component resources or a local dev app shell, depending on environment readiness.
