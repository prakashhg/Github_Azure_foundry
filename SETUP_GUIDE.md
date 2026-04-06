# GitHub Azure AI Automation - Complete Setup Guide

## 🚀 Overview

This system automates code generation for GitHub issues using Azure OpenAI (GPT-4o). When a manager creates an issue, the workflow automatically:

1. ✅ Analyzes the issue and requirements
2. ✅ Calls Azure OpenAI GPT-4o to generate code
3. ✅ Creates a feature branch
4. ✅ Commits the generated code
5. ✅ Creates a Pull Request
6. ✅ Closes the original issue automatically

---

## 📋 Prerequisites

- Azure Subscription with OpenAI service deployed
- GitHub Repository with Actions enabled
- Node.js 18+ for local testing

---

## 🔧 Step 1: Deploy Azure Infrastructure

### 1.1 Initialize and Deploy Terraform

```bash
# Navigate to your project directory
cd /workspaces/Github_Azure_foundry

# Initialize Terraform (downloads providers)
terraform init

# Validate configuration
terraform validate

# Plan deployment (review what will be created)
terraform plan -out=tfplan

# Apply the plan (creates Azure resources)
terraform apply tfplan
```

### 1.2 Retrieve Azure OpenAI Credentials

After deployment, get the credentials:

```bash
# Show all outputs
terraform output

# Save specific values for GitHub Secrets
terraform output -raw azure_openai_endpoint
terraform output -raw azure_openai_key
```

**Example Output:**
```
azure_openai_endpoint = "https://openai-foundry-xxx.openai.azure.com/"
azure_openai_key = "abc123...xyz789"
gpt4o_deployment_name = "gpt4o-code-gen"
```

---

## 🔐 Step 2: Configure GitHub Secrets

GitHub Secrets protect sensitive credentials. Add these to your repository:

### 2.1 Via GitHub Web Interface

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Value | Source |
|------------|-------|--------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | `terraform output azure_openai_endpoint` |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | `terraform output azure_openai_key` |

### 2.2 Via GitHub CLI (Command Line)

```bash
# Authenticate with GitHub
gh auth login

# Add secrets
gh secret set AZURE_OPENAI_ENDPOINT --body "https://openai-foundry-xxx.openai.azure.com/"
gh secret set AZURE_OPENAI_KEY --body "your-api-key-here"
```

### 2.3 Verify Secrets

```bash
gh secret list
```

---

## 📝 Step 3: Create an Issue to Test

The workflow triggers on GitHub issues:

### 3.1 Create a Test Issue

Go to your GitHub repository → Issues → New Issue

**Example Issue Title:**
```
Create user authentication module with JWT tokens
```

**Example Issue Body:**
```
## Description
We need a secure user authentication system.

## Acceptance Criteria
- User login endpoint with email/password validation
- JWT token generation and validation
- Refresh token mechanism
- Role-based access control (RBAC)
- Password hashing with bcrypt

## Tech Stack
- Node.js/Express
- JWT
- bcrypt

## Dependencies
- None (new feature)
```

### 3.2 Watch the Workflow Run

1. Go to Actions tab in your repository
2. Workflow runs automatically when issue is created
3. Watch "Auto Code Generation with Azure OpenAI" complete
4. Once done:
   - ✅ A new branch is created
   - ✅ Code is committed
   - ✅ Pull Request is opened
   - ✅ Original issue is closed

---

## 🔄 How the Workflow Works

### Trigger Point
- **Event:** GitHub issue opened, reopened, or edited
- **Automatic:** No manual action needed

### Workflow Steps

```
Issue Created
     ↓
Extract Issue Details (inline workflow script)
     ↓
Call Azure OpenAI GPT-4o (inline workflow script)
     ↓
Write Generated Files (inline workflow script)
     ↓
Create Feature Branch
     ↓
Commit Changes
     ↓
Create Pull Request
     ↓
Comment on PR with AI Summary
     ↓
Close Original Issue
```

---

## 📁 File Structure

```
.github/
├── workflows/
│   └── auto-code-generation.yml    # Main GitHub Actions workflow

main.tf                              # Azure Foundry + OpenAI infrastructure
variables.tf                         # Terraform variables
outputs.tf                           # Exposed values
providers.tf                         # Provider configuration
```

main.tf                              # Azure Foundry + OpenAI infrastructure
variables.tf                         # Terraform variables
outputs.tf                          # Exposed values
providers.tf                         # Provider configuration
```

---

## 🔍 Understanding the Code Generation

### What Azure OpenAI Does

The GitHub Actions workflow contains inline Node.js steps that:

1. **Analyze** the GitHub issue title and body
2. **Extract** requirements and acceptance criteria
3. **Detect** the tech stack from the issue
4. **Prompt** GPT-4o to generate code
5. **Return** code in structured JSON format:
   ```json
   {
     "files": [
       {
         "path": "src/auth.js",
         "content": "// Generated code here..."
       }
     ],
     "summary": "Created JWT authentication module",
     "notes": "Uses bcrypt for password hashing"
   }
   ```

6. **Create** files in the repository
7. **Commit** with auto-generated message

---

## 🛡️ Security Best Practices

### 1. Protect Secrets
- ✅ Secrets are never logged in workflow output
- ✅ API keys are masked in logs
- ✅ Never commit `.issue-context.json` or `.generated-code.json`
- ✅ Add these to `.gitignore`:

```bash
# Add to .gitignore
.issue-context.json
.generated-code.json
```

### 2. Code Review
- Always review generated code before merging PR
- Generated code may need adjustments for:
  - Project-specific conventions
  - Security requirements
  - Performance optimizations
  - Business logic edge cases

### 3. Azure OpenAI Security
- Use Azure RBAC for access control
- Monitor API usage and costs
- Set API rate limits
- Store API keys only in GitHub Secrets

---

## 🐛 Troubleshooting

### Issue: Workflow Fails - "Azure OpenAI Error"

**Solution:** Verify secrets are set correctly:
```bash
gh secret list
```

Ensure the endpoint and key match your Azure deployment.

### Issue: Generated Code Files Empty

**Solution:** Check Azure OpenAI response:
1. Ensure "gpt4o-code-gen" deployment exists in Azure
2. Verify API version in `.github/workflows/auto-code-generation.yml` matches Azure
3. Check quota/usage limits in Azure portal

### Issue: PR Not Created

**Solution:**
1. Check workflow logs for errors
2. Verify GitHub Actions permissions
3. Ensure branch push succeeded
4. Check git config in workflow

### Issue: Code Quality Issues

**Solution:**
1. Add code review comments (Azure OpenAI respects feedback)
2. Create a linting step in workflow
3. Add tests after code generation

---

## 🚀 Advanced Usage

### Customize Code Generation Prompt

Edit `.github/workflows/auto-code-generation.yml` and update the embedded prompt text in the Generate Code step.

```javascript
const systemPrompt = `You are an expert code generation AI...`
const userPrompt = `Please analyze the following GitHub issue...`
```

### Add Linting/Testing

Add step to `.github/workflows/auto-code-generation.yml`:

```yaml
- name: Run ESLint
  run: npm run lint

- name: Run Tests
  run: npm test
```

### Specify Code Generation Model

The system uses `gpt-4o-2024-08-06`. To use a different model:

1. Deploy new model in Azure OpenAI
2. Update Terraform: `model_version = "new-version"`
3. Update workflow: `GPT4O_DEPLOYMENT = "your-deployment"`

---

## 📊 Cost Considerations

### Estimate Azure Costs

- **Azure OpenAI:** ~$0.03-0.06 per 1K tokens (GPT-4o)
- **Azure Foundry:** ~$0 (free tier)
- **Storage (Key Vault, etc.):** Minimal

### Monitor Usage

```bash
# View Azure costs
az costmanagement query create \
  --subscription "your-subscription-id" \
  --definition "{...}"
```

---

## ✅ Verification Checklist

- [ ] Terraform deployment successful
- [ ] Azure resources created (check Azure Portal)
- [ ] GitHub Secrets configured (AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY)
- [ ] `.github/workflows/auto-code-generation.yml` exists
- [ ] Test issue created and workflow runs successfully
- [ ] PR generated with code
- [ ] Original issue closed automatically

---

## 📞 Support & Documentation

- **Azure OpenAI Docs:** https://learn.microsoft.com/en-us/azure/ai-services/openai/
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Terraform Docs:** https://registry.terraform.io/providers/hashicorp/azurerm/latest

---

## 🎯 Next Steps

1. ✅ Deploy infrastructure with Terraform
2. ✅ Configure GitHub Secrets
3. ✅ Create test issue
4. ✅ Verify workflow execution
5. ✅ Review generated code
6. ✅ Merge PR to main branch
7. ✅ Celebrate! 🎉

---

**Last Updated:** 2024
**Status:** Production Ready
