# Control Matrix

| Control ID | Control objective | Framework mapping | Evidence source | Owner/system | Status | Notes |
|---|---|---|---|---|---|---|
| CTL-001 | Enforce mission-scoped authority | NIST AI RMF, SOC 2, OWASP Agentic | Mission authority envelopes, capability tokens, Guard decisions, Guard receipts | Mission OS / Guard | Implemented foundation | Build 4 adds Mission OS authority-envelope production; runtime service deferred. |
| CTL-002 | Prevent raw secret exposure | NIST CSF, ISO 27001, SOC 2 | Secrets Broker logs, redaction receipts, Guard hard stops | Secrets Broker / Guard | Planned foundation | Guard escalates raw secret access; broker not built yet. |
| CTL-003 | Capture replayable evidence | ISO 42001, SOC 2 | Mission receipt refs, Guard decision receipts, artifacts | Receipts / Mission OS / Guard | Implemented foundation | Build 4 adds mission-level references; full ledger pending. |
| CTL-004 | Manage AI/model risk | NIST AI RMF, EU AI Act readiness | Evals, risk register, Mission Language fixtures | Evals / AI Governance | Planned foundation | Mission OS fixtures cover hard-stop and invalid-plan cases. |
| CTL-005 | Secure supply chain | NIST SSDF, SLSA | SBOM, dependency scan, provenance | CI / Supply Chain | Planned | Full scanning/provenance deferred. |
| CTL-006 | Verify signed agent/tool metadata before trust | OWASP LLM/Agentic, NIST SSDF, SOC 2 | Agent Registry verification results, digests, signatures | Agent Registry | Implemented foundation | In-memory only; no durable store yet. |
| CTL-007 | Revoke compromised agents/manifests/keys/digests | NIST CSF, ISO 27001, SOC 2 | Revocation entries, registry decisions | Agent Registry / Guard | Implemented foundation | Durable revocation propagation deferred. |
| CTL-008 | Require review for risky manifest diffs | NIST AI RMF, OWASP Agentic | Manifest diff output | Agent Registry / Guard | Implemented foundation | Future UI/Guard integration needed. |
| CTL-009 | Block or escalate hard-stop actions | NIST AI RMF, OWASP Agentic, SOC 2 | Guard reason codes, matched hard stops, receipts | Guard | Implemented foundation | Mission OS can model hard stops for evals; Guard enforces decisions. |
| CTL-010 | Enforce manifest pinning and trust status | NIST SSDF, OWASP Agentic | Guard policy checks, registry summaries | Guard / Agent Registry | Implemented foundation | Build 3 enforces pinned digest and trusted/approved summary requirements. |
| CTL-011 | Validate mission intent before execution | NIST AI RMF, SOC 2, OWASP Agentic | Mission Language schemas, compile results, status summaries | Mission OS | Implemented foundation | Build 4 validates/normalizes mission intent and emits authority-aware structures. |
| CTL-012 | Track mission lifecycle and blockers | SOC 2, ISO 42001 readiness | Mission status snapshots, blockers, next actions | Mission OS / Receipts | Implemented foundation | Build 4 includes status transition and summary helpers. |
