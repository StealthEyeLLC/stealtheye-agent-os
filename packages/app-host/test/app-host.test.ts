import { describe, expect, it } from "vitest";
import {
  APP_HOST_PUBLIC_FIXTURE_NOTICE,
  APP_HOST_TOOL_DESCRIPTORS,
  AppHostToolNameSchema,
  createAppHostServer,
  handleAppHostTool,
  invalidMissionLanguageFixture,
  assertNoLiveWriteTools
} from "../src";

function toolResult(name: Parameters<typeof handleAppHostTool>[0], input: unknown = {}) {
  return handleAppHostTool(name, input) as { ok: boolean; preview_only: boolean; fixture_only: boolean; result: any; warnings: string[]; evidence_refs: string[] };
}

describe("App Host foundation shell", () => {
  it("host health returns foundation-shell status", () => {
    const server = createAppHostServer();
    const result = server.callTool({ name: "host.health" }) as { status: string; build_stage: string; production_ready: false; live_write_capabilities: false };
    expect(result.status).toBe("ok");
    expect(result.build_stage).toBe("build-5-foundation-shell");
    expect(result.production_ready).toBe(false);
    expect(result.live_write_capabilities).toBe(false);
  });

  it("host capabilities list expected tool families", () => {
    const result = createAppHostServer().callTool({ name: "host.capabilities" }) as { tool_families: string[]; tools: unknown[]; production_ready: false };
    expect(result.tool_families).toEqual(["host", "mission", "guard", "registry", "policy"]);
    expect(result.tools).toHaveLength(14);
    expect(result.production_ready).toBe(false);
  });

  it("mission.validate accepts valid fixture mission", () => {
    const result = toolResult("mission.validate", { fixture: "normal_repo_feature" });
    expect(result.ok).toBe(true);
    expect(result.result.valid).toBe(true);
  });

  it("mission.validate rejects invalid fixture mission", () => {
    const result = toolResult("mission.validate", { mission_language: invalidMissionLanguageFixture });
    expect(result.ok).toBe(false);
    expect(result.result.valid).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("mission.compile returns normalized mission structures", () => {
    const result = toolResult("mission.compile", { fixture: "normal_repo_feature" });
    expect(result.ok).toBe(true);
    expect(result.result.mission.schema_version).toBe("stealtheye-mission.v1");
    expect(result.result.authority_envelope.schema_version).toBe("authority-envelope.v1");
    expect(result.result.plan.schema_version).toBe("mission-plan.v1");
    expect(result.result.status.schema_version).toBe("mission-status.v1");
    expect(result.result.receipt_expectations.schema_version).toBe("mission-receipt-refs.v1");
    expect(result.result.capability_token_template.schema_version).toBe("capability-token.v1");
    expect(result.result.requested_action_templates.length).toBeGreaterThan(0);
  });

  it("mission.preview marks hard-stop mission appropriately", () => {
    const result = toolResult("mission.preview", { fixture: "hard_stop_production_deploy" });
    expect(result.ok).toBe(true);
    expect(result.result.hard_stop_preview).toBe(true);
    expect(result.result.requested_action_templates[0].effect).toBe("production_deploy");
  });

  it("guard.evaluate.preview allows safe fixture action", () => {
    const result = toolResult("guard.evaluate.preview", { fixture: "safe_repo_write" });
    expect(result.ok).toBe(true);
    expect(result.result.decision).toBe("allow");
    expect(result.result.reason_codes).toEqual([]);
  });

  it("guard.evaluate.preview escalates or denies hard-stop fixture action", () => {
    const result = toolResult("guard.evaluate.preview", { fixture: "hard_stop_production_deploy" });
    expect(result.ok).toBe(true);
    expect(["escalate", "deny"]).toContain(result.result.decision);
    expect(result.result.reason_codes).toContain("hard_stop:production_deploy_or_data_mutation");
  });

  it("guard.receipt.preview returns receipt-friendly fields", () => {
    const result = toolResult("guard.receipt.preview", { fixture: "safe_repo_write" });
    expect(result.ok).toBe(true);
    expect(result.result.schema_version).toBe("guard-decision-receipt.v1");
    expect(result.result.decision_id).toContain("guard-decision:");
    expect(result.result.requested_effect).toBe("write_branch_files");
  });

  it("registry agent-card validation accepts trusted fixture", () => {
    const result = toolResult("registry.agent_card.validate", { fixture: "trusted" });
    expect(result.ok).toBe(true);
    expect(result.result.valid).toBe(true);
    expect(result.result.agent_id).toBe("agent:codeops-fixture");
  });

  it("registry tool-manifest validation accepts trusted fixture", () => {
    const result = toolResult("registry.tool_manifest.validate", { fixture: "trusted" });
    expect(result.ok).toBe(true);
    expect(result.result.valid).toBe(true);
    expect(result.result.manifest_id).toBe("tool-manifest:codeops-fixture");
  });

  it("registry manifest diff preview detects risky escalation fixture", () => {
    const result = toolResult("registry.manifest.diff.preview");
    expect(result.ok).toBe(true);
    expect(result.result.requires_review).toBe(true);
    expect(result.result.changes.map((change: { kind: string }) => change.kind)).toContain("risk_tier_change");
  });

  it("registry trust preview returns trusted fixture decision", () => {
    const result = toolResult("registry.trust.preview", { fixture: "trusted_manifest" });
    expect(result.ok).toBe(true);
    expect(result.result.trusted).toBe(true);
    expect(result.result.review_status).toBe("approved");
  });

  it("policy.hard_stops returns required hard-stop categories", () => {
    const result = toolResult("policy.hard_stops");
    expect(result.ok).toBe(true);
    expect(result.result.categories).toContain("raw_secrets_credentials");
    expect(result.result.categories).toContain("money_billing_subscriptions");
    expect(result.result.categories).toContain("production_deploy_or_data_mutation");
    expect(result.result.categories).toContain("platform_required_confirmation");
  });

  it("all Build 5 tool descriptors are read-only or preview-only", () => {
    expect(assertNoLiveWriteTools()).toBe(true);
    for (const descriptor of APP_HOST_TOOL_DESCRIPTORS) {
      expect(descriptor.safety.readOnly).toBe(true);
      expect(descriptor.safety.destructive).toBe(false);
      expect(descriptor.safety.live).toBe(false);
      expect(descriptor.mode).toBe("preview_only");
    }
  });

  it("no live write or destructive tool is exposed", () => {
    const unsafe = APP_HOST_TOOL_DESCRIPTORS.filter((tool) => tool.safety.live || tool.safety.destructive || !tool.safety.readOnly);
    expect(unsafe).toEqual([]);
  });

  it("all descriptor names are registered tool names", () => {
    for (const descriptor of APP_HOST_TOOL_DESCRIPTORS) {
      expect(AppHostToolNameSchema.safeParse(descriptor.name).success).toBe(true);
    }
  });

  it("resources expose static app host content", () => {
    const server = createAppHostServer();
    expect(server.listResources().map((resource) => resource.uri)).toContain("app://stealtheye-agent-os/sample-mission");
    const sample = server.readResource("app://stealtheye-agent-os/sample-mission") as { mission: { mission_id: string } };
    expect(sample.mission.mission_id).toBe("mission:fixture:repo-feature");
  });

  it("no obvious real-secret material appears in app-host fixtures or descriptors", () => {
    const serialized = JSON.stringify({ APP_HOST_PUBLIC_FIXTURE_NOTICE, APP_HOST_TOOL_DESCRIPTORS });
    const forbiddenPatterns = [
      /AKIA[0-9A-Z]{16}/,
      new RegExp("BEGIN " + "(RSA|OPENSSH|EC|DSA) " + "PRIVATE " + "KEY"),
      new RegExp("client_" + "secret="),
      new RegExp("PRIVATE" + "_KEY=")
    ];
    for (const pattern of forbiddenPatterns) expect(serialized).not.toMatch(pattern);
  });
});
