output "bucket_name" {
  description = "Name of the created S3 bucket"
  value       = aws_s3_bucket.image_bucket.id
}

output "bucket_arn" {
  description = "ARN of the created S3 bucket"
  value       = aws_s3_bucket.image_bucket.arn
}

output "s3_user_name" {
  description = "The name of the IAM user created for S3 operations"
  value       = aws_iam_user.s3_user.name
}

output "s3_user_access_key" {
  description = "The access key for the IAM user"
  value       = aws_iam_access_key.s3_user_key.id
  sensitive   = false
}

output "s3_user_secret_key" {
  description = "The secret key for the IAM user"
  value       = aws_iam_access_key.s3_user_key.secret
  sensitive   = true
} 