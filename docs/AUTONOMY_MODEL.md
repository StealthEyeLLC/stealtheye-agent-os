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

Build 4 represents this upstream of Guard through Mission OS. Mission Language expresses user intent, targets, authority, verification, evidence, receipts, stop conditions, and final-report expectations. Mission OS compiles that into normalized missions, authority envelopes, lightweight plans, status snapshots, and Guard-compatible templates.

Build 5 exposes these structures through App Host preview tools. App Host can validate, compile, preview, and summarize mission/Guard/Registry/policy data, but it does not grant authority, issue credentials, or execute tools.

## Broad autonomy inside the envelope

Once a mission is approved, the agent should proceed through ordinary delegated actions without repeatedly asking for approval. Examples include creating a feature branch, editing allowed files, adding documentation, running safe checks, collecting non-sensitive logs, opening a PR, and producing receipts.

Build 5 does not perform those actions. It only previews the structures and decisions that future live systems will use.

## No repeated approval for ordinary delegated actions

Approval fatigue weakens the operating model. The system should ask again only when authority is missing, scope is unclear, a hard stop is reached, external platform confirmation is required, or risk materially changes.

## Mission OS, App Host, and Guard decision model

Mission OS structures intent and produces authority envelopes. App Host exposes preview-only views of mission compilation, Guard decisions, registry validation/trust, and hard-stop policy. Guard evaluates requested actions against active capability tokens, target constraints, tool/manifest constraints, registry trust summaries, usage/time constraints, and hard-stop rules. App Host and Mission OS do not duplicate Guard policy logic.

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

When a hard stop is encountered, the agent must stop, preserve current evidence, explain the blocked action, describe the required authority or safer alternative, and wait for an explicit new authorization path. App Host may preview hard-stop summaries and Guard decisions, but it must not enable real execution of hard-stop actions.
