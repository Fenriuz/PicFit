environment = "prod"
bucket_name = "storage"
aws_region  = "us-east-1"

tags = {
  Environment = "Production"
  Owner       = "Alex"
  Purpose     = "PicFit Production"
  Backup      = "Required"
}

container_port    = 8080
app_runner_cpu    = 1024
app_runner_memory = 2048

frontend_port            = 80
frontend_app_runner_cpu  = 1024
frontend_app_runner_memory = 2048

cors_allowed_origins = [
  "https://*.picfit.app",
  "picfit://*"
]
