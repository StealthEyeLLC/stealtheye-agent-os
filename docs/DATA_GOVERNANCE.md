# Data Governance

Public repo data must be non-secret and non-customer-specific. Private systems hold secrets, credentials, customer data, internal OAuth clients, production endpoints, cloud/account details, and sensitive runbooks.

## Principles

- Minimize collection and retention.
- Classify data before storage or receipt emission.
- Redact sensitive values from logs and artifacts.
- Store evidence references instead of raw sensitive content where possible.
- Separate public specs from private operational state.

## Data classes

Public docs/specs, mock data, internal operational data, customer data, secrets/credentials, production telemetry, and regulated data. Only the first two belong in this repo.
