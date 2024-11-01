variable "environment" {
  description = "Environment name (dev or prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either 'dev' or 'prod'."
  }
}

variable "bucket_name" {
  description = "Base name for the S3 bucket"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = "terraform-personal-test"
}

variable "container_port" {
  description = "Port on which the container will listen"
  type        = number
  default     = 8080  // Adjust default value based on your application needs
}

variable "app_runner_cpu" {
  description = "Amount of CPU units for the App Runner service"
  type        = number
  default     = 1024  // 1 vCPU
}

variable "app_runner_memory" {
  description = "Amount of memory (in MB) for the App Runner service"
  type        = number
  default     = 2048  // 2 GB
}
