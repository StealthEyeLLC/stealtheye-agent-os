#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const specPath = args.find((arg) => !arg.startsWith("--"));
const checkMode = args.includes("--check");
if (!specPath) {
  console.error("Usage: node scripts/stealtheye-build.mjs <phase-spec.mjs> [--check]");
  process.exit(2);
}

const root = process.cwd();
const phaseModule = await import(pathToFileURL(path.resolve(root, specPath)).href);
const phase = phaseModule.default ?? phaseModule.phase;
const buildPadded = String(phase.build).padStart(3, "0");
const generatedAt = phase.generatedAt ?? "2026-01-01T00:00:00.000Z";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const list = (values = []) => values.map((value) => `- ${value}`).join("\n");
const docPolicy = phase.handAuthoredDocPolicy ?? "Generated sync must preserve hand-authored docs and update only generated files or explicit marker-bounded sections.";
const scannerExtraPaths = phase.scannerExtraPaths ?? ["packages/browserops/src/fixtures.ts"];
const foundationPackages = phase.foundationPackages ?? ["@stealtheye/agent-registry", "@stealtheye/guard", "@stealtheye/mission-os", "@stealtheye/app-host", "@stealtheye/worker-fleet", "@stealtheye/codeops", phase.packageName];
const packageSummary = phase.packageSummary ?? `${phase.packageName} package foundations.`;
const acceptanceItems = phase.acceptanceItems ?? [`${phase.packageName} schemas, helpers, fixtures, and tests exist.`];
const toolInventory = phase.toolInventory ?? [{ name: phase.packageName, package: phase.packageName, mode: "foundation", live_external_effects: false }];
const capabilityMatrix = phase.capabilityMatrix ?? [{ capability: "foundation_contracts", status: "modeled", guard_required: true, live_enabled: false }];

const outputs = new Map([
  [`docs/generated/build-${buildPadded}-manifest.json`, json({ schema_version: "stealtheye-build-manifest.v1", build: phase.build, build_title: phase.title, branch: phase.branch, package_name: phase.packageName, files_created_or_updated: phase.importantFiles, docs_updated: phase.docsUpdated, tests_evals_added: phase.testsAndEvals, adr_added: phase.adr, ci_required_files: phase.ciRequiredFiles, safety_boundaries: phase.safetyBoundaries, generated_artifacts: phase.generatedArtifacts, known_gaps: phase.knownGaps, next_target: phase.nextTarget, hand_authored_doc_policy: docPolicy, marker_bounded_hand_authored_docs: phase.markerBoundedHandAuthoredDocs ?? [], generated_at: generatedAt, public_safe: true, live_execution_enabled: false })],
  [`docs/generated/build-${buildPadded}-acceptance.md`, `# Build ${phase.build} acceptance checklist: ${phase.title}\n\n## Package foundation\n\n${list(acceptanceItems)}\n\n## Build automation engine\n\n- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.\n- Generated files exist under docs/generated/.\n- Public-safe/no-live scanner runs in --check mode.\n- Hand-authored docs are preserved outside explicit additive markers.\n\n## Boundary\n\n${list(phase.safetyBoundaries)}\n\n## Next target\n\n- ${phase.nextTarget}.\n`],
  [`docs/generated/build-${buildPadded}-handoff.md`, `# Build ${phase.build} handoff: ${phase.title}\n\n${phase.handoffSummary ?? `Build ${phase.build} adds ${packageSummary}`}\n\n## New package\n\n${packageSummary}\n\n## Generated files\n\n${list(phase.generatedArtifacts)}\n\n## Hand-authored docs policy\n\n${docPolicy}\n\n## Known gaps\n\n${list(phase.knownGaps)}\n\n## Next target\n\n${phase.nextTarget}.\n`],
  [`docs/generated/build-${buildPadded}-receipt.json`, json({ schema_version: "stealtheye-build-receipt.v1", build: phase.build, title: phase.title, branch: phase.branch, package_name: phase.packageName, generated_artifacts: phase.generatedArtifacts, checks_expected: phase.ciRequiredFiles, hand_authored_doc_policy: docPolicy, generated_at: generatedAt, live_execution_enabled: false, durable_database_enabled: false, production_artifact_storage_enabled: false, production_mutation_enabled: false, money_movement_enabled: false })],
  ["docs/generated/project-memory.json", json({ schema_version: "stealtheye-project-memory.v1", current_build: phase.build, current_title: phase.title, current_branch: phase.branch, foundation_packages: foundationPackages, build_summary: phase.projectMemorySummary ?? packageSummary, hand_authored_doc_policy: docPolicy, next_target: phase.nextTarget })],
  ["docs/generated/known-gaps.json", json({ schema_version: "stealtheye-known-gaps.v1", build: phase.build, gaps: phase.knownGaps.map((summary, index) => ({ gap_id: `build-${buildPadded}-gap-${String(index + 1).padStart(2, "0")}`, summary, status: "open" })), next_target: phase.nextTarget })],
  ["docs/generated/safety-capability-matrix.json", json({ schema_version: "stealtheye-safety-capability-matrix.v1", build: phase.build, capabilities: capabilityMatrix })],
  ["docs/generated/eval-registry.json", json({ schema_version: "stealtheye-eval-registry.v1", build: phase.build, evals: phase.testsAndEvals.map((name, index) => ({ eval_id: `build-${buildPadded}-eval-${String(index + 1).padStart(2, "0")}`, name, location: phase.evalLocations?.[name] ?? (name.includes("marker") ? "scripts/stealtheye-build.mjs" : phase.defaultEvalLocation ?? `packages/${phase.packageName?.split("/").at(-1)}/test`) })) })],
  ["docs/generated/tool-inventory.json", json({ schema_version: "stealtheye-tool-inventory.v1", build: phase.build, tools: toolInventory })],
  ["docs/generated/build-state.json", json({ schema_version: "stealtheye-build-state.v1", build: phase.build, title: phase.title, branch: phase.branch, generated_artifacts_current: true, safety_scanner_scope: ["docs/generated", ...scannerExtraPaths], hand_authored_doc_policy: docPolicy, marker_bounded_hand_authored_docs: phase.markerBoundedHandAuthoredDocs ?? [], next_target: phase.nextTarget, generated_at: generatedAt })]
]);

const unsafePatterns = [
  { id: "private_key_marker", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/i },
  { id: "access_key_like", regex: /AKIA[0-9A-Z]{16}/ },
  { id: "credential_assignment", regex: /(?:password|client[_-]?secret|private[_-]?key|access[_-]?token)\s*=\s*[^\s]+/i },
  { id: "private_endpoint", regex: /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|172\.(?:1[6-9]|2\d|3[0-1])\.|192\.168\.|[^\s/]*\.internal|[^\s/]*\.corp)/i },
  { id: "customer_data_marker", regex: /customer[_ -]?(?:ssn|social security|credit card|card number|production data)/i },
  { id: "enabled_live_claim", regex: /\b(?:enabled|supports|runs|executes)\s+(?:real\s+|live\s+)?(?:browser automation|replay execution|tool execution)\b/i },
  { id: "enabled_high_impact_claim", regex: /\b(?:credentialed browsing|money movement|production mutation|durable ledger|production artifact storage)\s+(?:is\s+)?(?:enabled|supported|available)\b/i }
];

async function scan(files) {
  const findings = [];
  for (const file of files) {
    const absolute = path.resolve(root, file);
    if (!existsSync(absolute)) continue;
    const content = await readFile(absolute, "utf8");
    for (const pattern of unsafePatterns) if (pattern.regex.test(content)) findings.push({ file, pattern: pattern.id });
  }
  return findings;
}

async function checkHandAuthoredDocMarkers(files) {
  const findings = [];
  const begin = `<!-- BEGIN BUILD ${phase.build} ADDITIVE UPDATE -->`;
  const end = `<!-- END BUILD ${phase.build} ADDITIVE UPDATE -->`;
  for (const file of files ?? []) {
    const absolute = path.resolve(root, file);
    if (!existsSync(absolute)) { findings.push({ file, pattern: "hand_authored_doc_missing" }); continue; }
    const content = await readFile(absolute, "utf8");
    const beginCount = content.split(begin).length - 1;
    const endCount = content.split(end).length - 1;
    if (beginCount !== 1 || endCount !== 1 || content.indexOf(begin) > content.indexOf(end)) findings.push({ file, pattern: "hand_authored_doc_marker_missing_or_unbalanced" });
  }
  return findings;
}

const summary = { created: [], updated: [], skipped: [], checked: [] };
let failed = false;
if (checkMode) {
  for (const file of phase.generatedArtifacts) {
    summary.checked.push(file);
    if (!existsSync(path.resolve(root, file))) {
      console.error(`Missing generated file: ${file}`);
      failed = true;
    }
  }
} else {
  for (const [relativePath, content] of outputs) {
    const absolute = path.resolve(root, relativePath);
    const exists = existsSync(absolute);
    const previous = exists ? await readFile(absolute, "utf8") : undefined;
    await mkdir(path.dirname(absolute), { recursive: true });
    if (!exists) { await writeFile(absolute, content); summary.created.push(relativePath); }
    else if (previous !== content) { await writeFile(absolute, content); summary.updated.push(relativePath); }
    else summary.skipped.push(relativePath);
  }
}
const findings = await scan([...phase.generatedArtifacts, ...scannerExtraPaths]);
const markerFindings = await checkHandAuthoredDocMarkers(phase.markerBoundedHandAuthoredDocs);
if (findings.length > 0 || markerFindings.length > 0) failed = true;
console.log(JSON.stringify({ mode: checkMode ? "check" : "write", ...summary, scanner_findings: findings, marker_findings: markerFindings }, null, 2));
if (failed) process.exit(1);
