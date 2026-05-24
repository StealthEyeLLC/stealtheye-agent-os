import { describe, expect, it } from "vitest";
import { evaluateGuardDecision } from "@stealtheye/guard";
import {
  ALLOWED_READ_ONLY_EFFECTS,
  DENIED_READ_ONLY_EFFECTS,
  PublicUnauthenticatedGitHubRestClient,
  ReadOnlyGitHubClientConfigSchema,
  RepoStatusPacketSchema,
  RepositoryTargetSchema,
  TRUSTED_REPO_STATUS_REGISTRY,
  UNTRUSTED_REPO_STATUS_REGISTRY,
  createFixtureReadOnlyGitHubClient,
  createRepoStatusPacket,
  createRepoStatusReceiptPreview,
  createRepoStatusCapabilityTokenFixture,
  evaluateReadOnlyRepoPolicy,
  evaluateRepoStatusGuard,
  isPublicSafeFilePath,
  readBranchMetadata,
  readFileContent,
  readFileMetadata,
  readIssue,
  readPullRequest,
  readRepositoryMetadata,
  readWorkflowStatus,
  repoStatusFixtureTarget,
  repoStatusLiveReadClientConfig,
  repoStatusPrivateTargetFixture,
  listIssues,
  listPullRequests
} from "../src";

const secretLikePattern = new RegExp([
  "AKIA[0-9A-Z]{16}",
  "BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY",
  "client_" + "secret",
  "PRIVATE" + "_KEY",
  "customer_" + "ssn",
  "credit card"
].join("|"), "i");

describe("repo-status schemas, policy, clients, Guard, and receipts", () => {
  it("schemas validate repository targets and client config with explicit live status", () => {
    expect(RepositoryTargetSchema.parse(repoStatusFixtureTarget).live_capability_status).toBe("fixture_only");
    expect(ReadOnlyGitHubClientConfigSchema.parse(repoStatusLiveReadClientConfig).live_capability_status).toBe("read_only_live");
  });

  it("read-only policy allows public repo reads and public PR/status reads", () => {
    expect(evaluateReadOnlyRepoPolicy({ effect: "read_public_repo_metadata", target: repoStatusFixtureTarget }).allowed).toBe(true);
    expect(evaluateReadOnlyRepoPolicy({ effect: "read_public_pr_metadata", target: repoStatusFixtureTarget }).allowed).toBe(true);
    expect(evaluateReadOnlyRepoPolicy({ effect: "read_public_workflow_status", target: repoStatusFixtureTarget, ref: "main" }).allowed).toBe(true);
    expect(ALLOWED_READ_ONLY_EFFECTS).toContain("read_public_file_content");
  });

  it("read-only policy denies write, mutation, secret, private repo, and unknown effects", () => {
    for (const effect of DENIED_READ_ONLY_EFFECTS) expect(evaluateReadOnlyRepoPolicy({ effect, target: repoStatusFixtureTarget }).allowed).toBe(false);
    expect(evaluateReadOnlyRepoPolicy({ effect: "read_private_repo", target: repoStatusPrivateTargetFixture }).reason_codes).toContain("effect_not_in_read_only_allowlist");
    expect(evaluateReadOnlyRepoPolicy({ effect: "read_public_file_content", target: repoStatusFixtureTarget, path: ".env" }).allowed).toBe(false);
    expect(evaluateReadOnlyRepoPolicy({ effect: "unknown_operation", target: repoStatusFixtureTarget }).allowed).toBe(false);
    expect(isPublicSafeFilePath("README.md")).toBe(true);
    expect(isPublicSafeFilePath("secrets/api.key")).toBe(false);
  });

  it("fixture client returns repo, branch, PR, issue, workflow, file metadata and content", async () => {
    const client = createFixtureReadOnlyGitHubClient();
    await expect(client.getRepository(repoStatusFixtureTarget)).resolves.toMatchObject({ default_branch: "main" });
    await expect(client.getBranch(repoStatusFixtureTarget, "main")).resolves.toMatchObject({ name: "main" });
    await expect(client.listPullRequests(repoStatusFixtureTarget)).resolves.toHaveLength(1);
    await expect(client.getPullRequest(repoStatusFixtureTarget, 11)).resolves.toMatchObject({ number: 11 });
    await expect(client.listIssues(repoStatusFixtureTarget)).resolves.toHaveLength(1);
    await expect(client.getIssue(repoStatusFixtureTarget, 1)).resolves.toMatchObject({ number: 1 });
    await expect(client.listWorkflowChecks(repoStatusFixtureTarget, "main")).resolves.toHaveLength(1);
    await expect(client.getFileMetadata(repoStatusFixtureTarget, "README.md", "main")).resolves.toMatchObject({ path: "README.md" });
    await expect(client.getFileContent(repoStatusFixtureTarget, "README.md", "main")).resolves.toMatchObject({ content: expect.stringContaining("Public-safe") });
  });

  it("Guard adapter allows public reads and blocks write/mutation, private, secret, and untrusted registry requests", () => {
    expect(evaluateRepoStatusGuard({ effect: "read_public_repo_metadata", target: repoStatusFixtureTarget }).decision.decision).toBe("allow");
    expect(evaluateRepoStatusGuard({ effect: "read_public_pr_metadata", target: repoStatusFixtureTarget }).decision.decision).toBe("allow");
    expect(evaluateRepoStatusGuard({ effect: "write_branch_files", target: repoStatusFixtureTarget }).decision.decision).toBe("deny");
    expect(evaluateRepoStatusGuard({ effect: "read_secrets", target: repoStatusFixtureTarget }).decision.decision).toBe("deny");
    expect(evaluateRepoStatusGuard({ effect: "read_private_repo", target: repoStatusPrivateTargetFixture }).decision.decision).toBe("deny");
    expect(evaluateRepoStatusGuard({ effect: "read_public_repo_metadata", target: repoStatusFixtureTarget, registryTrust: UNTRUSTED_REPO_STATUS_REGISTRY }).decision.decision).toBe("deny");
    const token = createRepoStatusCapabilityTokenFixture();
    const explicit = evaluateGuardDecision({ schema_version: "requested-action.v1", action_id: "repo-status:test", mission_id: token.mission_id, actor_id: token.issued_to, subject_type: "agent", effect: "read_repo", target: { repo: repoStatusFixtureTarget.full_name, system: "github", environment: "public", account: "StealthEyeLLC" }, agent_id: "agent:repo-status-fixture", manifest_id: "tool-manifest:repo-status-fixture", risk_indicators: [], side_effects: [], requested_at: "2026-01-01T00:00:00.000Z", metadata: {}, evidence_refs: [] }, [token], { now: new Date("2026-01-01T00:00:00.000Z"), registryTrust: TRUSTED_REPO_STATUS_REGISTRY });
    expect(explicit.decision).toBe("allow");
  });

  it("receipt event is generated for each read category", async () => {
    const context = { target: repoStatusFixtureTarget, client: createFixtureReadOnlyGitHubClient() };
    const reads = [
      await readRepositoryMetadata(context),
      await readBranchMetadata(context, "main"),
      await listPullRequests(context, "all"),
      await readPullRequest(context, 11),
      await listIssues(context, "open"),
      await readIssue(context, 1),
      await readWorkflowStatus(context, "main"),
      await readFileMetadata(context, "README.md", "main"),
      await readFileContent(context, "README.md", "main")
    ];
    for (const read of reads) {
      expect(read.receipt.public_safe).toBe(true);
      expect(read.receipt.no_write_no_side_effect_statement).toMatch(/No branch, file, PR, issue, workflow/);
      expect(read.receipt.guard_decision_ref).toContain("guard-decision");
    }
  });

  it("repo status packet summarizes current public-safe fixture status", async () => {
    const packet = await createRepoStatusPacket({ target: repoStatusFixtureTarget, client: createFixtureReadOnlyGitHubClient() });
    expect(RepoStatusPacketSchema.parse(packet.result).summary).toContain("StealthEyeLLC/stealtheye-agent-os");
    expect(packet.result.receipts).toHaveLength(1);
  });

  it("manual receipt preview includes required public-safe fields", () => {
    const guard = evaluateRepoStatusGuard({ effect: "read_public_repo_metadata", target: repoStatusFixtureTarget });
    const receipt = createRepoStatusReceiptPreview({ toolName: "repo.metadata.read", target: repoStatusFixtureTarget, policy: guard.policy, guardDecision: guard.decision, outputSummary: "Observed repository fixture." });
    expect(receipt.target_repo).toBe(repoStatusFixtureTarget.full_name);
    expect(receipt.read_policy_result_ref).toContain("read-policy");
    expect(receipt.no_write_no_side_effect_statement).toContain("No branch");
  });

  it("real public REST client uses GET only and api.github.com only with mocked fetch", async () => {
    const fetchCalls: Array<{ input: string | URL; method?: string }> = [];
    const fetchMock = async (input: string | URL, init?: { method?: string; headers?: Record<string, string> }) => {
      fetchCalls.push(init?.method ? { input, method: init.method } : { input });
      return { ok: true, status: 200, headers: { get: () => "10" }, async json() { return { default_branch: "main", description: "fixture", archived: false, disabled: false, fork: false, open_issues_count: 1, visibility: "public", html_url: "https://github.com/StealthEyeLLC/stealtheye-agent-os", pushed_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" }; } };
    };
    const client = new PublicUnauthenticatedGitHubRestClient(repoStatusLiveReadClientConfig, fetchMock);
    await client.getRepository({ ...repoStatusFixtureTarget, live_capability_status: "read_only_live" });
    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0]?.method).toBe("GET");
    expect(new URL(String(fetchCalls[0]?.input)).origin).toBe("https://api.github.com");
    expect(client.capturedRequests.every((request) => request.method === "GET" && request.url.startsWith("https://api.github.com/"))).toBe(true);
  });

  it("fixtures and docs-facing payloads contain no secret/token/customer/live-write material", () => {
    const serialized = JSON.stringify({ target: repoStatusFixtureTarget, config: repoStatusLiveReadClientConfig, allowed: ALLOWED_READ_ONLY_EFFECTS });
    expect(serialized).not.toMatch(secretLikePattern);
    expect(serialized).not.toMatch(/write_methods_supported":true|credentials_supported":true/);
  });
});
