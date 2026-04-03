variable "location" {
  type    = string
  default = "eastus"
}

variable "foundry_name" {
  type    = string
  default = "foundry"  # must be 3-7 chars, lowercase alphanumeric/hyphen
}

variable "use_existing_resource_group" {
  type    = bool
  default = false
}

variable "existing_resource_group_name" {
  type    = string
  default = ""
}
