import { describe, expect, it } from "vitest";
import { diffSignedPayloads } from "../src/diff";
import { riskyEscalatedToolManifest, trustedSignedToolManifest } from "../src/fixtures";

describe("manifest diffing", () => {
  it("detects risk, auth/scope, tool, and side-effect changes requiring review", () => {
    const diff = diffSignedPayloads(trustedSignedToolManifest(), riskyEscalatedToolManifest());
    expect(diff.requires_review).toBe(true);
    expect(diff.changes.map((change) => change.kind)).toContain("risk_tier_change");
    expect(diff.changes.map((change) => change.kind)).toContain("auth_scope_change");
    expect(diff.changes.map((change) => change.kind)).toContain("tool_change");
    expect(diff.changes.map((change) => change.kind)).toContain("side_effect_change");
  });
});
