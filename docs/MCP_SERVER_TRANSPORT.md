# MCP Server Transport

Build 14 aligns StealthEye Agent OS with official MCP server and OpenAI Apps SDK transport patterns by adding `@stealtheye/mcp-server` as a server wrapper around the existing safe runtime tools.

## What Build 14 adds

- Server metadata and protocol metadata helpers.
- Tool and resource registry wrappers for App Host, repo/status, Memory Graph, and CodeOps runtime surfaces.
- Descriptor validation that rejects duplicate tool names, unsafe descriptors, destructive tools, and unrestricted live write tools.
- Health, capabilities, transport diagnostics, safety inventory, and dev connection manifest helpers.
- Receipt previews for tool calls through the server wrapper.
- Local/dev transport modeling for `in_process` and `stdio_dev`.
- Future-mode modeling for `http_dev_preview` and `hosted_future`.

## Transport boundary

Build 14 implements only local/dev safe transport behavior. `http_dev_preview` is modeled but not bound to a public endpoint. `hosted_future` is modeled as future work.

Build 14 does not deploy production infrastructure, submit a public ChatGPT app, add production OAuth credentials, add production domains, add public app identifiers, or expose unrestricted live write tools.

## Existing runtime surfaces preserved

The server wrapper composes the existing MCP runtime surfaces:

- App Host safe tools remain read-only preview/fixture surfaces.
- repo/status tools remain read-only live public-safe tools.
- Memory Graph tools remain preview-only and fixture-only.
- CodeOps write preview tools remain preview-only.
- CodeOps fixture write remains fixture-only and non-destructive.

The wrapper preserves safety truth in descriptors: read-only flags, preview-only flags, fixture-only flags, live capability status, destructive false, production mutation false, protected branch mutation false, secret access false, customer data false, and money movement false.

## Official docs checked

Build 14 checked current official documentation only for API and transport behavior:

- OpenAI Apps SDK documentation for MCP server patterns, tool registration metadata, and ChatGPT developer-mode preparation.
- Model Context Protocol specification for protocol metadata, tools list/call, resources list/read, and transport concepts.
- Model Context Protocol transport specification for stdio and Streamable HTTP transport guidance.

No blog posts, third-party tutorials, or unofficial SDK behavior were used as implementation authority.

## SDK package decision

The official SDK package was not added in Build 14. This connector-only session can create branches, write commits, open a PR, and poll CI, but cannot run dependency resolution locally before pushing. To avoid destabilizing CI with an unverified dependency change, Build 14 implements an SDK-aligned adapter boundary and documents the gap.

The adapter boundary keeps method names, metadata, descriptors, tool calls, resource reads, transport diagnostics, and manifest shape ready for a later replacement with the official SDK package after dependency compatibility is verified.

## Developer-mode connection status

Developer-mode connection remains local/dev or future configuration. The dev connection manifest intentionally contains no credential material, production endpoint, production app identifier, production OAuth client, production domain, or cloud account detail.

## Not included

- No production hosting.
- No public endpoint.
- No OAuth production app.
- No public ChatGPT app submission.
- No real app identifiers.
- No unrestricted live write path.
- No protected branch mutation path.
- No destructive deletion path.
- No customer/private data path.
- No money movement path.
