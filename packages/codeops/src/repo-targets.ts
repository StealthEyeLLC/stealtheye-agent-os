import type { RepoTarget } from "./schemas";

export interface BranchPolicyFinding {
  check_id: string;
  passed: boolean;
  reason_codes: string[];
  summary: string;
}

export interface BranchSafeOperationSummary {
  allowed: boolean;
  branch: string;
  protected_branch: boolean;
  branch_prefix_allowed: boolean;
  direct_protected_branch_mutation_denied: boolean;
  history_rewrite_denied: boolean;
  allowed_paths: string[];
  denied_paths: string[];
  reason_codes: string[];
  findings: BranchPolicyFinding[];
}

const branchNamePattern = /^(?!\/)(?!.*\.\.)(?!.*\/$)(?!.*\.lock$)[A-Za-z0-9._\/-]+$/;

export function normalizeRepoPath(path: string): string {
  return path.replace(/^\.\//, "").replace(/^\//, "");
}

export function validateBranchName(branch: string): BranchPolicyFinding {
  const passed = branch.length > 0 && branch.length <= 255 && branchNamePattern.test(branch) && !branch.includes("//") && !branch.includes("@{");
  return {
    check_id: "branch_name_valid",
    passed,
    reason_codes: passed ? [] : ["invalid_branch_name"],
    summary: passed ? "Branch name is syntactically valid." : "Branch name is invalid for branch-safe CodeOps work."
  };
}

export function isProtectedBranch(branch: string, target: Pick<RepoTarget, "protected_branches">): boolean {
  return target.protected_branches.includes(branch);
}

export function hasAllowedBranchPrefix(branch: string, target: Pick<RepoTarget, "allowed_branch_prefixes">): boolean {
  return target.allowed_branch_prefixes.length === 0 || target.allowed_branch_prefixes.some((prefix) => branch.startsWith(prefix));
}

export function denyForcePushOrHistoryRewrite(indicators: string[] = []): BranchPolicyFinding {
  const lowered = indicators.map((indicator) => indicator.toLowerCase());
  const blocked = lowered.some((indicator) => indicator.includes("force push") || indicator.includes("force-push") || indicator.includes("history rewrite") || indicator.includes("rebase published") || indicator.includes("non fast forward"));
  return {
    check_id: "no_force_push_or_history_rewrite",
    passed: !blocked,
    reason_codes: blocked ? ["force_push_or_history_rewrite_denied"] : [],
    summary: blocked ? "Force push or history rewrite intent is denied." : "No force push or history rewrite intent was detected."
  };
}

export function denyDirectProtectedBranchMutation(target: RepoTarget): BranchPolicyFinding {
  const protectedBranch = isProtectedBranch(target.working_branch, target) || target.working_branch === target.base_branch;
  return {
    check_id: "no_direct_protected_branch_mutation",
    passed: !protectedBranch,
    reason_codes: protectedBranch ? ["direct_protected_branch_mutation_denied"] : [],
    summary: protectedBranch ? "Working branch targets a protected/base branch and must not be mutated directly." : "Working branch is separate from protected/base branches."
  };
}

export function pathMatchesScope(path: string, scope: string): boolean {
  const normalizedPath = normalizeRepoPath(path);
  const normalizedScope = normalizeRepoPath(scope);
  if (normalizedScope === "*") return true;
  if (normalizedScope.endsWith("/**")) return normalizedPath.startsWith(normalizedScope.slice(0, -3));
  if (normalizedScope.endsWith("/")) return normalizedPath.startsWith(normalizedScope);
  return normalizedPath === normalizedScope || normalizedPath.startsWith(`${normalizedScope}/`);
}

export function isPathDenied(path: string, target: Pick<RepoTarget, "denied_paths">): boolean {
  return target.denied_paths.some((scope) => pathMatchesScope(path, scope));
}

export function isPathAllowed(path: string, target: Pick<RepoTarget, "allowed_paths" | "denied_paths">): boolean {
  if (isPathDenied(path, target)) return false;
  return target.allowed_paths.length === 0 || target.allowed_paths.some((scope) => pathMatchesScope(path, scope));
}

export function evaluatePathAccess(paths: string[], target: RepoTarget): BranchPolicyFinding {
  const denied = paths.filter((path) => isPathDenied(path, target));
  const outsideAllowed = paths.filter((path) => !isPathAllowed(path, target));
  const reasons = [...new Set([...denied.map((path) => `denied_path:${path}`), ...outsideAllowed.map((path) => `path_outside_allowed_scope:${path}`)])].sort();
  return {
    check_id: "path_scope",
    passed: reasons.length === 0,
    reason_codes: reasons,
    summary: reasons.length === 0 ? "All paths are inside allowed path scopes and outside denied scopes." : "One or more paths violate allowed or denied path policy."
  };
}

export function evaluateRepoTarget(target: RepoTarget, candidatePaths: string[] = [], riskIndicators: string[] = []): BranchPolicyFinding[] {
  return [
    validateBranchName(target.working_branch),
    {
      check_id: "branch_prefix_allowed",
      passed: hasAllowedBranchPrefix(target.working_branch, target),
      reason_codes: hasAllowedBranchPrefix(target.working_branch, target) ? [] : ["branch_prefix_not_allowed"],
      summary: hasAllowedBranchPrefix(target.working_branch, target) ? "Working branch uses an allowed prefix." : "Working branch does not use an allowed prefix."
    },
    denyDirectProtectedBranchMutation(target),
    denyForcePushOrHistoryRewrite(riskIndicators),
    evaluatePathAccess(candidatePaths, target)
  ];
}

export function branchSafeOperationSummary(target: RepoTarget, candidatePaths: string[] = [], riskIndicators: string[] = []): BranchSafeOperationSummary {
  const findings = evaluateRepoTarget(target, candidatePaths, riskIndicators);
  const reasonCodes = [...new Set(findings.flatMap((finding) => finding.reason_codes))].sort();
  const protectedBranch = isProtectedBranch(target.working_branch, target) || target.working_branch === target.base_branch;
  return {
    allowed: findings.every((finding) => finding.passed),
    branch: target.working_branch,
    protected_branch: protectedBranch,
    branch_prefix_allowed: hasAllowedBranchPrefix(target.working_branch, target),
    direct_protected_branch_mutation_denied: protectedBranch,
    history_rewrite_denied: denyForcePushOrHistoryRewrite(riskIndicators).reason_codes.length > 0,
    allowed_paths: candidatePaths.filter((path) => isPathAllowed(path, target)),
    denied_paths: candidatePaths.filter((path) => !isPathAllowed(path, target)),
    reason_codes: reasonCodes,
    findings
  };
}
