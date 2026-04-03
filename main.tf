# ------------------------------------------------------
# Resource Group
# ------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.foundry_name}"
  location = var.location
}

# ------------------------------------------------------
# Azure Verified Module for Foundry
# ------------------------------------------------------
module "foundry" {
  source  = "Azure/avm-ptn-aiml-ai-foundry/azurerm"
  version = "0.10.1"

  # REQUIRED
  base_name                   = var.foundry_name
  location                    = var.location
  resource_group_resource_id  = azurerm_resource_group.rg.id

  # OPTIONAL — using default basic setup (platform managed)
  deploy_ai_search            = false
  deploy_storage_account      = false
  deploy_cosmosdb_account     = false
  deploy_key_vault            = false

  # This creates the default Agent service
  deploy_agent_service        = true
}