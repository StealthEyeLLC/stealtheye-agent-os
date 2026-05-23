# Control Matrix

| Control ID | Control objective | Framework mapping | Evidence source | Owner/system | Status | Notes |
|---|---|---|---|---|---|---|
| CTL-001 | Enforce mission-scoped authority | NIST AI RMF, SOC 2, OWASP Agentic | Authority envelope, Guard receipts | Mission OS / Guard | Planned | Build schemas next. |
| CTL-002 | Prevent raw secret exposure | NIST CSF, ISO 27001, SOC 2 | Secrets Broker logs, redaction receipts | Secrets Broker | Planned | No secrets in public repo. |
| CTL-003 | Capture replayable evidence | ISO 42001, SOC 2 | Receipt ledger, artifacts | Receipts | Planned | Schema pending. |
| CTL-004 | Manage AI/model risk | NIST AI RMF, EU AI Act readiness | Evals, risk register | Evals / AI Governance | Planned | Include adversarial evals. |
| CTL-005 | Secure supply chain | NIST SSDF, SLSA | SBOM, dependency scan, provenance | CI / Supply Chain | Planned | Placeholder CI only. |
