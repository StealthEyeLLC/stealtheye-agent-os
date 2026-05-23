# App Host

The App Host is the first ChatGPT App / MCP Server Host Shell foundation for StealthEye Agent OS.

## Build 5 implementation

`packages/app-host` exposes existing package foundations through a safe, non-production, MCP-style adapter layer:

- Agent Registry validation, manifest diff preview, and fixture-backed trust preview;
- Guard decision preview and Guard decision receipt preview;
- Mission OS / StealthEye Mission Language validation, compile, preview, and status preview;
- policy boundary and hard-stop summaries;
- static resource descriptors for health, capabilities, policy, and sample mission content.

This is not a live production app or deployed MCP server. It is a typed host shell with descriptors, schemas, handlers, fixtures, and eval-style tests.

## Tool families

Build 5 tool families are:

- `host.health`
- `host.capabilities`
- `mission.validate`
- `mission.compile`
- `mission.preview`
- `mission.status.preview`
- `guard.evaluate.preview`
- `guard.receipt.preview`
- `registry.agent_card.validate`
- `registry.tool_manifest.validate`
- `registry.manifest.diff.preview`
- `registry.trust.preview`
- `policy.hard_stops`
- `policy.autonomy.summary`

All tools are read-only, fixture-only, or preview-only. No tool has live write capability.

## Resources

The shell includes static resource descriptors:

- `app://stealtheye-agent-os/health`
- `app://stealtheye-agent-os/capabilities`
- `app://stealtheye-agent-os/policy`
- `app://stealtheye-agent-os/sample-mission`

These resources are in-memory/static and intended to map cleanly to future MCP resources.

## Worker Fleet relationship

Build 6 adds `@stealtheye/worker-fleet` downstream of App Host and Mission OS. App Host may eventually expose worker-task previews or mission execution status, but Build 5 host tools remain preview-only and Build 6 Worker Fleet does not add live execution. Neither package grants authority or bypasses Guard.

## Public/private boundary

Build 5 does not add real secrets, production endpoints, customer data, private OAuth clients, real cloud/account identifiers, sensitive runbooks, production tokens, live deployment targets, live write APIs, money movement, browser automation, CI reruns, branch creation, commits, PR creation, or worker execution. Build 6 still does not add live worker runtime, live queue credentials, repo mutation, or browser automation.

## MCP direction

The package models an MCP-style server surface through descriptors, resource definitions, and `AppHostServer.callTool`. It does not yet depend on a full MCP SDK. Future work can wire these descriptors and handlers to the official server runtime.

## Next step

Build 7 should implement CodeOps + CI Repair foundations while preserving App Host preview boundaries, Worker Fleet task contracts, and Guard-gated execution.
