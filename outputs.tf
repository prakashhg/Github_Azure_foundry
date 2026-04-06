output "foundry_account_id" {
  value = module.foundry.resource_id
}

# NOTE: The module currently does not expose the project or agent endpoint IDs directly.
# To avoid unsupported attribute errors, these outputs are omitted.

output "foundry_key_vault_id" {
  value = try(module.foundry.key_vault_id, null)
}

output "foundry_key_vault_key_id" {
  value = try(module.foundry.key_vault_key_id, null)
}

output "foundry_user_assigned_identity_id" {
  value = try(module.foundry.user_assigned_identity_id, null)
}

# Azure OpenAI Outputs
output "azure_openai_endpoint" {
  description = "Azure OpenAI API endpoint"
  value       = azurerm_cognitive_account.openai.endpoint
}

output "azure_openai_account_id" {
  description = "Azure OpenAI account resource ID"
  value       = azurerm_cognitive_account.openai.id
}

output "azure_openai_key" {
  description = "Azure OpenAI API key"
  value       = azurerm_cognitive_account.openai.primary_access_key
  sensitive   = true
}

output "gpt4o_deployment_name" {
  description = "GPT-4o deployment name"
  value       = azurerm_cognitive_deployment.gpt4o.deployment_id
}