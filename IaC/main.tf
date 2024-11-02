resource "aws_s3_bucket" "image_bucket" {
  bucket = "${local.prefix}-${var.bucket_name}-${var.environment}"

  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Name        = "${local.prefix}-${var.bucket_name}-${var.environment}"
    }
  )
}

# Enable versioning
# resource "aws_s3_bucket_versioning" "image_bucket_versioning" {
#   bucket = aws_s3_bucket.image_bucket.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# Enable server-side encryption
# resource "aws_s3_bucket_server_side_encryption_configuration" "image_bucket_encryption" {
#   bucket = aws_s3_bucket.image_bucket.id

#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

# Block public access
resource "aws_s3_bucket_public_access_block" "image_bucket_public_access_block" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Create IAM User for S3 operations
resource "aws_iam_user" "s3_user" {
  name = "${local.prefix}-s3-user-${var.environment}"
  path = "/"

  tags = {
    Environment = var.environment
  }
}

# Create access keys for the IAM user
resource "aws_iam_access_key" "s3_user_key" {
  user = aws_iam_user.s3_user.name
}

# Create IAM policy for S3 operations
resource "aws_iam_policy" "s3_access_policy" {
  name        = "${local.prefix}-s3-access-policy-${var.environment}"
  description = "Policy for S3 bucket operations"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.image_bucket.arn,
          "${aws_s3_bucket.image_bucket.arn}/*"
        ]
      }
    ]
  })
}

# Attach the policy to the user
resource "aws_iam_user_policy_attachment" "s3_user_policy_attach" {
  user       = aws_iam_user.s3_user.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
} 