variable "location" {
  description = "Deployment region for Azure resources"
  type        = string
  default     = "eastus"
}

variable "foundry_name" {
  description = "Name of the Foundry deployment"
  type        = string
  default     = "foundrydemo"
}
