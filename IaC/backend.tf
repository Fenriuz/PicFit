terraform {
  backend "s3" {
    bucket         = "sw-picfit-terraform-state"
    key            = "image-storage/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    profile        = "terraform-personal-test"
    dynamodb_table = "terraform-state-lock"
  }
} 