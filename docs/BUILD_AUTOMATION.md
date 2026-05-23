# Build Automation

Build 8 adds a minimal reusable build automation engine for predictable public-safe build-state artifacts. It is separate from BrowserOps runtime design.

## Files

- Engine: `scripts/stealtheye-build.mjs`
- Build 8 phase spec: `scripts/phases/build-008-browserops.mjs`
- Generated state directory: `docs/generated/`

## Purpose

The engine reads a phase spec, generates deterministic build-state files, prints created/updated/skipped/check summaries, supports idempotent reruns, supports `--check` for CI, and scans generated files plus BrowserOps fixtures for obvious unsafe public content and false live-capability claims.

## Commands

```bash
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs
node scripts/stealtheye-build.mjs scripts/phases/build-008-browserops.mjs --check
```

## Build 8 generated files

- `docs/generated/build-008-manifest.json`
- `docs/generated/build-008-acceptance.md`
- `docs/generated/build-008-handoff.md`
- `docs/generated/build-008-receipt.json`
- `docs/generated/project-memory.json`
- `docs/generated/known-gaps.json`
- `docs/generated/safety-capability-matrix.json`
- `docs/generated/eval-registry.json`
- `docs/generated/tool-inventory.json`
- `docs/generated/build-state.json`

## Safety boundary

Generated files must remain public-safe. The scanner is conservative and does not replace full security scanning, dependency review, SBOM/provenance, SAST, DAST, or manual security review.
