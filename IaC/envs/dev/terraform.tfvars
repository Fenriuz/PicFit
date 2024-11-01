environment = "dev"
bucket_name = "storage"
aws_region  = "us-east-1"

container_port    = 8080
app_runner_cpu    = 512
app_runner_memory = 1024

frontend_port            = 80
frontend_app_runner_cpu  = 512
frontend_app_runner_memory = 1024

tags = {
  Environment = "Development"
  Owner       = "Alex"
  Purpose     = "PicFit Development"
}

cors_allowed_origins = [
  "http://localhost:3000",
  "http://localhost:19006",
  "exp://localhost:19000",
  "exp://192.168.1.*:19000"
]
