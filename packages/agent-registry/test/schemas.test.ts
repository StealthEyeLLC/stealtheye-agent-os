import { describe, expect, it } from "vitest";
import { AgentCardSchema, ToolManifestSchema } from "../src/schemas";
import { trustedSignedAgentCard, trustedSignedToolManifest } from "../src/fixtures";

describe("agent registry schemas", () => {
  it("validates a signed agent card fixture", () => {
    expect(AgentCardSchema.safeParse(trustedSignedAgentCard()).success).toBe(true);
  });

  it("rejects an invalid agent card", () => {
    const invalid = { ...trustedSignedAgentCard(), agent_id: "" };
    expect(AgentCardSchema.safeParse(invalid).success).toBe(false);
  });

  it("validates a signed tool manifest fixture", () => {
    expect(ToolManifestSchema.safeParse(trustedSignedToolManifest()).success).toBe(true);
  });

  it("rejects an invalid tool manifest", () => {
    const invalid = { ...trustedSignedToolManifest(), tools: [] };
    expect(ToolManifestSchema.safeParse(invalid).success).toBe(false);
  });
});
