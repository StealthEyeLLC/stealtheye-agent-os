import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("public fixtures", () => {
  it("do not contain obvious real-secret material", () => {
    const source = readFileSync(join(process.cwd(), "src", "fixtures.ts"), "utf8");
    expect(source).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(source).not.toMatch(/BEGIN .* PRIVATE KEY/);
    expect(source).not.toMatch(/client_secret\s*=/);
    expect(source).toContain("No real secrets");
  });
});
