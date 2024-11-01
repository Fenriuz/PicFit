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
