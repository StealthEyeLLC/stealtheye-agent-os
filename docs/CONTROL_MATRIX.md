# Control Matrix

| Control ID | Control objective | Framework mapping | Evidence source | Owner/system | Status | Notes |
|---|---|---|---|---|---|---|
| CTL-001 | Enforce mission-scoped authority | NIST AI RMF, SOC 2, OWASP Agentic | Authority envelope, Guard receipts | Mission OS / Guard | Planned | Build 3 target. |
| CTL-002 | Prevent raw secret exposure | NIST CSF, ISO 27001, SOC 2 | Secrets Broker logs, redaction receipts | Secrets Broker | Planned | No secrets in public repo. |
| CTL-003 | Capture replayable evidence | ISO 42001, SOC 2 | Receipt ledger, artifacts | Receipts | Planned | Registry fields documented; schema pending. |
| CTL-004 | Manage AI/model risk | NIST AI RMF, EU AI Act readiness | Evals, risk register | Evals / AI Governance | Planned | Include adversarial evals. |
| CTL-005 | Secure supply chain | NIST SSDF, SLSA | SBOM, dependency scan, provenance | CI / Supply Chain | Planned | Full scanning/provenance deferred. |
| CTL-006 | Verify signed agent/tool metadata before trust | OWASP LLM/Agentic, NIST SSDF, SOC 2 | Agent Registry verification results, digests, signatures | Agent Registry | Implemented foundation | In-memory only; no durable store yet. |
| CTL-007 | Revoke compromised agents/manifests/keys/digests | NIST CSF, ISO 27001, SOC 2 | Revocation entries, registry decisions | Agent Registry / Guard | Implemented foundation | Durable revocation propagation deferred. |
| CTL-008 | Require review for risky manifest diffs | NIST AI RMF, OWASP Agentic | Manifest diff output | Agent Registry / Guard | Implemented foundation | Future UI/Guard integration needed. |
