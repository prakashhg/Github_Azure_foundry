# GitHub Azure AI Automation - Quick Reference Guide

## 🚀 For Managers/Issue Creators

### Creating Issues for Automated Code Generation

**Good Issue Example:**
```
Title: Create REST API for user management

Description:
We need a user management REST API with CRUD operations.

## Requirements:
- Node.js/Express backend
- PostgreSQL database
- JWT authentication
- Input validation
- Error handling
- Swagger/OpenAPI documentation

## Acceptance Criteria:
- [ ] GET /users - List all users
- [ ] GET /users/:id - Get single user
- [ ] POST /users - Create new user
- [ ] PUT /users/:id - Update user
- [ ] DELETE /users/:id - Delete user
- [ ] Basic authentication required
- [ ] API documented in Swagger

## Tech Stack:
Node.js, Express, PostgreSQL, JWT, Swagger

## Dependencies:
Database schema from issue #123
```

**Poor Issue Example (Won't work well):**
```
Title: Fix stuff

Description: Make the app better. Add some features.
```

---

## 👨‍💼 Automated Workflow Process

### What Happens Automatically

When you create an issue:

1. ✅ **Immediately** - GitHub Actions triggered
2. ✅ **~2 minutes** - Azure OpenAI analyzes requirements
3. ✅ **~3 minutes** - Code generated and committed
4. ✅ **~4 minutes** - Pull Request created
5. ✅ **~5 minutes** - Original issue closed

### Monitoring

- Go to **Actions** tab in your repository
- Click **"Auto Code Generation with Azure OpenAI"**
- View in real-time or check logs later

---

## 🔍 For Code Reviewers

### Reviewing Generated Code

1. Go to the generated Pull Request
2. Review code for:
   - ✅ Correctness of business logic
   - ✅ Adherence to project conventions
   - ✅ Security best practices
   - ✅ Performance considerations
   - ✅ Proper error handling
   - ✅ Code comments and documentation

### Common Review Actions

**Approve & Merge:**
```
Great work! This code is ready.
```

**Request Changes:**
```
Please update:
- Add input validation for user email
- Use const instead of var
- Add error handling for database connection
```

**Comment for Discussion:**
```
I notice this uses a different pattern than our other endpoints.
Should we make it consistent?
```

---

## 🛠️ For Developers/DevOps

### Setup Requirements

```bash
# 1. Install dependencies
npm install

# 2. Deploy infrastructure
cd /path/to/repo
terraform init
terraform apply

# 3. Get credentials
terraform output

# 4. Configure GitHub Secrets
# Go to: Settings → Secrets and variables → Actions
# Add: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY

# 5. Test with a sample issue
# Create a GitHub issue in your repo
```

### Debugging Workflow Issues

**Check Workflow Logs:**
1. Go to Actions → Workflow Name
2. Click failed run
3. Click step that failed
4. View logs

**Common Issues:**

| Error | Solution |
|-------|----------|
| "Secret not found" | Add AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY to GitHub Secrets |
| "Azure OpenAI Error" | Verify API key is correct in Azure Portal |
| "Node.js: command not found" | Verify Node.js setup step in workflow |
| "PR not created" | Check git config and GitHub token permissions |

**View Raw Logs:**
```bash
gh run view <run_id> --log
```

---

## 📊 System Architecture (Simple Version)

```
┌─────────────────┐
│  GitHub Issue   │ (Manager creates)
└────────┬────────┘
         │
         ↓ (Triggers)
┌─────────────────────────────┐
│  GitHub Actions Workflow    │
│  - Extract Issue Details    │
│  - Call Azure OpenAI        │
│  - Write Generated Files    │
│  - Create PR                │
│  - Close Issue              │
└────────┬────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Azure OpenAI (GPT-4o)      │ (Generates code)
└─────────────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  GitHub Pull Request        │ (Ready for review)
│  - Generated code           │
│  - AI summary               │
│  - Links to original issue  │
└─────────────────────────────┘
```

---

## 🔐 Security Checklist

- ✅ Never commit API keys (use GitHub Secrets)
- ✅ Review all generated code before merging
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate API keys regularly
- ✅ Monitor Azure costs
- ✅ Restrict workflow permissions
- ✅ Keep dependencies updated

---

## 📈 Performance Tips

### Faster Code Generation

1. Write **detailed** issue descriptions
2. Include **clear** requirements
3. Specify **tech stack** explicitly
4. List **acceptance criteria**
5. Add **links** to related code/docs

### Better Code Quality

1. Provide **example code** if available
2. Reference **project conventions**
3. Link to **style guide** or **standards**
4. Include **design documents** links
5. Mention **edge cases**

---

## 💵 Monitoring Costs

### Set Budget Alerts

In Azure Portal:
1. Go to Cost Management
2. Set up budget alerts
3. Get notified if costs exceed threshold

### Estimate Monthly Cost

- **~500 small issues:** $50-100/month
- **~1000 medium issues:** $100-200/month
- **~100 large issues:** $100-300/month

---

## 🔗 Quick Links

**Documentation:**
- [Complete Setup Guide](SETUP_GUIDE.md)
- [AI Automation README](AI_AUTOMATION_README.md)
- [Main README](README.md)

**Tools:**
- [Azure Portal](https://portal.azure.com/)
- [GitHub Repository](https://github.com)
- [Terraform Registry](https://registry.terraform.io/)

**External Docs:**
- [Azure OpenAI Docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [GitHub Actions Reference](https://docs.github.com/en/actions/reference)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

---

## ❓ FAQ

**Q: Can I edit or modify generated code?**
A: Yes! The generated PR allows you to make changes before merging.

**Q: What if the generated code is wrong?**
A: Create a comment on the PR with feedback, and request changes. The next iteration can be improved.

**Q: Can I disable the automation for specific issues?**
A: Add label `skip-automation` to the issue to prevent processing.

**Q: How long does code generation take?**
A: Usually 5-10 minutes from issue creation to PR.

**Q: Can I use this for multiple projects?**
A: Yes! Set up separate GitHub workflows for each project/repository.

**Q: What if Azure OpenAI hits its quota?**
A: Add more capacity in Azure Portal or implement rate limiting.

**Q: Can I customize the generated code style?**
A: Yes, modify the system prompt in `scripts/generate-code.js`.

---

## 📞 Support Escalation

**Issue:** Workflow not triggering
1. Check issue was created after workflow file exists
2. Verify Actions tab shows workflow runs
3. Check GitHub Actions is enabled in repository

**Issue:** GitHub Secrets not working
1. Verify secret names: `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_KEY`
2. Check GitHub Secrets in Settings
3. Rebuild workflow by editing and saving

**Issue:** Azure OpenAI errors
1. Verify API key in Azure Portal
2. Check endpoint URL format
3. Ensure GPT-4o deployment exists
4. Check API rate limits

**Issue:** PR not created
1. Check GitHub token has correct permissions
2. Verify git configuration in workflow
3. Check branch name doesn't already exist
4. Review GitHub Actions permissions

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Production Ready
