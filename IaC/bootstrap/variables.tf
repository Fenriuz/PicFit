variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = "terraform-personal-test"
}

variable "environment" {
  description = "Environment"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Invalid environment. Must be either 'dev' or 'prod'."
  }
}

variable "tags" {
  description = "Tags to be applied to resources"
  type        = map(string)
  default = {
    Owner   = "Alex"
    Purpose = "PicFit"
  }
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}
