# ------------------------------------------------------
# Resource Group (create or existing)
# ------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  count    = var.use_existing_resource_group ? 0 : 1
  name     = "rg-${var.foundry_name}"
  location = var.location
}

data "azurerm_resource_group" "rg" {
  count = var.use_existing_resource_group ? 1 : 0
  name  = var.existing_resource_group_name != "" ? var.existing_resource_group_name : "rg-${var.foundry_name}"
}

locals {
  resource_group_id = var.use_existing_resource_group ? data.azurerm_resource_group.rg[0].id : azurerm_resource_group.rg[0].id
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
  resource_group_resource_id  = local.resource_group_id

  # OPTIONAL — use module schema for this version
  create_byor              = false
  create_private_endpoints = false

  ai_foundry = {
    create_ai_agent_service = true
  }
}