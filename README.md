# Github_Azure_foundry

GitHub issue-to-code automation using Azure OpenAI and GitHub Actions.

## 🚀 Key Features

- **Automated Code Generation:** GitHub issues trigger Azure OpenAI to generate code automatically
- **Full GitHub Integration:** Auto-creates branches, commits, PRs, and closes issues
- **Enterprise Ready:** Secure, scalable, production-grade automation
- **AI-Powered Development:** Uses GPT-4o for intelligent code understanding and generation

## 📚 Documentation

### For Getting Started
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and deployment guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Daily usage guide

## 📁 Project Structure

```
.github/
└── workflows/
    └── auto-code-generation.yml    # Main GitHub Actions workflow

scripts/
├── extract-issue.js                 # Parse GitHub issues
├── generate-code.js                 # Call Azure OpenAI
└── write-generated-files.js         # Write generated code to repo

main.tf                              # Azure infrastructure
variables.tf                         # Terraform variables
outputs.tf                          # Terraform outputs
providers.tf                        # Azure provider config
package.json                        # Node.js dependencies
```

## 🚀 Quick Start

### 1. Deploy Azure Infrastructure
```bash
terraform init
terraform plan
terraform apply
```

### 2. Configure GitHub Secrets
Go to your repository: **Settings → Secrets and variables → Actions**

Add secrets from Terraform output:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_KEY`

### 3. Test the System
Create a GitHub issue in your repository, and the automation runs automatically!

## 📖 How It Works

```
Manager Creates Issue
         ↓
GitHub Actions Triggered
         ↓
Azure OpenAI Analyzes Requirements
         ↓
Code Generated Automatically
         ↓
Feature Branch Created
         ↓
Pull Request Raised
         ↓
Issue Auto-Closed
```

## 🔧 Technology Stack

- **Cloud:** Microsoft Azure
- **IaC:** Terraform
- **Automation:** GitHub Actions
- **AI/ML:** Azure OpenAI (GPT-4o)
- **Runtime:** Node.js 18+

## 📋 Project Status

- ✅ Azure Foundry Infrastructure
- ✅ Azure OpenAI Integration
- ✅ GitHub Actions Workflow
- ✅ Automated Code Generation
- ✅ PR Auto-Creation
- ✅ Issue Auto-Closing
- ✅ Production Ready

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for usage
3. Review GitHub Actions logs in Actions tab
4. Verify Azure resources in Azure Portal

---

**Version:** 1.0.0  
**Status:** Production Ready
