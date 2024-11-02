module "common" {
  source = "../modules/common"
}

locals {
  prefix = module.common.prefix
} 
