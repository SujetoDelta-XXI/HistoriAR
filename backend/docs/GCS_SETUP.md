# Google Cloud Storage Setup Guide

This guide explains how to set up Google Cloud Storage for the HistoriAR backend.

## Prerequisites

- Google Cloud Platform account
- Project: `gen-lang-client-0583857862`
- Bucket: `histori_ar`

## Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project `gen-lang-client-0583857862`
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in the details:
   - **Name**: `historiar-storage`
   - **Description**: `Service account for HistoriAR file storage`
6. Click **Create and Continue**

## Step 2: Grant Permissions

1. In the service account permissions step, add these roles:
   - **Storage Admin** (for full bucket access)
   - **Storage Object Admin** (for file operations)
2. Click **Continue** and then **Done**

## Step 3: Generate JSON Key

1. Find your newly created service account in the list
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** > **Create new key**
5. Select **JSON** format
6. Click **Create** - the key file will download automatically

## Step 4: Configure Backend

1. Open the downloaded JSON key file and extract the following values:
   - `private_key` (the entire RSA private key including BEGIN/END lines)
   - `client_email` (the service account email)

2. Update your `.env` file with the actual values:
   ```env
   GCS_PROJECT_ID=gen-lang-client-0583857862
   GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   GCS_CLIENT_EMAIL=your-actual-service-account@gen-lang-client-0583857862.iam.gserviceaccount.com
   GCS_BUCKET_NAME=histori_ar
   ```

   **Important**: Keep the quotes around the private key and preserve the `\n` characters for line breaks.

## Step 5: Verify Setup

Run the setup script to verify everything is configured correctly:

```bash
cd backend
npm run setup:gcs
```

This script will:
- ✅ Check environment variables
- ✅ Validate service account file
- ✅ Test GCS connection
- ✅ Create folder structure (models/, images/)

## Step 6: Test the Setup

Start the development server:

```bash
npm run dev
```

Test the health endpoint:

```bash
curl http://localhost:4000/api/health/gcs
```

Expected response:
```json
{
  "status": "OK",
  "message": "GCS connection verified",
  "bucket": "histori_ar",
  "project": "gen-lang-client-0583857862"
}
```

## Folder Structure

The setup creates the following structure in the GCS bucket:

```
histori_ar/
├── models/          # 3D model files (.glb, .gltf)
│   └── .gitkeep
└── images/          # Monument images
    └── .gitkeep
```

## File Upload Limits

- **3D Models**: Maximum 50MB, formats: GLB, GLTF
- **Images**: Maximum 10MB, formats: JPEG, PNG, WebP

## Public URLs

Files uploaded to GCS will be publicly accessible via URLs in this format:
```
https://storage.googleapis.com/histori_ar/models/{filename}
https://storage.googleapis.com/histori_ar/images/{filename}
```

## Troubleshooting

### Authentication Error
- Verify the `GCS_PRIVATE_KEY` is correctly formatted with proper line breaks
- Check that `GCS_CLIENT_EMAIL` matches the service account email
- Ensure the service account has the required permissions
- Make sure there are no extra spaces or characters in the environment variables

### Bucket Access Error
- Verify the bucket name is correct: `histori_ar`
- Check that the service account has Storage Admin permissions
- Ensure the bucket exists in the specified project

### Network Issues
- Check internet connectivity
- Verify firewall settings allow HTTPS traffic to googleapis.com

## Security Notes

- Keep the `.env` file secure and never commit it to version control
- The service account has admin access to the storage bucket
- Files are uploaded with public read access for web/mobile app consumption
- Consider implementing additional access controls for production use
- The private key in `.env` should be treated as highly sensitive information