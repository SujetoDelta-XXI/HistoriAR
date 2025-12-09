# AWS S3 Configuration Guide

This guide explains how to configure AWS S3 for the HistoriAR backend application.

## Prerequisites

- AWS Account
- AWS CLI installed (optional but recommended)
- Basic understanding of AWS IAM and S3

## Step 1: Create S3 Bucket

### Using AWS Console

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Configure bucket:
   - **Bucket name**: `historiar-storage` (must be globally unique)
   - **AWS Region**: Choose your preferred region (e.g., `us-east-1`, `us-east-2`)
   - **Object Ownership**: ACLs enabled
   - **Block Public Access**: Uncheck "Block all public access" (we need public read access)
   - **Bucket Versioning**: Optional (recommended for production)
   - **Tags**: Optional
4. Click "Create bucket"

### Using AWS CLI

```bash
# Create bucket
aws s3 mb s3://historiar-storage --region us-east-1

# Enable public access
aws s3api put-public-access-block \
  --bucket historiar-storage \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

## Step 2: Configure Bucket Policy

Add a bucket policy to allow public read access to objects:

### Using AWS Console

1. Go to your bucket → Permissions → Bucket Policy
2. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
```

### Using AWS CLI

```bash
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket historiar-storage \
  --policy file://bucket-policy.json
```

## Step 3: Configure CORS

Configure CORS to allow access from your admin panel and mobile app:

### Using AWS Console

1. Go to your bucket → Permissions → CORS
2. Add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Using AWS CLI

```bash
cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket historiar-storage \
  --cors-configuration file://cors-config.json
```

**Production Note**: Replace `"AllowedOrigins": ["*"]` with your specific domains:
```json
"AllowedOrigins": [
  "https://admin.historiar.com",
  "https://api.historiar.com"
]
```

## Step 4: Create IAM User

Create an IAM user with programmatic access for the application:

### Using AWS Console

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Add users"
3. Configure user:
   - **User name**: `historiar-app`
   - **Access type**: Programmatic access (Access key)
4. Click "Next: Permissions"
5. Choose "Attach existing policies directly"
6. Create a custom policy (see below) or use `AmazonS3FullAccess` (not recommended for production)
7. Click "Next" → "Create user"
8. **Important**: Save the Access Key ID and Secret Access Key (you won't see them again!)

### Using AWS CLI

```bash
# Create user
aws iam create-user --user-name historiar-app

# Create access key
aws iam create-access-key --user-name historiar-app
```

## Step 5: Create IAM Policy

Create a custom IAM policy with minimal required permissions:

### Policy JSON

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::historiar-storage"
    },
    {
      "Sid": "ObjectOperations",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
      ],
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
```

### Using AWS Console

1. Go to IAM → Policies → Create policy
2. Choose JSON tab
3. Paste the policy above
4. Name it: `HistoriAR-S3-Policy`
5. Attach it to the `historiar-app` user

### Using AWS CLI

```bash
cat > s3-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::historiar-storage"
    },
    {
      "Sid": "ObjectOperations",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
      ],
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
EOF

# Create policy
aws iam create-policy \
  --policy-name HistoriAR-S3-Policy \
  --policy-document file://s3-policy.json

# Attach policy to user
aws iam attach-user-policy \
  --user-name historiar-app \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/HistoriAR-S3-Policy
```

## Step 6: Configure Environment Variables

Add these variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
S3_BUCKET=historiar-storage
```

**Security Notes**:
- Never commit `.env` file to version control
- Use different credentials for development and production
- Rotate access keys regularly
- Use AWS Secrets Manager for production

## Step 7: Verify Configuration

Run the verification script:

```bash
npm run verify
```

Expected output:
```
🔍 Verifying environment configuration...

Required Environment Variables:
  ✓ MONGO_URI: ***
  ✓ JWT_SECRET: ***
  ✓ PORT: 4000
  ✓ AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
  ✓ AWS_SECRET_ACCESS_KEY: ***
  ✓ AWS_REGION: us-east-1
  ✓ S3_BUCKET: historiar-storage

☁️  Testing AWS S3:
  ✓ S3 bucket 'historiar-storage' is accessible
  ✓ AWS Region: us-east-1

============================================================
✓ Configuration verification PASSED
============================================================
```

## Folder Structure

The application organizes files in S3 with this structure:

```
historiar-storage/
├── images/
│   ├── {monumentId}/
│   │   ├── {timestamp}_{filename}.jpg
│   │   └── {timestamp}_{filename}.png
│   └── ...
└── models/
    ├── {monumentId}/
    │   ├── {timestamp}_{filename}.glb
    │   └── tiles/
    │       ├── tileset.json
    │       └── ...
    └── ...
```

**Note**: S3 doesn't have real folders, but uses key prefixes to simulate folder structure.

## Security Best Practices

### 1. Principle of Least Privilege
- Only grant necessary permissions
- Use custom IAM policies instead of `AmazonS3FullAccess`
- Separate users for different environments (dev, staging, prod)

### 2. Access Key Management
- Rotate access keys every 90 days
- Never hardcode credentials in code
- Use environment variables or AWS Secrets Manager
- Enable MFA for IAM users

### 3. Bucket Security
- Enable bucket versioning for production
- Enable server access logging
- Use bucket encryption (SSE-S3 or SSE-KMS)
- Regularly audit bucket policies

### 4. Network Security
- Restrict CORS to specific origins in production
- Consider using VPC endpoints for private access
- Enable CloudFront for CDN and additional security

### 5. Monitoring
- Enable CloudTrail for API logging
- Set up CloudWatch alarms for unusual activity
- Monitor S3 access logs

## Troubleshooting

### Error: "S3 bucket does not exist"
- Verify bucket name is correct
- Check that bucket exists in the specified region
- Ensure you're using the correct AWS account

### Error: "AWS credentials are invalid or missing"
- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
- Check that credentials haven't been rotated or deleted
- Ensure no extra spaces in environment variables

### Error: "Insufficient permissions to access S3 bucket"
- Verify IAM policy is attached to the user
- Check that policy allows required actions (PutObject, GetObject, etc.)
- Ensure bucket policy doesn't block access

### Error: "Access Denied" when uploading
- Check that IAM policy includes `s3:PutObject` and `s3:PutObjectAcl`
- Verify bucket policy doesn't conflict with IAM policy
- Ensure ACL is enabled on the bucket

### Error: "Network error connecting to S3"
- Check internet connectivity
- Verify AWS region is correct
- Check firewall/proxy settings

### Files not publicly accessible
- Verify bucket policy allows public read (`s3:GetObject`)
- Check that "Block all public access" is disabled
- Ensure ACL is set to `public-read` when uploading

## Cost Optimization

### Storage Costs
- Use S3 Intelligent-Tiering for automatic cost optimization
- Set up lifecycle policies to move old files to cheaper storage classes
- Delete unused files regularly

### Transfer Costs
- Use CloudFront CDN to reduce data transfer costs
- Enable S3 Transfer Acceleration for faster uploads (if needed)
- Compress files before uploading

### Request Costs
- Batch operations when possible
- Use S3 Select for partial object retrieval
- Cache frequently accessed objects

## Production Checklist

- [ ] Bucket created in correct region
- [ ] Bucket policy configured for public read
- [ ] CORS configured with specific origins
- [ ] IAM user created with minimal permissions
- [ ] Access keys securely stored
- [ ] Environment variables configured
- [ ] Verification script passes
- [ ] Bucket versioning enabled
- [ ] Server access logging enabled
- [ ] CloudTrail logging enabled
- [ ] CloudWatch alarms configured
- [ ] Lifecycle policies configured
- [ ] Backup strategy in place

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

## Support

For issues or questions:
- Check AWS Service Health Dashboard
- Review CloudWatch logs
- Contact AWS Support (if you have a support plan)
- Check application logs: `npm start` output
