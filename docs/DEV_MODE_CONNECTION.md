# Dev-Mode Connection

Build 10 creates local/dev connection metadata for a future ChatGPT developer-mode connector.

## What exists

`@stealtheye/mcp-runtime` exposes `createDevModeConnectionInfo()` and a local/dev transport abstraction. The metadata is public-safe and states that the runtime is preview-only, not deployed, not publicly submitted, not OAuth-provisioned, and not write-capable.

## Current OpenAI docs alignment

Official OpenAI Apps SDK docs say ChatGPT Apps use MCP, and the Connect from ChatGPT guide says developer mode can be enabled under Settings → Apps & Connectors → Advanced settings when allowed by the organization. The same guide says creating a connector requires a reachable HTTPS MCP server endpoint and that local development may require exposing a development server through a tunnel.

## Build 10 boundary

This build does not claim that StealthEye is already connected to ChatGPT. It does not create a production deployment, provision OAuth credentials, register a public connector, submit an app, or expose live write tools.

## Later connection steps

A later build should wire the runtime to an official MCP SDK transport, deploy or tunnel a development endpoint when needed, test metadata refresh and MCP Inspector/API Playground behavior, and keep write tools disabled until Guard, receipts, and verifier-approved authority boundaries exist.
