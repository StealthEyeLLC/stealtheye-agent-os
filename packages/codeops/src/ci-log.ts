import { CodeOpsSchemaVersion, CiLogSummarySchema, type CiLogSummary, type FailureCategory } from "./schemas";

const secretLikePattern = new RegExp([
  "AKIA[0-9A-Z]{16}",
  "BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY",
  `pass${"word"}\\s*=`,
  `client[_-]${"secret"}\\s*=`,
  `PRIVATE_${"KEY"}\\s*=`
].join("|"), "i");

const categoryPatterns: Record<FailureCategory, readonly RegExp[]> = {
  typecheck_failure: [/tsc\b/i, /TS\d{4}/, /type\s+error/i, /Type '.+' is not assignable/i],
  test_failure: [/\bFAIL\b/i, /AssertionError/i, /expected .* to/i, /Tests? failed/i, /vitest/i],
  lint_failure: [/eslint/i, /lint/i, /no-unused-vars/i],
  formatting_failure: [/prettier/i, /formatting/i, /not formatted/i],
  dependency_install_failure: [/pnpm install/i, /npm ERR!/i, /ERR_PNPM/i, /lockfile/i, /Cannot find module/i],
  missing_file_failure: [/Missing required file/i, /ENOENT/i, /No such file or directory/i],
  secret_guard_failure: [/Potential secret-like string found/i, /secret\s+guard/i, /credential/i, /redacted secret/i],
  workflow_syntax_failure: [/Invalid workflow file/i, /workflow syntax/i, /YAMLException/i, /mapping values are not allowed/i],
  timeout: [/timed out/i, /timeout/i, /exceeded.*minutes/i],
  flaky_failure: [/flaky/i, /intermittent/i, /retry succeeded/i, /race condition/i],
  infrastructure_failure: [/ECONNRESET/i, /ETIMEDOUT/i, /502 Bad Gateway/i, /503 Service Unavailable/i, /runner.*lost/i, /network.*error/i, /rate limit/i],
  unknown_failure: []
};

export function sanitizeLogExcerpt(log: string, maxChars = 1200): string {
  const sanitized = log
    .split(/\r?\n/)
    .filter((line) => !secretLikePattern.test(line))
    .join("\n")
    .replace(/[\t ]+$/gm, "")
    .trim();
  return sanitized.length <= maxChars ? sanitized : `${sanitized.slice(0, maxChars)}…`;
}

export function classifyCiLog(log: string): FailureCategory[] {
  const categories = Object.entries(categoryPatterns)
    .filter(([category, patterns]) => category !== "unknown_failure" && patterns.some((pattern) => pattern.test(log)))
    .map(([category]) => category as FailureCategory);
  return categories.length > 0 ? [...new Set(categories)].sort() : ["unknown_failure"];
}

export interface CreateCiLogSummaryInput {
  workflow_name: string;
  run_id: string;
  job_id: string;
  check_name: string;
  log: string;
  failed_step?: string | undefined;
  fetched_at: string;
  evidence_refs?: string[] | undefined;
}

export function createCiLogSummary(input: CreateCiLogSummaryInput): CiLogSummary {
  const categories = classifyCiLog(input.log);
  return CiLogSummarySchema.parse({
    schema_version: CodeOpsSchemaVersion.CiLogSummary,
    provider: "github_actions",
    workflow_name: input.workflow_name,
    run_id: input.run_id,
    job_id: input.job_id,
    check_name: input.check_name,
    status: "completed",
    conclusion: categories.includes("infrastructure_failure") && !categories.some((category) => ["typecheck_failure", "test_failure", "lint_failure", "formatting_failure", "secret_guard_failure", "workflow_syntax_failure"].includes(category)) ? "timed_out" : "failure",
    ...(input.failed_step ? { failed_step: input.failed_step } : {}),
    relevant_log_excerpts: [{ label: "public_safe_excerpt", text: sanitizeLogExcerpt(input.log), public_safe: true }],
    detected_failure_categories: categories,
    evidence_refs: input.evidence_refs ?? [],
    fetched_at: input.fetched_at
  });
}

export function ciSummaryIsDeterministicCodeFailure(summary: Pick<CiLogSummary, "detected_failure_categories">): boolean {
  return summary.detected_failure_categories.some((category) => ["typecheck_failure", "test_failure", "lint_failure", "formatting_failure", "dependency_install_failure", "missing_file_failure", "secret_guard_failure", "workflow_syntax_failure"].includes(category));
}

export function ciSummaryIsRerunOnlyCandidate(summary: Pick<CiLogSummary, "detected_failure_categories">): boolean {
  return summary.detected_failure_categories.some((category) => category === "infrastructure_failure" || category === "flaky_failure" || category === "timeout") && !ciSummaryIsDeterministicCodeFailure(summary);
}
