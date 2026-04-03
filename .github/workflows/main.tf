resource "azurerm_resource_group" "rg" {
  name     = "rg-foundry-demo"
  location = "eastus"
}

module "foundry" {
  source  = "Azure/avm-ptn-aiml-ai-foundry/azurerm"
  version = "0.10.1"

  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  name                = "foundrydemo"

  # Use default Foundry managed resources
  use_byor_key_vault = false
  use_byor_storage   = false
  use_byor_cosmosdb  = false
  use_byor_search    = false

  # Enable Foundry Agent default host (no custom containers)
  enable_agent_service = true
}
