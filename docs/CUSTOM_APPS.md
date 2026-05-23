# Custom Apps

Each app contributes a bounded capability surface to the agent OS. Tool descriptions are not trusted by default; signed manifests, Guard checks, and receipts are required.

| App | Purpose | Major tool families | Autonomy contribution | Hard-stop considerations |
|---|---|---|---|---|
| StealthEye Mission OS | mission intake, planning, authority envelopes, status, final reports | mission CRUD, approval capture, state inspection, receipt routing | turns delegated goals into durable, bounded missions | stops at missing authority, production impact, money movement, legal commitments |
| StealthEye CodeOps | repository change execution | branching, patching, commits, PRs, diff review | lets agents safely change code/docs within scoped branches | no protected-branch writes, force push, CI weakening, secrets |
| StealthEye CI Repair | diagnose and repair failing checks | workflow/log read, failure classification, repair patches | keeps delivery loops moving without repeated approval | may not delete tests or weaken checks to pass |
| StealthEye BrowserOps | browser QA and online task observation | Playwright sessions, screenshots, traces, console/network capture | validates UI and public web flows | stops before purchases, auth-critical steps, external sends, destructive actions |
| StealthEye Worker Fleet | durable background execution | queues, retries, leases, idempotency, worker health | runs long missions reliably | must enforce authority tokens and stop boundaries per task |
| StealthEye Guard | policy gate and decision engine | risk classification, hard-stop checks, approval prompts | prevents overreach while preserving autonomy inside scope | blocks all hard stops until explicit higher authority exists |
| StealthEye Secrets Broker | controlled secret access without raw exposure | secret handles, brokered signing, scoped env injection | enables tasks needing credentials without leaking values | never returns raw secrets to agents/logs/receipts |
| StealthEye Memory Graph | durable project and mission memory | entities, decisions, preferences, issue links, evidence refs | improves continuity across builds and missions | must avoid storing private data in public repo |
| StealthEye Tool Router | tool discovery and routing | manifest lookup, capability matching, policy-aware routing | chooses tools based on signed, pinned metadata | no blind trust of remote tool descriptions |
| StealthEye Evals | quality and safety regression system | eval suites, fixtures, expected receipts, score reports | turns failures into durable tests | must include prompt-injection/tool-poisoning cases |
| StealthEye StagingOps | safe staging deployment and validation | preview envs, smoke tests, rollback evidence | tests release candidates before production | no production deploy without explicit authority |
| StealthEye InfraOps | non-secret infrastructure planning/execution | IaC scaffolds, plan review, drift evidence | supports environment creation with auditable plans | no private cloud/account details in public repo |
| StealthEye Observability | mission/runtime observability | logs, metrics, traces, dashboards, alerts | makes autonomous work inspectable | redact secrets/customer data |
| StealthEye ProductOps | product planning and backlog operations | requirements, specs, issue updates, release notes | keeps product loop connected to missions | no material external commitments as company |
| StealthEye InboxOps | inbox triage and drafting | classify, summarize, draft, label | delegates communication prep | no material sends without required confirmation |
| StealthEye CustomerOps | customer support workflows | ticket triage, draft replies, knowledge lookup | scales support with receipts | no customer data in public repo; no commitments/refunds |
| StealthEye ResearchOps | research and synthesis | web/source search, citation capture, dossier building | delegates open-ended research | respect source provenance and privacy boundaries |
| StealthEye CommerceOps | commerce-related task assistance | catalog research, cart preparation, order evidence | delegates shopping/admin prep | no purchases, refunds, billing/subscriptions without approval |
| StealthEye Agent Registry | trusted agent/tool catalog | signed agent cards, manifests, revocation, diffing | lets agents safely discover delegated peers/tools | no blind trust; pin manifests and verify signatures |
| StealthEye Semantic Firewall | content and prompt boundary layer | injection detection, data classification, sanitization | filters malicious repo/log/browser/doc content | cannot be bypassed by tool output claims |
| StealthEye Workflow Compiler | mission-to-DAG compiler | workflow blueprints, dependency graphs, retries | turns intent into executable durable workflows | must encode idempotency and approvals |
| StealthEye Agent Arena | agent eval and competition harness | task suites, scoreboards, adversarial runs | selects stronger agents/tool policies empirically | no production authority in arena runs |
