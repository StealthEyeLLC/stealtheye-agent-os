import { createHash } from "node:crypto";
import { canonicalize } from "@stealtheye/agent-registry";
import type { FileChangeContract, PatchPlan, RepoTarget } from "./schemas";
import { isPathDenied, normalizeRepoPath } from "./repo-targets";

export const suspiciousSecretPathPatterns = [
  /(^|\/)\.env(\.|$)/i,
  /(^|\/)(secrets?|credentials?|tokens?)(\/|\.|$)/i,
  /(^|\/)(id_rsa|id_ed25519|known_hosts)$/i,
  /(^|\/)\.ssh(\/|$)/i,
  /(^|\/)(service-account|oauth-client|private-key)(\.|\/|$)/i,
  /(^|\/)config\/(prod|production)(\.|\/|$)/i
] as const;

export const protectedPathPatterns = [
  /^\.github\/workflows\//,
  /^\.github\/CODEOWNERS$/,
  /^SECURITY\.md$/,
  /^packages\/.+\/test\//,
  /^docs\/DECISIONS\//
] as const;

const ciWeakeningPatterns = [
  /skip\s+tests?/i,
  /disable\s+(ci|test|typecheck|lint|security)/i,
  /remove\s+(ci|test|typecheck|lint|security)/i,
  /weaken\s+(ci|test|typecheck|lint|security)/i,
  /allow\s+failure/i,
  /continue-on-error\s*:\s*true/i,
  /--passWithNoTests/i,
  /test\.skip\s*\(/i,
  /describe\.skip\s*\(/i,
  /it\.skip\s*\(/i,
  /\.only\s*\(/i
] as const;

export interface ChangeRiskFinding {
  check_id: string;
  matched: boolean;
  reason_codes: string[];
  paths: string[];
  summary: string;
}

export function allPatchPlanFileChanges(plan: PatchPlan): FileChangeContract[] {
  return [
    ...plan.files_to_read,
    ...plan.files_to_modify,
    ...plan.files_to_create,
    ...plan.files_to_delete_or_deprecate
  ];
}

export function changedPaths(changes: FileChangeContract[]): string[] {
  return [...new Set(changes.map((change) => normalizeRepoPath(change.path)))].sort();
}

export function detectForbiddenDeleteOperations(changes: FileChangeContract[]): ChangeRiskFinding {
  const paths = changes.filter((change) => change.operation === "delete").map((change) => normalizeRepoPath(change.path)).sort();
  return {
    check_id: "forbidden_delete_operations",
    matched: paths.length > 0,
    reason_codes: paths.map((path) => `destructive_delete:${path}`),
    paths,
    summary: paths.length > 0 ? "Destructive delete operations are blocked or escalated by default." : "No destructive delete operations detected."
  };
}

export function detectProtectedPaths(changes: FileChangeContract[], target?: Pick<RepoTarget, "denied_paths">): ChangeRiskFinding {
  const paths = changedPaths(changes).filter((path) => protectedPathPatterns.some((pattern) => pattern.test(path)) || (target ? isPathDenied(path, target) : false));
  return {
    check_id: "protected_paths",
    matched: paths.length > 0,
    reason_codes: paths.map((path) => `protected_path:${path}`),
    paths,
    summary: paths.length > 0 ? "One or more changes touch protected or denied paths." : "No protected or denied path changes detected."
  };
}

export function detectSuspiciousSecretBearingPaths(changes: FileChangeContract[]): ChangeRiskFinding {
  const paths = changedPaths(changes).filter((path) => suspiciousSecretPathPatterns.some((pattern) => pattern.test(path)));
  return {
    check_id: "suspicious_secret_bearing_paths",
    matched: paths.length > 0,
    reason_codes: paths.map((path) => `secret_bearing_path:${path}`),
    paths,
    summary: paths.length > 0 ? "One or more file paths look secret-bearing and must not expose raw secrets." : "No suspicious secret-bearing paths detected."
  };
}

export function detectCiTestWeakeningIndicators(changes: FileChangeContract[]): ChangeRiskFinding {
  const flagged = changes.filter((change) => {
    const text = [change.path, change.summary, ...change.risk_indicators].join("\n");
    return ciWeakeningPatterns.some((pattern) => pattern.test(text));
  });
  const paths = changedPaths(flagged);
  return {
    check_id: "ci_test_weakening_indicators",
    matched: flagged.length > 0,
    reason_codes: flagged.map((change) => `ci_test_weakening:${normalizeRepoPath(change.path)}`).sort(),
    paths,
    summary: flagged.length > 0 ? "Potential CI/test/security weakening was detected and must be denied." : "No CI/test/security weakening indicators detected."
  };
}

export function summarizeFileChanges(changes: FileChangeContract[]): string {
  const counts = changes.reduce<Record<FileChangeContract["operation"], number>>((acc, change) => {
    acc[change.operation] += 1;
    return acc;
  }, { read: 0, create: 0, update: 0, delete: 0, rename: 0 });
  const parts = Object.entries(counts).filter(([, count]) => count > 0).map(([operation, count]) => `${operation}:${count}`);
  return parts.length === 0 ? "no file changes" : parts.join(", ");
}

function stablePatchPlanPayload(plan: PatchPlan): unknown {
  return {
    patch_plan_id: plan.patch_plan_id,
    mission_id: plan.mission_id,
    task_id: plan.task_id,
    repo_target: {
      repo_full_name: plan.repo_target.repo_full_name,
      base_branch: plan.repo_target.base_branch,
      working_branch: plan.repo_target.working_branch
    },
    changes: allPatchPlanFileChanges(plan).map((change) => ({
      path: normalizeRepoPath(change.path),
      operation: change.operation,
      previous_path: change.previous_path,
      before_digest_ref: change.before_digest_ref,
      after_digest_ref: change.after_digest_ref,
      summary: change.summary,
      risk_indicators: [...change.risk_indicators].sort()
    })).sort((a, b) => `${a.operation}:${a.path}`.localeCompare(`${b.operation}:${b.path}`)),
    expected_effects: [...plan.expected_effects].sort(),
    risk_tier: plan.risk_tier,
    verification_commands: plan.verification_plan.commands.map((command) => command.command).sort(),
    status: plan.status
  };
}

export function computePatchPlanFingerprint(plan: PatchPlan): string {
  return `sha256:${createHash("sha256").update(canonicalize(stablePatchPlanPayload(plan)), "utf8").digest("hex")}`;
}

export function assessFileChangeRisks(plan: PatchPlan): ChangeRiskFinding[] {
  const changes = allPatchPlanFileChanges(plan);
  return [
    detectForbiddenDeleteOperations(changes),
    detectProtectedPaths(changes, plan.repo_target),
    detectSuspiciousSecretBearingPaths(changes),
    detectCiTestWeakeningIndicators(changes)
  ];
}
