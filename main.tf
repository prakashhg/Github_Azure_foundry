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

# ------------------------------------------------------
# Azure OpenAI Service
# ------------------------------------------------------
resource "azurerm_cognitive_account" "openai" {
  name                = lower("openai-${var.foundry_name}-${data.azurerm_client_config.current.subscription_id}")
  location            = var.location
  resource_group_name = local.rg_name
  kind                = "OpenAI"
  sku_name            = "S0"

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = "production"
    purpose     = "ai-code-generation"
  }
}

# Azure OpenAI GPT-4o Deployment for Code Generation
resource "azurerm_cognitive_deployment" "gpt4o" {
  name                   = "gpt4o-code-gen"
  cognitive_account_id   = azurerm_cognitive_account.openai.id
  model_name             = "gpt-4o"
  model_version          = "2024-08-06"
  deployment_id          = "gpt4o-code-gen"
  sku_name               = "Standard"
  sku_capacity           = 1

  rai_policy_name = "Microsoft.Default"
}

# Get current Azure context
data "azurerm_client_config" "current" {}

# Store resource group name for reference
locals {
  rg_name = var.use_existing_resource_group ? data.azurerm_resource_group.rg[0].name : azurerm_resource_group.rg[0].name
}