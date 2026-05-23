# Security

StealthEye Agent OS is public-safe foundation work. Public repo contents must not include secrets, credentials, private endpoints, customer data, internal OAuth clients, cloud account details, production tokens, live deployment targets, live write APIs, queue credentials, or sensitive operational runbooks.

## Hard stops

Stop or escalate for deletion/destruction, raw secrets or credentials, money movement, purchases/payments, production deploys or production data mutation, production-impacting migrations, auth/security-critical changes, protected branch mutation, force push/history rewrite, CI/test/security weakening, material external sends, legal commitments, credentialed browsing, and platform-required confirmations.

## Build 8 BrowserOps posture

BrowserOps is fixture-only. It does not launch browsers, run Playwright, visit real websites, capture real screenshots, embed DOM content, access cookies/storage state, use credentials, submit forms, upload files, download real files, send material externally, make purchases, mutate production, or perform destructive browser actions.

## Build automation posture

The build engine generates public-safe state from phase specs and scans generated files plus BrowserOps fixtures for obvious public-safety violations. It is not a full security scanner, SBOM/provenance system, or compliance certification.
