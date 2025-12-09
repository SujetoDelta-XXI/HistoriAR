# Migration Guide: Google Cloud Storage to AWS S3

This guide provides step-by-step instructions for migrating from Google Cloud Storage (GCS) to AWS S3.

## Overview

**Migration Status**: ✅ Code migration complete, data migration pending

**What's Changed**:
- Storage backend: GCS → AWS S3
- Dependencies: `@google-cloud/storage` → `@aws-sdk/client-s3`
- Configuration: Service account JSON → IAM access keys
- File URLs: `storage.googleapis.com` → `s3.amazonaws.com`

**What's NOT Changed**:
- Database schema (MongoDB)
- API endpoints
- File organization structure
- Admin panel and mobile app (they just use new URLs)

## Prerequisites

Before starting the migration:

- [ ] AWS account with S3 access
- [ ] S3 bucket created and configured (see `S3_SETUP.md`)
- [ ] IAM user with S3 permissions
- [ ] AWS credentials (Access Key ID and Secret Access Key)
- [ ] Backup of MongoDB database
- [ ] Access to GCS bucket (for data migration)

## Phase 1: Code Migration (✅ COMPLETED)

The code has already been migrated from GCS to S3. Here's what was done:

### 1.1 Dependencies Updated
```bash
# Removed
npm uninstall @google-cloud/storage

# Added
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

### 1.2 Configuration Files
- ✅ Created `src/config/s3.js` (replaces `gcs.js`)
- ✅ Created `src/services/s3Service.js` (replaces `gcsService.js`)
- ✅ Updated `src/server.js` to use S3
- ✅ Updated all controllers and routes
- ✅ Updated `scripts/verifyConfig.js`

### 1.3 Environment Variables
- ✅ Updated `.env.example` with AWS variables
- ✅ Removed GCS variables from documentation

### 1.4 Backup Files
Old GCS files were renamed with `.backup` extension:
- `src/config/gcs.js.backup`
- `src/services/gcsService.js.backup`

**Note**: These can be deleted after successful migration and testing.

## Phase 2: Environment Configuration

### 2.1 Update Environment Variables

Edit your `.env` file:

```bash
# Remove these (comment out or delete)
# GCS_PROJECT_ID=...
# GCS_BUCKET_NAME=...
# GCS_CLIENT_EMAIL=...
# GCS_PRIVATE_KEY=...

# Add these
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=historiar-storage
```

### 2.2 Verify Configuration

```bash
npm run verify
```

Expected output:
```
✓ Configuration verification PASSED
✓ S3 bucket 'historiar-storage' is accessible
```

## Phase 3: Testing (CURRENT PHASE)

### 3.1 Start the Server

```bash
npm start
```

Verify you see:
```
✅ MongoDB Atlas conectado
✅ S3 client initialized for region: us-east-2
✅ Successfully connected to S3 bucket: historiar-storage
Running locally on 4000
```

### 3.2 Test File Upload

#### Test Image Upload

```bash
# Create a test image
curl -X POST http://localhost:4000/api/uploads/image \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "monumentId=TEST_MONUMENT_ID"
```

Expected response:
```json
{
  "imageUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/images/TEST_MONUMENT_ID/1234567890_test-image.jpg",
  "filename": "1234567890_test-image.jpg",
  "message": "Image uploaded successfully to S3"
}
```

#### Test Model Upload

```bash
curl -X POST http://localhost:4000/api/uploads/model \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "model=@test-model.glb" \
  -F "monumentId=TEST_MONUMENT_ID"
```

#### Test File Deletion

```bash
curl -X DELETE http://localhost:4000/api/uploads/file \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/images/TEST_MONUMENT_ID/1234567890_test-image.jpg"}'
```

### 3.3 Test from Admin Panel

1. Open admin panel
2. Navigate to Monuments
3. Try uploading an image
4. Try uploading a 3D model
5. Verify files are accessible via returned URLs
6. Try deleting a monument with files

### 3.4 Test from Mobile App

1. Open mobile app
2. View monuments with images
3. View 3D models in AR
4. Verify all files load correctly

## Phase 4: Data Migration (TODO)

**⚠️ IMPORTANT**: This phase migrates existing files from GCS to S3.

### 4.1 Create Migration Script

A migration script needs to be created to:
1. List all files in GCS bucket
2. Download each file
3. Upload to S3 with same structure
4. Update URLs in MongoDB
5. Verify integrity

**Script location**: `backend/scripts/migrateGCStoS3.js` (to be created)

### 4.2 Pre-Migration Checklist

Before running migration:

- [ ] Backup MongoDB database
- [ ] Verify S3 bucket is accessible
- [ ] Verify GCS bucket is accessible
- [ ] Estimate migration time (based on file count and size)
- [ ] Plan for downtime (if needed)
- [ ] Test migration script with a few files first

### 4.3 Run Migration (Dry Run)

```bash
# Test without actually transferring files
npm run migrate:gcs-to-s3 -- --dry-run
```

Review the output to ensure:
- All files are detected
- File paths are correct
- No errors in the process

### 4.4 Run Migration (Production)

```bash
# Actual migration
npm run migrate:gcs-to-s3
```

Monitor the process:
- Watch for errors
- Note any failed files
- Verify progress counter

### 4.5 Verify Migration

After migration completes:

```bash
# Check MongoDB for updated URLs
mongo
use historiar
db.monuments.find({ imageUrl: /storage.googleapis.com/ }).count()  # Should be 0
db.monuments.find({ imageUrl: /s3.amazonaws.com/ }).count()  # Should be > 0
```

Verify random sample of files:
1. Pick 10-20 random monuments
2. Check that images load
3. Check that 3D models load
4. Compare file sizes between GCS and S3

## Phase 5: Production Deployment

### 5.1 Update Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Remove GCS variables:
   - `GCS_PROJECT_ID`
   - `GCS_BUCKET_NAME`
   - `GCS_CLIENT_EMAIL`
   - `GCS_PRIVATE_KEY`
5. Add AWS variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `S3_BUCKET`

### 5.2 Deploy to Production

```bash
# Deploy to Vercel
vercel --prod
```

### 5.3 Verify Production

1. Check deployment logs for errors
2. Test file upload in production
3. Verify existing files are accessible
4. Monitor error logs for 24 hours

## Phase 6: Cleanup

### 6.1 Remove Backup Files

After confirming everything works:

```bash
# Remove GCS backup files
rm backend/src/config/gcs.js.backup
rm backend/src/services/gcsService.js.backup
```

### 6.2 Keep GCS Files (Recommended)

**Recommendation**: Keep GCS files for 30 days as backup

After 30 days, if everything is working:
1. Delete files from GCS bucket
2. Delete GCS bucket (optional)
3. Remove GCS service account (optional)

### 6.3 Update Documentation

- [x] Update README.md
- [x] Create S3_SETUP.md
- [x] Create MIGRATION_GUIDE.md
- [ ] Update API documentation (if needed)

## Rollback Plan

If something goes wrong, you can rollback:

### Rollback Code

```bash
# Restore GCS files
mv backend/src/config/gcs.js.backup backend/src/config/gcs.js
mv backend/src/services/gcsService.js.backup backend/src/services/gcsService.js

# Reinstall GCS dependency
npm install @google-cloud/storage

# Restore environment variables
# (restore .env from backup)

# Restart server
npm start
```

### Rollback Database

If URLs were updated in MongoDB:

```bash
# Restore from backup
mongorestore --uri="YOUR_MONGO_URI" --archive=backup.archive
```

## Troubleshooting

### Server won't start

**Error**: `Missing required AWS environment variables`

**Solution**: Verify all AWS variables are set in `.env`

```bash
npm run verify
```

### Files not uploading

**Error**: `S3 operation failed: Access Denied`

**Solution**: Check IAM permissions

```bash
# Verify IAM policy includes:
# - s3:PutObject
# - s3:PutObjectAcl
```

### Files not publicly accessible

**Error**: 403 Forbidden when accessing file URL

**Solution**: Check bucket policy and ACL

1. Verify bucket policy allows public read
2. Ensure "Block all public access" is disabled
3. Check that files are uploaded with `ACL: 'public-read'`

### Migration script fails

**Error**: Various errors during migration

**Solution**: 
1. Check both GCS and S3 credentials
2. Verify network connectivity
3. Check file permissions
4. Review error logs for specific files
5. Re-run migration (it should skip already migrated files)

## Performance Considerations

### Upload Speed
- S3 uploads may be faster/slower than GCS depending on region
- Consider using S3 Transfer Acceleration for faster uploads
- Use multipart upload for large files (>100MB)

### Download Speed
- Use CloudFront CDN for faster global access
- Enable S3 Transfer Acceleration
- Choose S3 region close to your users

### Costs
- S3 pricing may differ from GCS
- Monitor costs in AWS Cost Explorer
- Set up billing alerts
- Consider S3 Intelligent-Tiering for cost optimization

## Security Checklist

- [ ] AWS credentials stored securely (not in code)
- [ ] IAM user has minimal required permissions
- [ ] Bucket policy allows only necessary access
- [ ] CORS configured with specific origins (production)
- [ ] Access keys rotated regularly
- [ ] CloudTrail logging enabled
- [ ] S3 access logging enabled
- [ ] Bucket versioning enabled (production)
- [ ] Encryption enabled (optional)

## Success Criteria

Migration is successful when:

- [x] Server starts without errors
- [x] S3 connection verified
- [ ] New files can be uploaded
- [ ] Uploaded files are publicly accessible
- [ ] Files can be deleted
- [ ] All existing files migrated to S3
- [ ] All URLs in MongoDB updated
- [ ] Admin panel works correctly
- [ ] Mobile app works correctly
- [ ] Production deployment successful
- [ ] No errors in production logs for 24 hours

## Timeline Estimate

- **Code Migration**: ✅ Complete (2-3 hours)
- **Environment Setup**: ✅ Complete (30 minutes)
- **Testing**: 🔄 In Progress (1-2 hours)
- **Data Migration**: ⏳ Pending (2-4 hours, depends on file count)
- **Production Deployment**: ⏳ Pending (30 minutes)
- **Monitoring**: ⏳ Pending (24 hours)
- **Cleanup**: ⏳ Pending (30 minutes)

**Total Estimated Time**: 7-11 hours (spread over 2-3 days for monitoring)

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `S3_SETUP.md` for configuration help
3. Check AWS CloudWatch logs
4. Review application logs (`npm start` output)
5. Check AWS Service Health Dashboard

## Next Steps

Current status: **Phase 3 - Testing**

Next actions:
1. ✅ Verify server starts successfully
2. 🔄 Test file uploads from admin panel
3. ⏳ Test file access from mobile app
4. ⏳ Create data migration script
5. ⏳ Run data migration
6. ⏳ Deploy to production

---

**Last Updated**: December 7, 2024  
**Migration Status**: Code Complete, Testing in Progress  
**Estimated Completion**: TBD based on testing results
