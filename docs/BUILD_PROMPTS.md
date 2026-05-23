# Build Prompts

## Quick build flow

1. Jamie opens a new ChatGPT tab for the next build prompt.
2. Builder completes focused work in the repo.
3. Builder updates docs, AGENTS.md, llms.txt, llms-full.txt, evals, receipts/evidence expectations, and verification checklist where applicable.
4. Jamie returns to verifier chat with PR/branch/commit.
5. Verifier checks work.
6. Verifier updates issue #1.
7. Verifier provides next prompt.

## Standing build prompt requirements

A build prompt should state the branch, scope, allowed paths, forbidden paths, hard stops, expected files, verification commands, receipt requirements, eval expectations, final response format, and next recommended target.

## Discipline

Do not mix unrelated features. Do not add secrets or private infrastructure. Do not claim certification or open-source status without the required artifacts. Keep AGENTS.md concise and push detail into docs.
