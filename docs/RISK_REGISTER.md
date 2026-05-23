# Risk Register

| Risk category | Description | Initial mitigation | Status |
|---|---|---|---|
| AI/model risk | Incorrect planning, hallucinated facts, overconfidence | Evals, receipts, verifier review | Open |
| Tool/MCP risk | Tool misuse or misleading tool metadata | Signed manifests, Guard, registry | Open |
| Prompt injection risk | Malicious instructions in untrusted content | Semantic Firewall, evals | Open |
| Secret exposure risk | Credential leakage to logs/repo/receipts | Secrets Broker, redaction | Open |
| Production impact risk | Unapproved prod deploy/data mutation | Hard stops, authority tokens | Open |
| Financial/money movement risk | Purchases/refunds/subscriptions | Hard stop and explicit confirmation | Open |
| Browser automation risk | Click/submit in sensitive flows | BrowserOps gates and evidence | Open |
| Supply-chain risk | Dependency or manifest compromise | SBOM, signing, provenance | Open |
| Privacy risk | Customer/personal data mishandling | Data governance, minimization | Open |
| Compliance risk | Misstated readiness/certification | No certification claims; control matrix | Open |
