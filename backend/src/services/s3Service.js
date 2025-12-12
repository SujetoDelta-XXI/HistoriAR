import { 
  PutObjectCommand, 
  DeleteObjectCommand, 
  DeleteObjectsCommand, 
  ListObjectsV2Command,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, getBucketName, getRegion } from '../config/s3.js';

// Pre-Signed URL expiration times (in seconds)
const EXPIRATION_TIMES = {
  image: parseInt(process.env.PRESIGNED_URL_EXPIRATION_IMAGES) || 86400,      // 24 hours
  model: parseInt(process.env.PRESIGNED_URL_EXPIRATION_MODELS) || 172800,     // 48 hours
  document: parseInt(process.env.PRESIGNED_URL_EXPIRATION_DOCUMENTS) || 43200, // 12 hours
  default: parseInt(process.env.PRESIGNED_URL_EXPIRATION_DEFAULT) || 86400    // 24 hours
};

/**
 * Construct public S3 URL for a given key
 * @param {string} key - S3 object key
 * @returns {string} Public URL
 */
const getS3Url = (key) => {
  const bucketName = getBucketName();
  const region = getRegion();
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Extract S3 key from URL
 * @param {string} url - S3 URL
 * @returns {string|null} S3 key or null if invalid URL
 */
const extractKeyFromUrl = (url) => {
  const bucketName = getBucketName();
  const region = getRegion();
  const urlPattern = new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`);
  const match = url.match(urlPattern);
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Handle S3 errors and provide clear error messages
 * @param {Error} error - S3 error
 * @throws {Error} Formatted error
 */
const handleS3Error = (error) => {
  console.error('[S3 Error]', error);

  if (error.name === 'NoSuchBucket') {
    throw new Error(`S3 bucket "${getBucketName()}" does not exist`);
  }

  if (error.name === 'InvalidAccessKeyId' || error.name === 'SignatureDoesNotMatch') {
    throw new Error('AWS credentials are invalid or missing');
  }

  if (error.name === 'AccessDenied') {
    throw new Error('Insufficient permissions to access S3 bucket');
  }

  if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    throw new Error('Network error connecting to S3');
  }

  // Generic error
  throw new Error(`S3 operation failed: ${error.message}`);
};

/**
 * Upload image file to S3 (legacy - uses monumentId as folder)
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} monumentId - Monument ID for folder organization
 * @param {string} contentType - MIME type (default: image/jpeg)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadImageToS3 = async (fileBuffer, fileName, monumentId, contentType = 'image/jpeg') => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const key = `images/${monumentId}/${fileName}`;

    console.log(`[S3] Uploading image: ${fileName} to ${key}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    const url = getS3Url(key);
    
    console.log(`[S3] Upload successful: ${url}`);
    return url;
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * Upload monument image to S3 in monuments folder
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type (default: image/jpeg)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadMonumentImageToS3 = async (fileBuffer, fileName, contentType = 'image/jpeg') => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const key = `images/monuments/${fileName}`;

    console.log(`[S3] Uploading monument image: ${fileName} to ${key}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    const url = getS3Url(key);
    
    console.log(`[S3] Upload successful: ${url}`);
    return url;
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * Upload 3D model file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} monumentId - Monument ID for folder organization
 * @param {string} contentType - MIME type (default: model/gltf-binary)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadModelToS3 = async (fileBuffer, fileName, monumentId, contentType = 'model/gltf-binary') => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const key = `models/${monumentId}/${fileName}`;

    console.log(`[S3] Uploading model: ${fileName} to ${key}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    const url = getS3Url(key);
    
    console.log(`[S3] Upload successful: ${url}`);
    return url;
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * Delete file from S3 by URL
 * @param {string} fileUrl - S3 file URL
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (fileUrl) => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const key = extractKeyFromUrl(fileUrl);

    if (!key) {
      throw new Error(`Invalid S3 URL: ${fileUrl}`);
    }

    console.log(`[S3] Deleting file: ${key}`);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`[S3] File deleted successfully: ${key}`);
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * List all files for a monument
 * @param {string} monumentId - Monument ID
 * @returns {Promise<Array<string>>} Array of file keys
 */
export const listMonumentFiles = async (monumentId) => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const prefixes = [`images/${monumentId}/`, `models/${monumentId}/`];
    const allFiles = [];

    for (const prefix of prefixes) {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });

      const response = await s3Client.send(command);
      
      if (response.Contents) {
        allFiles.push(...response.Contents.map(item => item.Key));
      }
    }

    return allFiles;
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * Delete all files associated with a monument
 * @param {string} monumentId - Monument ID
 * @returns {Promise<void>}
 */
export const deleteMonumentFiles = async (monumentId) => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();
    const prefixes = [`images/${monumentId}/`, `models/${monumentId}/`];

    console.log(`[S3] Deleting all files for monument: ${monumentId}`);

    for (const prefix of prefixes) {
      // List all objects with this prefix
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });

      const { Contents } = await s3Client.send(listCommand);

      if (Contents && Contents.length > 0) {
        // Delete all objects in batch
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: Contents.map(({ Key }) => ({ Key })),
            Quiet: false,
          },
        });

        const deleteResponse = await s3Client.send(deleteCommand);
        
        console.log(`[S3] Deleted ${Contents.length} files from ${prefix}`);
        
        if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
          console.error('[S3] Some files failed to delete:', deleteResponse.Errors);
        }
      } else {
        console.log(`[S3] No files found in ${prefix}`);
      }
    }

    console.log(`[S3] All files deleted for monument: ${monumentId}`);
  } catch (error) {
    handleS3Error(error);
  }
};

/**
 * Upload generic file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} key - S3 key (full path)
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadFileToS3 = async (fileBuffer, key, contentType) => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();

    console.log(`[S3] Uploading file to: ${key}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    const url = getS3Url(key);
    
    console.log(`[S3] Upload successful: ${url}`);
    return url;
  } catch (error) {
    handleS3Error(error);
  }
};


/**
 * Generate a pre-signed URL for accessing a private S3 object
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration time in seconds (optional)
 * @returns {Promise<string>} Pre-signed URL
 */
export const generatePresignedUrl = async (key, expiresIn = null) => {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();

    // Determine expiration time based on file type if not provided
    if (!expiresIn) {
      if (key.startsWith('images/')) {
        expiresIn = EXPIRATION_TIMES.image;
      } else if (key.startsWith('models/')) {
        expiresIn = EXPIRATION_TIMES.model;
      } else {
        expiresIn = EXPIRATION_TIMES.default;
      }
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    
    console.log(`[S3] Generated presigned URL for ${key}, expires in ${expiresIn}s`);
    return presignedUrl;
  } catch (error) {
    console.error(`[S3] Error generating presigned URL for ${key}:`, error);
    handleS3Error(error);
  }
};

/**
 * Convert an S3 URL to a pre-signed URL
 * @param {string} s3Url - Original S3 URL
 * @param {number} expiresIn - Expiration time in seconds (optional)
 * @returns {Promise<string|null>} Pre-signed URL or null if invalid URL
 */
export const convertToPresignedUrl = async (s3Url, expiresIn = null) => {
  if (!s3Url || typeof s3Url !== 'string') {
    return null;
  }

  // If it's already a presigned URL, return as is
  if (s3Url.includes('X-Amz-Signature')) {
    return s3Url;
  }

  const key = extractKeyFromUrl(s3Url);
  if (!key) {
    console.warn(`[S3] Could not extract key from URL: ${s3Url}`);
    return s3Url; // Return original URL if we can't parse it
  }

  try {
    return await generatePresignedUrl(key, expiresIn);
  } catch (error) {
    console.error(`[S3] Error converting URL to presigned: ${s3Url}`, error);
    return s3Url; // Return original URL on error
  }
};

/**
 * Convert all S3 URLs in an object to pre-signed URLs
 * @param {Object|Array} data - Object or array containing S3 URLs
 * @param {Array<string>} urlFields - Field names that contain URLs (default: common fields)
 * @returns {Promise<Object|Array>} Data with presigned URLs
 */
export const convertObjectToPresignedUrls = async (data, urlFields = ['imageUrl', 'model3DUrl', 'model3DTilesUrl', 's3ImageFileName', 's3ModelFileName']) => {
  if (!data) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return Promise.all(data.map(item => convertObjectToPresignedUrls(item, urlFields)));
  }

  // Handle plain objects (including Mongoose documents)
  if (typeof data === 'object') {
    // Convert Mongoose document to plain object if needed
    const plainData = data.toObject ? data.toObject() : { ...data };

    // Convert each URL field
    for (const field of urlFields) {
      if (plainData[field] && typeof plainData[field] === 'string') {
        plainData[field] = await convertToPresignedUrl(plainData[field]);
      }
    }

    // Handle nested objects (like monuments array in tours)
    if (plainData.monuments && Array.isArray(plainData.monuments)) {
      plainData.monuments = await Promise.all(
        plainData.monuments.map(async (monument) => {
          if (monument.monumentId && typeof monument.monumentId === 'object') {
            monument.monumentId = await convertObjectToPresignedUrls(monument.monumentId, urlFields);
          }
          return monument;
        })
      );
    }

    return plainData;
  }

  return data;
};

/**
 * Check if a URL is a presigned URL
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is presigned
 */
export const isPresignedUrl = (url) => {
  return url && typeof url === 'string' && url.includes('X-Amz-Signature');
};

/**
 * Get expiration time for a file type
 * @param {string} fileType - File type ('image', 'model', 'document')
 * @returns {number} Expiration time in seconds
 */
export const getExpirationTime = (fileType) => {
  return EXPIRATION_TIMES[fileType] || EXPIRATION_TIMES.default;
};
