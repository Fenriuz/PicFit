# IAM Role for App Runner
resource "aws_iam_role" "app_runner" {
  name = "${local.prefix}-app-runner-role-${var.environment}"

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

# IAM Policy for App Runner to pull images from ECR
resource "aws_iam_role_policy_attachment" "app_runner_policy" {
  role       = aws_iam_role.app_runner.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# App Runner Service
resource "aws_apprunner_service" "service" {
  service_name = "${local.prefix}-service-${var.environment}"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.app_runner.arn
    }

    image_repository {
      image_configuration {
        port = var.container_port
        runtime_environment_variables = {
          ENVIRONMENT = var.environment
          AWS_IMAGES_BUCKET_NAME = aws_s3_bucket.image_bucket.id
          AWS_REGION = var.aws_region
          AWS_ACCESS_KEY_ID = aws_iam_access_key.s3_user_key.id
          AWS_SECRET_ACCESS_KEY = aws_iam_access_key.s3_user_key.secret
          CORS_ALLOWED_ORIGINS = join(",", concat(
            var.cors_allowed_origins,
            [aws_apprunner_service.frontend_service.service_url]
          ))
          CORS_ALLOWED_METHODS = join(",", var.cors_allowed_methods)
        }
      }
      image_identifier      = "${data.aws_ecr_repository.app.repository_url}:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = var.app_runner_cpu
    memory = var.app_runner_memory
  }

  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Name        = "${local.prefix}-service-${var.environment}"
    }
  )
}

# Data source to get ECR repository info
data "aws_ecr_repository" "app" {
  name = "${local.prefix}-${var.environment}/backend"
} 