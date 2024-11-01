# IAM Role for Frontend App Runner
resource "aws_iam_role" "frontend_app_runner" {
  name = "${local.prefix}-frontend-app-runner-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "build.apprunner.amazonaws.com"
      }
    }]
  })
}

# IAM Policy for Frontend App Runner to pull images from ECR
resource "aws_iam_role_policy_attachment" "frontend_app_runner_policy" {
  role       = aws_iam_role.frontend_app_runner.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# Frontend App Runner Service
resource "aws_apprunner_service" "frontend_service" {
  service_name = "${local.prefix}-frontend-service-${var.environment}"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.frontend_app_runner.arn
    }

    image_repository {
      image_configuration {
        port = var.frontend_port
        runtime_environment_variables = {
          REACT_APP_API_URL     = aws_apprunner_service.service.service_url
          REACT_APP_ENVIRONMENT = var.environment
        }
      }
      image_identifier      = "${data.aws_ecr_repository.frontend.repository_url}:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = var.frontend_app_runner_cpu
    memory = var.frontend_app_runner_memory
  }

  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Name        = "${local.prefix}-frontend-service-${var.environment}"
    }
  )
}

# Data source to get frontend ECR repository info
data "aws_ecr_repository" "frontend" {
  name = "${local.prefix}-${var.environment}/frontend"
}

# Output the frontend service URL
output "frontend_service_url" {
  description = "Frontend App Runner Service URL"
  value       = aws_apprunner_service.frontend_service.service_url
} 