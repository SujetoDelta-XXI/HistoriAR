import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Cloud Storage
let storage, bucket;

try {
  // Create credentials object from environment variables
  const credentials = {
    type: 'service_account',
    project_id: process.env.GCS_PROJECT_ID,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
    client_email: process.env.GCS_CLIENT_EMAIL,
  };

  storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: credentials,
  });

  // Get bucket instance
  bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
} catch (error) {
  console.error('Failed to initialize GCS client:', error.message);
  // Create dummy objects to prevent crashes
  storage = null;
  bucket = null;
}

/**
 * Verify GCS connection and bucket access
 */
export const verifyGCSConnection = async () => {
  if (!storage || !bucket) {
    throw new Error('GCS client not initialized - check service account credentials');
  }

  try {
    // Check if bucket exists and is accessible
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Bucket ${process.env.GCS_BUCKET_NAME} does not exist`);
    }

    // Test bucket access by listing files (limited to 1)
    const [files] = await bucket.getFiles({ maxResults: 1 });
    
    console.log(`✅ GCS connection verified. Bucket: ${process.env.GCS_BUCKET_NAME}`);
    return true;
  } catch (error) {
    console.error('❌ GCS connection failed:', error.message);
    throw error;
  }
};

/**
 * Create folder structure in GCS bucket
 */
export const createFolderStructure = async () => {
  if (!storage || !bucket) {
    throw new Error('GCS client not initialized - check service account credentials');
  }

  try {
    // Create models/ folder by uploading a placeholder file
    const modelsPlaceholder = bucket.file('models/.gitkeep');
    await modelsPlaceholder.save('', {
      metadata: {
        contentType: 'text/plain',
      },
    });

    // Create images/ folder by uploading a placeholder file
    const imagesPlaceholder = bucket.file('images/.gitkeep');
    await imagesPlaceholder.save('', {
      metadata: {
        contentType: 'text/plain',
      },
    });

    console.log('✅ GCS folder structure created: models/, images/');
    return true;
  } catch (error) {
    console.error('❌ Failed to create folder structure:', error.message);
    throw error;
  }
};

export { storage, bucket };