# Autonomy Model

StealthEye Agent OS is designed for broad autonomy inside explicit mission-scoped delegated authority.

## Mission-scoped delegated authority

A mission authority envelope should define:

- goal and success criteria;
- allowed repositories, branches, paths, systems, accounts, or datasets;
- allowed tools and capabilities;
- forbidden actions and hard stops;
- time and retry limits;
- evidence/receipt requirements;
- escalation conditions;
- final reporting expectations.

Build 3 represents this delegated authority as capability-token primitives in `@stealtheye/guard`. Capability tokens are mission-scoped authority records, not production auth credentials and not secret storage.

## Broad autonomy inside the envelope

Once a mission is approved, the agent should proceed through ordinary delegated actions without repeatedly asking for approval. Examples include creating a feature branch, editing allowed files, adding documentation, running safe checks, collecting non-sensitive logs, opening a PR, and producing receipts.

## No repeated approval for ordinary delegated actions

Approval fatigue weakens the operating model. The system should ask again only when authority is missing, scope is unclear, a hard stop is reached, external platform confirmation is required, or risk materially changes.

## Guard decision model

Guard evaluates a requested action against active capability tokens, target constraints, tool/manifest constraints, registry trust summaries, usage/time constraints, and hard-stop rules. It returns a structured decision: `allow`, `deny`, `escalate`, or `warn`, plus deterministic reason codes, matched token ids, matched hard stops, policy checks, and receipt/evidence obligations.

An action may be allowed only when a valid active token applies, the effect is allowed, scope constraints match, registry trust requirements are satisfied, pinned digests match when required, and no hard stop is triggered.

## Hard stops

- deletion/destruction
- raw secrets/credentials
- money/refunds/purchases/billing/subscriptions
- production deployment or production data mutation
- production-impacting DB migrations
- auth/security-critical changes
- direct protected branch mutation
- force push/history rewrite
- weakening CI/tests/security controls to pass
- material external sends as Jamie/company
- legal commitments/contracts
- platform/OpenAI-required confirmations

## Escalation behavior

When a hard stop is encountered, the agent must stop, preserve current evidence, explain the blocked action, describe the required authority or safer alternative, and wait for an explicit new authorization path. Build 3 hard-stop evaluation maps protected branch mutation, force push/history rewrite, and CI/test weakening to denial by default, while money movement, raw secret access, production actions, legal commitments, material external sends, and platform-required confirmations escalate by default.
