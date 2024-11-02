# S3 Bucket Infrastructure

This Terraform configuration manages S3 buckets for image storage across development and production environments. The infrastructure includes secure S3 buckets, IAM users, and necessary access policies.

## Architecture Overview

The infrastructure consists of:
- S3 buckets for image storage (one per environment)
- IAM user with restricted permissions
- S3 bucket for Terraform state management
- Security configurations including encryption and public access blocking

## Prerequisites

- AWS CLI installed and configured
- Terraform >= 1.0.0
- AWS account with appropriate permissions
- AWS profile configured (`terraform-personal-test` by default)

## Initial Setup

Before deploying the main infrastructure, you need to create the state bucket:

1. Navigate to the bootstrap directory:
   ```bash
   cd bootstrap
   ```

2. Initialize and apply the bootstrap configuration:
   ```bash
   terraform init
   terraform apply
   ```

This creates a state bucket with the following configurations:
- Bucket name: `sw-picfit-terraform-state`
- Server-side encryption enabled (AES256)
- Public access blocked
- Lifecycle policy preventing accidental deletion

## Project Structure

```
IaC/
├── bootstrap/           # State bucket configuration
├── envs/               # Environment-specific configurations
│   ├── dev/           
│   └── prod/          
├── main.tf             # Main infrastructure configuration
├── variables.tf        # Variable definitions
├── outputs.tf          # Output definitions
├── providers.tf        # AWS provider configuration
├── backend.tf          # Terraform backend configuration
└── versions.tf         # Version constraints
```

## Main Infrastructure Components

### S3 Bucket Configuration
The main S3 bucket for image storage includes:
- Environment-based naming (`sw-picfit-images-{bucket_name}-{environment}`)
- Public access blocking
- Optional versioning (currently commented out)
- Optional server-side encryption (currently commented out)

### IAM Configuration
An IAM user is created with:
- Environment-specific naming
- Access keys for authentication
- Restricted permissions to perform only necessary S3 operations:
  - PutObject
  - GetObject
  - DeleteObject
  - ListBucket

## Variables

### Required Variables
- `environment`: Must be either "dev" or "prod"
- `bucket_name`: Base name for the S3 bucket

### Optional Variables
- `aws_region`: AWS region (default: "us-east-1")
- `aws_profile`: AWS profile name (default: "terraform-personal-test")
- `tags`: Additional tags to apply to resources

## Deployment

### Deploy bootstrap
Following recommended practices for AWS and Terraform, the bootstrap configuration creates a state bucket with encryption, versioning, and lifecycle policies.

1. Navigate to the bootstrap directory:
   ```bash
   cd bootstrap
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Plan the changes:
   ```bash
   terraform plan
   ```

4. Apply the changes:
   ```bash
   terraform apply
   ```

### Deploy dev environment
1. Navigate to IaC directory:
   ```bash
   cd IaC
   ```

2. Plan the changes:
   ```bash
   terraform plan -var="environment=dev" -var="bucket_name=your-bucket-name"
   ```

3. Apply the changes:
   ```bash
   terraform apply -var="environment=dev" -var="bucket_name=your-bucket-name"
   ```

## Outputs

After successful deployment, you'll receive:
- `bucket_name`: The name of the created S3 bucket
- `bucket_arn`: The ARN of the created S3 bucket
- `s3_user_name`: The name of the created IAM user
- `s3_user_access_key`: Access key for the IAM user
- `s3_user_secret_key`: Secret key for the IAM user (marked as sensitive)

## Security Considerations

1. All S3 buckets have public access blocked by default
2. IAM user permissions follow the principle of least privilege
3. Terraform state is stored in an encrypted S3 bucket
4. Access keys are generated automatically but should be rotated regularly

## Cost Considerations

The infrastructure includes:
- S3 bucket storage costs
- S3 operation costs
- No additional costs for IAM users or policies

## Maintenance

1. Regularly update the AWS provider and Terraform versions
2. Rotate IAM user access keys periodically
3. Monitor S3 bucket usage and costs
4. Review and update security configurations as needed

## Contributing

1. Create a new branch for your changes
2. Test changes in the dev environment first
3. Submit a pull request with detailed description of changes
4. Ensure all security configurations remain intact

## Troubleshooting

Common issues and solutions:
1. Access Denied: Verify AWS profile permissions
2. State Lock: Check for stuck state locks in S3
3. Bucket Names: Ensure globally unique bucket names