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