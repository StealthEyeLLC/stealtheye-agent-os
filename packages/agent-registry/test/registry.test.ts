import { describe, expect, it } from "vitest";
import { InMemoryTrustRegistry } from "../src/registry";
import { trustedFixtureRegistryRecord, trustedSignedAgentCard, trustedSignedToolManifest, untrustedAgentCard } from "../src/fixtures";

describe("in-memory trust registry", () => {
  it("accepts trusted signed fixtures", () => {
    const agent = trustedSignedAgentCard();
    const manifest = trustedSignedToolManifest();
    const registry = new InMemoryTrustRegistry();
    registry.trustPublisher(trustedFixtureRegistryRecord(agent, manifest));
    expect(registry.verifyAgentCard(agent).trusted).toBe(true);
    expect(registry.verifyToolManifest(manifest).trusted).toBe(true);
  });

  it("rejects untrusted publishers", () => {
    const agent = trustedSignedAgentCard();
    const manifest = trustedSignedToolManifest();
    const registry = new InMemoryTrustRegistry();
    registry.trustPublisher(trustedFixtureRegistryRecord(agent, manifest));
    expect(registry.verifyAgentCard(untrustedAgentCard()).trusted).toBe(false);
  });

  it("rejects revoked agents", () => {
    const agent = trustedSignedAgentCard();
    const manifest = trustedSignedToolManifest();
    const registry = new InMemoryTrustRegistry();
    registry.trustPublisher(trustedFixtureRegistryRecord(agent, manifest));
    registry.revocations.revoke({ target_type: "agent_id", target: agent.agent_id, reason: "test revocation", evidence_ref: "test://revoked-agent" });
    expect(registry.verifyAgentCard(agent).trusted).toBe(false);
  });
});
