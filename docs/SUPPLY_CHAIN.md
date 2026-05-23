# Supply Chain

## Required direction

- Generate SBOMs once package scaffolding and release workflow mature.
- Run dependency scanning in CI in a later build.
- Pin dependencies where practical.
- Preserve provenance for builds, artifacts, releases, and manifests.
- Sign releases and manifests when release workflows exist.
- Harden CI/CD with least privilege and protected branches.
- Emit SLSA-aligned evidence.
- Map secure development practices to NIST SSDF SP 800-218.

## Build 2 status

Build 2 adds package scaffolding and signed manifest primitives. Manifest signing is implemented for local verification tests with Node crypto and generated in-memory test keys. Production signing keys, release signing, SBOM generation, SLSA provenance, and dependency scanning are still future work.

The CI workflow now performs real package install, typecheck, and tests, but it does not claim full production security scanning or supply-chain attestation.
