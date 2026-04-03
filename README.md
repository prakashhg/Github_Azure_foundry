# Github_Azure_foundry

This repository deploys Azure AI Foundry via Terraform and includes an automation workflow to turn issue-provided diffs into PRs.

## Issue -> PR Automation (new workflow)

Workflow: `.github/workflows/issue-to-pr.yml`

Trigger:
- `issues` events: opened, edited, labeled
- requires issue label `auto-patch` or `foundry-auto`
- requires issue body with a diff block:
  ```diff
  ```diff
  diff --git a/path b/path
  ...
  ```
  ```

Behavior:
1. parse diff from issue body
2. checkout `main` and create branch `issue-<number>-auto-patch`
3. apply patch, commit change
4. create PR into `main`
5. close issue

## Current Terraform flow

Workflow: `.github/workflows/terraform.yml`

- `push` to `main` and `workflow_dispatch` trigger
- runs `terraform init`, `validate`, `plan`, `apply`

## Secrets needed for Terraform workflow

- `ARM_SUBSCRIPTION_ID`
- `ARM_TENANT_ID`
- `ARM_CLIENT_ID`
- (plus `ARM_CLIENT_SECRET` when needed in Azure login)
