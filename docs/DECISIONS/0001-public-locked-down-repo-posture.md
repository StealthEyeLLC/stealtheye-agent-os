# ADR 0001: Public-visible but locked-down repo posture

## Status

Accepted

## Context

The repo is public-visible while the product is being built. The project needs transparent architecture and governance without exposing secrets or implying open contribution.

## Decision

Use a public-visible, locked-down posture. Public content may include docs, specs, schemas, scaffolds, mock data, eval templates, and governance. Private systems hold secrets, credentials, customer data, production endpoints, internal OAuth clients, cloud/account details, and sensitive runbooks.

## Consequences

Clear public/private boundaries reduce leakage risk and allow external visibility. Contributors must not assume open-source status or open contribution until licensing/governance changes.

## Revisit triggers

Revisit when a final license is selected, contribution policy is approved, or production systems require separate private repos.
