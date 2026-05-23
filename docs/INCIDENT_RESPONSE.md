# Incident Response

## Incident classes

Secret exposure, unauthorized tool action, prompt injection success, manifest compromise, production impact, privacy event, supply-chain compromise, and evidence tampering.

## Response flow

Detect -> contain -> preserve evidence -> assess impact -> revoke credentials/manifests/tokens -> remediate -> notify required parties where applicable -> add eval/regression -> update controls.

## Evidence

Receipts, logs, artifacts, manifests, commits, CI outputs, browser traces, and Guard decisions should support incident reconstruction without exposing secrets.
