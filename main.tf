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

  # OPTIONAL — use module schema for this version
  create_byor              = false
  create_private_endpoints = false

  ai_foundry = {
    create_ai_agent_service = true
  }
}