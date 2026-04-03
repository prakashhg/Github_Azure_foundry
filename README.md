# Github_Azure_foundry

This repository deploys Azure AI Foundry via Terraform and includes an automation workflow to generate code from Azure Foundry agentic AI based on issues.

## Full Workflow: Issues -> GitHub Action -> Azure Foundry -> PR -> Merge -> Terraform Deploy

1. **Create Issue**: Open an issue with label `auto-patch` or `foundry-auto` and a prompt in the body (use ```prompt ... ``` or full body as fallback).
2. **GitHub Action Triggers**: `issue-to-pr.yml` workflow runs on issue events.
3. **Azure Foundry Call**: Action authenticates to Azure via OIDC, calls Foundry agent endpoint with the prompt, receives generated code/diff.
4. **Commit and PR**: Applies the generated code (diff or file), commits to a branch, creates PR into `main`.
5. **Review and Merge**: Review the PR, merge it.
6. **Terraform Deploy**: On push to `main`, `terraform.yml` runs `init`, `validate`, `plan`, `apply` to deploy/update Azure AI Foundry infrastructure.

## Issue -> PR Automation (Foundry Agentic)

Workflow: `.github/workflows/issue-to-pr.yml`

Trigger:
- `issues` events: opened, edited, labeled
- requires issue label `auto-patch` or `foundry-auto`
- issue body with prompt (```prompt ... ``` block or full body)

Behavior:
1. authenticate Azure OIDC
2. extract prompt from issue body
3. call Azure Foundry agentic AI endpoint
4. receive response (diff or code)
5. apply patch or add file, commit
6. create PR into `main`
7. close issue

## Terraform Deployment

Workflow: `.github/workflows/terraform.yml`

- `push` to `main` and `workflow_dispatch` trigger
- runs `terraform init`, `validate`, `plan`, `apply`
- supports existing or new resource group via variables

## Variables

- `use_existing_resource_group`: bool (default false) - set to true to use existing RG
- `existing_resource_group_name`: string - name of existing RG (if using existing)

## Secrets needed

- `ARM_SUBSCRIPTION_ID`
- `ARM_TENANT_ID`
- `ARM_CLIENT_ID`
- `ARM_CLIENT_SECRET` (if needed)
- `FOUNDRY_AGENT_ENDPOINT` (for issue-to-pr workflow)
