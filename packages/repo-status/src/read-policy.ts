import {
  AllowedReadOnlyGitHubEffectSchema,
  ReadOnlyGitHubEffectSchema,
  ReadOnlyPolicyResultSchema,
  RepoStatusSchemaVersion,
  type ReadOnlyGitHubEffect,
  type ReadOnlyPolicyResult,
  type RepositoryTarget
} from "./schemas";

export const ALLOWED_READ_ONLY_EFFECTS = [...AllowedReadOnlyGitHubEffectSchema.options] as const;
export const DENIED_READ_ONLY_EFFECTS = [
  "write_branch_files",
  "commit_branch",
  "open_pr",
  "update_pr",
  "update_issue",
  "rerun_ci",
  "dispatch_workflow",
  "mutate_repo_settings",
  "read_secrets",
  "read_private_repo",
  "deploy",
  "external_send",
  "money_movement"
] as const;

const DEFAULT_ALLOWED_REPOSITORIES = ["StealthEyeLLC/stealtheye-agent-os"];
const SECRET_OR_PRIVATE_FILE_PATTERN = /(^|\/)(\.env|\.npmrc|\.pypirc|id_rsa|id_ed25519|credentials?|secrets?)(\.|$|\/)|\.(pem|p12|pfx|key|crt)$/i;

export interface EvaluateReadOnlyRepoPolicyInput {
  effect: string;
  target: RepositoryTarget;
  ref?: string | undefined;
  path?: string | undefined;
  allowlistedRepositories?: string[] | undefined;
  liveCapable?: boolean | undefined;
}

export function isAllowedReadOnlyEffect(effect: string): effect is (typeof ALLOWED_READ_ONLY_EFFECTS)[number] {
  return (ALLOWED_READ_ONLY_EFFECTS as readonly string[]).includes(effect);
}

export function isDeniedRepoEffect(effect: string): boolean {
  return (DENIED_READ_ONLY_EFFECTS as readonly string[]).includes(effect);
}

export function isPublicSafeFilePath(path: string): boolean {
  const normalized = path.replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) return false;
  return !SECRET_OR_PRIVATE_FILE_PATTERN.test(normalized);
}

function denied(input: EvaluateReadOnlyRepoPolicyInput, reasonCodes: string[], hardStops: string[] = []): ReadOnlyPolicyResult {
  return ReadOnlyPolicyResultSchema.parse({
    schema_version: RepoStatusSchemaVersion.ReadOnlyPolicyResult,
    allowed: false,
    effect: ReadOnlyGitHubEffectSchema.safeParse(input.effect).success ? input.effect : "external_send",
    target_repo: input.target.full_name,
    ...(input.ref ? { target_ref: input.ref } : {}),
    ...(input.path ? { target_path: input.path } : {}),
    live_capability_status: "denied",
    reason_codes: reasonCodes,
    summary: `Repo/status read-only policy denied ${input.effect} for ${input.target.full_name}.`,
    no_write_no_side_effect: true,
    hard_stop_categories: hardStops
  });
}

export function evaluateReadOnlyRepoPolicy(input: EvaluateReadOnlyRepoPolicyInput): ReadOnlyPolicyResult {
  const allowedRepositories = input.allowlistedRepositories ?? DEFAULT_ALLOWED_REPOSITORIES;
  if (!ReadOnlyGitHubEffectSchema.safeParse(input.effect).success) {
    return denied(input, ["operation_not_explicitly_allowed"], ["unclear_scope_or_authority"]);
  }
  if (!isAllowedReadOnlyEffect(input.effect)) {
    const hardStops = input.effect === "read_secrets"
      ? ["raw_secrets_credentials"]
      : input.effect === "money_movement"
        ? ["money_billing_subscriptions"]
        : input.effect === "deploy"
          ? ["production_deploy_or_data_mutation"]
          : input.effect === "read_private_repo"
            ? ["raw_secrets_credentials"]
            : ["protected_branch_mutation"];
    return denied(input, ["effect_not_in_read_only_allowlist", `denied_effect:${input.effect}`], hardStops);
  }
  if (input.target.visibility !== "public") {
    return denied(input, ["private_repo_not_allowed", "public_only_boundary"], ["raw_secrets_credentials"]);
  }
  if (!input.target.allowlisted || !allowedRepositories.includes(input.target.full_name)) {
    return denied(input, ["repo_not_allowlisted", "public_repo_allowlist_required"], ["unclear_scope_or_authority"]);
  }
  if ((input.effect === "read_public_file_metadata" || input.effect === "read_public_file_content") && (!input.path || !isPublicSafeFilePath(input.path))) {
    return denied(input, ["file_path_not_public_safe", "secret_like_path_blocked"], ["raw_secrets_credentials"]);
  }
  return ReadOnlyPolicyResultSchema.parse({
    schema_version: RepoStatusSchemaVersion.ReadOnlyPolicyResult,
    allowed: true,
    effect: input.effect as ReadOnlyGitHubEffect,
    target_repo: input.target.full_name,
    ...(input.ref ? { target_ref: input.ref } : {}),
    ...(input.path ? { target_path: input.path } : {}),
    live_capability_status: input.liveCapable ? "read_only_live" : "fixture_only",
    reason_codes: ["explicit_read_only_effect_allowed", "public_repo_allowlisted", "no_write_no_side_effect"],
    summary: `Repo/status read-only policy allowed ${input.effect} for public repository ${input.target.full_name}.`,
    no_write_no_side_effect: true,
    hard_stop_categories: []
  });
}

export function assertNoLiveWriteEffect(effect: string): boolean {
  return !isDeniedRepoEffect(effect) && isAllowedReadOnlyEffect(effect);
}
