# CodeOps

CodeOps is the branch-safe repository operations foundation for StealthEye Agent OS. Build 7 adds package-level contracts and deterministic helpers only. It does not add a live GitHub API client, branch creator, commit writer, PR writer, CI rerunner, protected-branch writer, force-push path, browser automation, deployment path, secret access, customer-data workflow, or production mutation.

## Build 7 package

`packages/codeops` provides:

- repository target schemas for repo name, base branch, working branch, allowed branch prefixes, protected branches, allowed and denied paths, required checks, required commands, authority refs, capability-token refs, manifest/tool refs, evidence requirements, and receipt requirements;
- branch policy helpers for branch name validation, protected branch detection, branch-prefix enforcement, force-push/history-rewrite denial, direct protected-branch mutation denial, path allow/deny matching, and branch-safe summaries;
- patch plan schemas for mission/task identity, repo target, file read/modify/create/delete-or-deprecate contracts, expected effects, risk tier, verification plan, rollback notes, evidence refs, receipt refs, and status;
- file change contracts for read/create/update/delete/rename operations with before/after digest refs, summaries, risk indicators, evidence refs, and receipt refs;
- deterministic risk helpers for destructive deletes, protected paths, suspicious secret-bearing paths, CI/test/security weakening indicators, file-change summaries, and stable patch-plan fingerprints;
- verification plan helpers that require typecheck/test commands for package changes, docs evidence for documentation changes, CI status evidence, and weakening detection;
- PR evidence packet schemas capturing branch, checks, files, verification plans, patch fingerprints, evidence refs, and receipt refs;
- Guard and Worker Fleet preflight adapters that model requested actions and task templates without executing live actions.

## Branch safety model

CodeOps allows branch-scoped work only when:

- the working branch is not a protected/base branch;
- the branch uses an allowed prefix such as `agent/`;
- changed paths are inside allowed scopes and outside denied scopes;
- no force push or history rewrite intent is present;
- no destructive delete, protected branch mutation, or CI/test/security weakening is required;
- required evidence and receipts are represented.

Protected branch mutation and force push/history rewrite are denied. Destructive delete is represented as a blocked or escalated condition, not performed.

## Guard and Worker Fleet integration

Build 7 maps patch plans to Guard requested actions for repo read, branch file writes, branch commit, PR open, CI read, failed-job rerun, receipt write, and hard-stop indicators. It also creates Worker Fleet task templates for future CodeOps and CI Repair lanes. These templates carry requested actions and capability-token refs, then pass through Guard preflight. They do not execute live repository writes.

## Public/private boundary

Fixtures are fake, local, deterministic, and public-safe. CodeOps docs and fixtures must not include real secrets, private keys, production endpoints, customer data, internal OAuth clients, live GitHub App credentials, real GitHub installation IDs, cloud account identifiers, sensitive runbooks, production tokens, live write APIs, or deployment targets.

## Evals

`packages/codeops/test/codeops.test.ts` covers valid/invalid repo targets, branch prefix acceptance, protected branch denial, force-push/history-rewrite denial, allowed/denied paths, destructive deletes, secret-bearing paths, CI/test weakening, stable patch-plan fingerprints, verification obligations, Guard requested actions, Worker Fleet task templates, Guard preflight allow/block behavior, untrusted registry blocking, PR evidence packets, and no-secret fixtures.

These tests are initial eval-style cases. Future live CodeOps builds should promote them into runtime evals before enabling branch creation, commits, PR creation, CI reruns, or GitHub App write scopes.
