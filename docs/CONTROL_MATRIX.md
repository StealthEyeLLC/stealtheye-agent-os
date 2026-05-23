# Control Matrix

| Area | Current control | Build 8 status | Deferred work |
| --- | --- | --- | --- |
| Mission authority | Mission OS schemas and authority envelopes | Modeled | Durable authority store and workflow compiler |
| Capability enforcement | Guard requested actions, capability tokens, hard stops, registry trust | Modeled and tested | Runtime enforcement across live tools |
| Worker execution | Worker Fleet task, lease, idempotency, retry, receipt contracts | Contract-only | Queues, executors, durable leases |
| CodeOps | Patch/CI/PR evidence contracts and policy helpers | Contract-only | Live GitHub app execution and CI repair workers |
| BrowserOps | Session, observation, evidence ref, action policy, preflight, worker handoff contracts | Fixture-only | Isolated browser runtime and artifact capture |
| Build state | Deterministic generated state and `--check` | Minimal engine | Rich workflow compiler and receipt ledger |
| Receipts | Package-level receipt refs and generated build receipt snapshot | Partial | Build 9 Receipts + Replay |

Build 8 does not run live automation, manage credentials, deploy, mutate production, or provide full security scanning.
