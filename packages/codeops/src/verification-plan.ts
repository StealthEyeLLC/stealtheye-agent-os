import { allPatchPlanFileChanges, detectCiTestWeakeningIndicators, type ChangeRiskFinding } from "./file-changes";
import type { FileChangeContract, PatchPlan, VerificationPlan } from "./schemas";
import { normalizeRepoPath } from "./repo-targets";

export interface VerificationObligationFinding {
  obligation_id: string;
  required: boolean;
  satisfied: boolean;
  reason_codes: string[];
  summary: string;
}

function commandText(plan: VerificationPlan): string {
  return plan.commands.map((command) => command.command).join("\n").toLowerCase();
}

function checkText(plan: VerificationPlan): string {
  return [...plan.ci_checks, ...plan.required_artifacts, ...plan.success_criteria].join("\n").toLowerCase();
}

export function packageFilesChanged(changes: FileChangeContract[]): boolean {
  return changes.some((change) => {
    const path = normalizeRepoPath(change.path);
    return path.startsWith("packages/") && /\.(ts|tsx|json)$/.test(path);
  });
}

export function docsFilesChanged(changes: FileChangeContract[]): boolean {
  return changes.some((change) => {
    const path = normalizeRepoPath(change.path);
    return path.startsWith("docs/") || ["README.md", "AGENTS.md", "llms.txt", "llms-full.txt"].includes(path);
  });
}

export function requiresTypecheckAndTests(plan: VerificationPlan, changes: FileChangeContract[]): VerificationObligationFinding {
  const required = packageFilesChanged(changes);
  const text = commandText(plan);
  const hasTypecheck = text.includes("typecheck");
  const hasTest = /(^|\s|:)test(\s|$)/.test(text) || text.includes("pnpm test") || text.includes("vitest");
  const satisfied = !required || (hasTypecheck && hasTest);
  return {
    obligation_id: "package_typecheck_and_tests",
    required,
    satisfied,
    reason_codes: satisfied ? [] : [!hasTypecheck ? "typecheck_command_missing" : "test_command_missing"].filter(Boolean),
    summary: required ? (satisfied ? "Package changes include typecheck and test verification." : "Package changes require both typecheck and test verification.") : "No package TypeScript/package changes require typecheck/test obligations."
  };
}

export function requiresDocsChecks(plan: VerificationPlan, changes: FileChangeContract[]): VerificationObligationFinding {
  const required = docsFilesChanged(changes);
  const text = `${commandText(plan)}\n${checkText(plan)}`;
  const hasDocsEvidence = text.includes("required-file") || text.includes("docs") || text.includes("llms") || text.includes("readme");
  return {
    obligation_id: "docs_evidence_checks",
    required,
    satisfied: !required || hasDocsEvidence,
    reason_codes: required && !hasDocsEvidence ? ["docs_check_missing"] : [],
    summary: required ? (hasDocsEvidence ? "Documentation changes include docs/required-file evidence." : "Documentation changes require docs or required-file evidence.") : "No documentation changes require docs-specific obligations."
  };
}

export function requiresCiStatusEvidence(plan: VerificationPlan): VerificationObligationFinding {
  const text = `${checkText(plan)}\n${plan.evidence_refs.join("\n")}`;
  const satisfied = text.includes("ci") || text.includes("status") || plan.ci_checks.length > 0;
  return {
    obligation_id: "ci_status_evidence",
    required: true,
    satisfied,
    reason_codes: satisfied ? [] : ["ci_status_evidence_missing"],
    summary: satisfied ? "Verification plan requires CI status evidence." : "Verification plan must require CI status evidence."
  };
}

export function detectVerificationWeakening(changes: FileChangeContract[]): ChangeRiskFinding {
  return detectCiTestWeakeningIndicators(changes);
}

export function verificationObligationsForPatchPlan(plan: PatchPlan): VerificationObligationFinding[] {
  const changes = allPatchPlanFileChanges(plan);
  return [
    requiresTypecheckAndTests(plan.verification_plan, changes),
    requiresDocsChecks(plan.verification_plan, changes),
    requiresCiStatusEvidence(plan.verification_plan)
  ];
}

export function verificationPlanSatisfiedForPatchPlan(plan: PatchPlan): boolean {
  return verificationObligationsForPatchPlan(plan).every((finding) => finding.satisfied) && !detectVerificationWeakening(allPatchPlanFileChanges(plan)).matched;
}

export function summarizeVerificationObligations(plan: PatchPlan): string {
  const obligations = verificationObligationsForPatchPlan(plan).filter((finding) => finding.required);
  if (obligations.length === 0) return "No additional verification obligations beyond CI status evidence.";
  return obligations.map((finding) => `${finding.obligation_id}:${finding.satisfied ? "satisfied" : "missing"}`).join(", ");
}
