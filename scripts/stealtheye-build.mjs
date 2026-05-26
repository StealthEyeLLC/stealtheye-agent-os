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
const strictGeneratedSync = phase.strictGeneratedSync === true;
const sharedGeneratedFiles = new Set(["docs/generated/project-memory.json", "docs/generated/known-gaps.json", "docs/generated/safety-capability-matrix.json", "docs/generated/eval-registry.json", "docs/generated/tool-inventory.json", "docs/generated/build-state.json"]);

const outputs = new Map([
  [`docs/generated/build-${buildPadded}-manifest.json`, json({ schema_version: "stealtheye-build-manifest.v1", build: phase.build, build_title: phase.title, branch: phase.branch, package_name: phase.packageName, files_created_or_updated: phase.importantFiles, docs_updated: phase.docsUpdated, tests_evals_added: phase.testsAndEvals, adr_added: phase.adr, ci_required_files: phase.ciRequiredFiles, safety_boundaries: phase.safetyBoundaries, generated_artifacts: phase.generatedArtifacts, known_gaps: phase.knownGaps, next_target: phase.nextTarget, hand_authored_doc_policy: docPolicy, marker_bounded_hand_authored_docs: phase.markerBoundedHandAuthoredDocs ?? [], generated_at: generatedAt, public_safe: true, live_execution_enabled: false })],
  [`docs/generated/build-${buildPadded}-acceptance.md`, `# Build ${phase.build} acceptance checklist: ${phase.title}\n\n## Package foundation\n\n${list(acceptanceItems)}\n\n## Build automation engine\n\n- scripts/stealtheye-build.mjs reads the phase spec and writes/checks generated state.\n- Generated files exist under docs/generated/.\n- Public-safe/no-live scanner runs in check mode.\n- Hand-authored docs are preserved outside explicit additive markers.\n\n## Boundary\n\n${list(phase.safetyBoundaries)}\n\n## Next target\n\n- ${phase.nextTarget}.\n`],
  [`docs/generated/build-${buildPadded}-handoff.md`, `# Build ${phase.build} handoff: ${phase.title}\n\n${phase.handoffSummary ?? `Build ${phase.build} adds ${packageSummary}`}\n\n## New package\n\n${packageSummary}\n\n## Generated files\n\n${list(phase.generatedArtifacts)}\n\n## Hand-authored docs policy\n\n${docPolicy}\n\n## Known gaps\n\n${list(phase.knownGaps)}\n\n## Next target\n\n${phase.nextTarget}.\n`],
  [`docs/generated/build-${buildPadded}-receipt.json`, json({ schema_version: "stealtheye-build-receipt.v1", build: phase.build, title: phase.title, branch: phase.branch, package_name: phase.packageName, generated_artifacts: phase.generatedArtifacts, checks_expected: phase.ciRequiredFiles, hand_authored_doc_policy: docPolicy, generated_at: generatedAt, live_execution_enabled: false, durable_database_enabled: false, production_artifact_storage_enabled: false, production_mutation_enabled: false, money_movement_enabled: false })],
  ["docs/generated/project-memory.json", json({ schema_version: "stealtheye-project-memory.v1", current_build: phase.build, current_title: phase.title, current_branch: phase.branch, foundation_packages: foundationPackages, build_summary: phase.projectMemorySummary ?? packageSummary, hand_authored_doc_policy: docPolicy, next_target: phase.nextTarget })],
  ["docs/generated/known-gaps.json", json({ schema_version: "stealtheye-known-gaps.v1", build: phase.build, gaps: phase.knownGaps.map((summary, index) => ({ gap_id: `build-${buildPadded}-gap-${String(index + 1).padStart(2, "0")}`, summary, status: "open" })), next_target: phase.nextTarget })],
  ["docs/generated/safety-capability-matrix.json", json({ schema_version: "stealtheye-safety-capability-matrix.v1", build: phase.build, capabilities: capabilityMatrix })],
  ["docs/generated/eval-registry.json", json({ schema_version: "stealtheye-eval-registry.v1", build: phase.build, evals: phase.testsAndEvals.map((name, index) => ({ eval_id: `build-${buildPadded}-eval-${String(index + 1).padStart(2, "0")}`, name, location: phase.evalLocations?.[name] ?? (name.includes("marker") ? "scripts/stealtheye-build.mjs" : phase.defaultEvalLocation ?? `packages/${phase.packageName?.split("/").at(-1)}/test`) })) })],
  ["docs/generated/tool-inventory.json", json({ schema_version: "stealtheye-tool-inventory.v1", build: phase.build, tools: toolInventory })],
  ["docs/generated/build-state.json", json({ schema_version: "stealtheye-build-state.v1", build: phase.build, title: phase.title, branch: phase.branch, generated_artifacts_current: true, safety_scanner_scope: ["docs/generated", ...scannerExtraPaths], hand_authored_doc_policy: docPolicy, marker_bounded_hand_authored_docs: phase.markerBoundedHandAuthoredDocs ?? [], next_target: phase.nextTarget, generated_at: generatedAt })]
]);
for (const [file, content] of Object.entries(phase.standaloneDocs ?? {})) outputs.set(file, content.endsWith("\n") ? content : `${content}\n`);
for (const [file, content] of Object.entries(phase.llmContextUpdates ?? {})) outputs.set(file, content.endsWith("\n") ? content : `${content}\n`);

const beginMarker = `<!-- BEGIN BUILD ${phase.build} ADDITIVE UPDATE -->`;
const endMarker = `<!-- END BUILD ${phase.build} ADDITIVE UPDATE -->`;
function applyMarkerUpdate(existing, markerContent) {
  const block = `${beginMarker}\n\n${markerContent.trim()}\n\n${endMarker}`;
  const begin = existing.indexOf(beginMarker);
  const end = existing.indexOf(endMarker);
  if (begin >= 0 && end >= begin) return `${existing.slice(0, begin).trimEnd()}\n\n${block}\n${existing.slice(end + endMarker.length).replace(/^\n+/, "")}`;
  return `${existing.trimEnd()}\n\n${block}\n`;
}
async function currentGeneratedBuild() {
  const file = path.resolve(root, "docs/generated/build-state.json");
  if (!existsSync(file)) return phase.build;
  try { return JSON.parse(await readFile(file, "utf8")).build ?? phase.build; } catch { return phase.build; }
}
function generatedContentMatches(file, actual, expected) {
  if (file.endsWith(".json")) {
    try {
      return JSON.stringify(JSON.parse(actual)) === JSON.stringify(JSON.parse(expected));
    } catch {
      return actual === expected;
    }
  }
  return actual === expected;
}
const unsafePatterns = [
  { id: "non_public_endpoint", regex: /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|172\.(?:1[6-9]|2\d|3[0-1])\.|192\.168\.|[^\s/]*\.internal|[^\s/]*\.corp)/i },
  { id: "customer_data_marker", regex: /customer[_ -]?(?:ssn|social security|card number|production data)/i },
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
  for (const file of files ?? []) {
    const absolute = path.resolve(root, file);
    if (!existsSync(absolute)) { findings.push({ file, pattern: "hand_authored_doc_missing" }); continue; }
    const content = await readFile(absolute, "utf8");
    const beginCount = content.split(beginMarker).length - 1;
    const endCount = content.split(endMarker).length - 1;
    if (beginCount !== 1 || endCount !== 1 || content.indexOf(beginMarker) > content.indexOf(endMarker)) findings.push({ file, pattern: "hand_authored_doc_marker_missing_or_unbalanced" });
    const expectedMarker = phase.markerBoundedDocUpdates?.[file];
    if (strictGeneratedSync && expectedMarker && !content.includes(expectedMarker.trim())) findings.push({ file, pattern: "marker_content_not_synced_from_phase" });
  }
  return findings;
}
async function checkRequiredFiles(files) {
  const findings = [];
  for (const file of files ?? []) if (!existsSync(path.resolve(root, file))) findings.push({ file, pattern: "required_file_missing" });
  return findings;
}
const summary = { created: [], updated: [], skipped: [], checked: [] };
let failed = false;
if (checkMode) {
  const currentBuild = await currentGeneratedBuild();
  const strictFiles = [...outputs.keys()].filter((file) => currentBuild <= phase.build || !sharedGeneratedFiles.has(file));
  const filesToCheck = strictGeneratedSync ? strictFiles : phase.generatedArtifacts;
  for (const file of filesToCheck) {
    summary.checked.push(file);
    const absolute = path.resolve(root, file);
    if (!existsSync(absolute)) { console.error(`Missing generated/synced file: ${file}`); failed = true; continue; }
    if (strictGeneratedSync && outputs.has(file)) {
      const actual = await readFile(absolute, "utf8");
      const expected = outputs.get(file);
      if (!generatedContentMatches(file, actual, expected)) { console.error(`Generated/synced file is stale: ${file}`); failed = true; }
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
  for (const [relativePath, markerContent] of Object.entries(phase.markerBoundedDocUpdates ?? {})) {
    const absolute = path.resolve(root, relativePath);
    const exists = existsSync(absolute);
    const previous = exists ? await readFile(absolute, "utf8") : "";
    const next = applyMarkerUpdate(previous, markerContent);
    await mkdir(path.dirname(absolute), { recursive: true });
    if (!exists) { await writeFile(absolute, next); summary.created.push(relativePath); }
    else if (previous !== next) { await writeFile(absolute, next); summary.updated.push(relativePath); }
    else summary.skipped.push(relativePath);
  }
}
const scanFiles = [...new Set([...(phase.generatedArtifacts ?? []), ...outputs.keys(), ...(phase.markerBoundedHandAuthoredDocs ?? []), ...scannerExtraPaths])];
const findings = await scan(scanFiles);
const markerFindings = await checkHandAuthoredDocMarkers(phase.markerBoundedHandAuthoredDocs);
const requiredFileFindings = await checkRequiredFiles(phase.requiredFiles);
if (findings.length > 0 || markerFindings.length > 0 || requiredFileFindings.length > 0) failed = true;
console.log(JSON.stringify({ mode: checkMode ? "check" : "write", ...summary, scanner_findings: findings, marker_findings: markerFindings, required_file_findings: requiredFileFindings }, null, 2));
if (failed) process.exit(1);
