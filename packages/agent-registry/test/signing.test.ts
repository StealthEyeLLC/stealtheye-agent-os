import { describe, expect, it } from "vitest";
import { canonicalize, createUnsignedPayload } from "../src/canonicalize";
import { computeDigest } from "../src/digest";
import { trustedSignedAgentCard, trustedSignedToolManifest } from "../src/fixtures";
import { verifySignedAgentCard, verifySignedToolManifest } from "../src/signing";

describe("canonicalization, digesting, and signing", () => {
  it("canonicalizes objects with stable key ordering", () => {
    expect(canonicalize({ b: 2, a: { d: 4, c: 3 } })).toBe(canonicalize({ a: { c: 3, d: 4 }, b: 2 }));
  });

  it("produces stable sha-256 digests", () => {
    const payload = createUnsignedPayload(trustedSignedAgentCard());
    expect(computeDigest(payload)).toBe(computeDigest(payload));
    expect(computeDigest(payload)).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("verifies signed agent cards", () => {
    const result = verifySignedAgentCard(trustedSignedAgentCard());
    expect(result.valid).toBe(true);
  });

  it("verifies signed tool manifests", () => {
    const result = verifySignedToolManifest(trustedSignedToolManifest());
    expect(result.valid).toBe(true);
  });
});
