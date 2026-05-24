export const MCP_RUNTIME_ID = "runtime:stealtheye-agent-os:build-10:local-dev";
export const MCP_RUNTIME_ACTOR_ID = "actor:fixture:chatgpt-dev-mode";
export const MCP_RUNTIME_NOW = "2026-01-01T00:00:00.000Z";
export const MCP_RUNTIME_SAFE_TOOL_NAMES = ["host.health","host.capabilities","mission.validate","mission.compile","mission.preview","mission.status.preview","guard.evaluate.preview","guard.receipt.preview","registry.agent_card.validate","registry.tool_manifest.validate","registry.manifest.diff.preview","registry.trust.preview","policy.hard_stops","policy.autonomy.summary"] as const;
export const RUNTIME_RESOURCE_URIS = {
  health: "app://stealtheye-agent-os/health",
  capabilities: "app://stealtheye-agent-os/capabilities",
  policy: "app://stealtheye-agent-os/policy",
  sampleMission: "app://stealtheye-agent-os/sample-mission",
  runtime: "app://stealtheye-agent-os/runtime",
  devMode: "app://stealtheye-agent-os/dev-mode"
} as const;
export const MCP_RUNTIME_FORBIDDEN_TOOL_KEYWORDS = ["write","delete","commit","branch","pull_request","pr.create","deploy","payment","purchase","browser.click","browser.type","workflow.dispatch","ci.rerun","secret","credential"] as const;
