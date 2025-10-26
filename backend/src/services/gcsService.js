import { bucket } from '../config/gcs.js';
import { v4 as uuidv4 } from 'uuid';

class GCSService {
  constructor() {
    this.bucket = bucket;
  }

  /**
   * Upload a 3D model file to GCS
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File MIME type
   * @returns {Promise<{url: string, filename: string}>}
   */
  async uploadModel(fileBuffer, originalName, mimeType) {
    try {
      // Generate unique filename
      const fileExtension = originalName.split('.').pop();
      const filename = `models/${uuidv4()}.${fileExtension}`;
      
      // Create file reference
      const file = this.bucket.file(filename);
      
      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
        },
        public: true, // Make file publicly accessible
      });

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
      
      return {
        url: publicUrl,
        filename: filename
      };
    } catch (error) {
      console.error('Error uploading model to GCS:', error);
      throw new Error(`Failed to upload model: ${error.message}`);
    }
  }

  /**
   * Upload an image file to GCS
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File MIME type
   * @returns {Promise<{url: string, filename: string}>}
   */
  async uploadImage(fileBuffer, originalName, mimeType) {
    try {
      // Generate unique filename
      const fileExtension = originalName.split('.').pop();
      const filename = `images/${uuidv4()}.${fileExtension}`;
      
      // Create file reference
      const file = this.bucket.file(filename);
      
      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
        },
        public: true, // Make file publicly accessible
      });

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
      
      return {
        url: publicUrl,
        filename: filename
      };
    } catch (error) {
      console.error('Error uploading image to GCS:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Delete a file from GCS
   * @param {string} filename - File path in bucket
   * @returns {Promise<boolean>}
   */
  async deleteFile(filename) {
    try {
      const file = this.bucket.file(filename);
      await file.delete();
      console.log(`File ${filename} deleted from GCS`);
      return true;
    } catch (error) {
      console.error('Error deleting file from GCS:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Check if a file exists in GCS
   * @param {string} filename - File path in bucket
   * @returns {Promise<boolean>}
   */
  async fileExists(filename) {
    try {
      const file = this.bucket.file(filename);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  /**
   * Validate file for 3D model upload
   * @param {Object} file - Multer file object
   * @returns {boolean}
   */
  validateModelFile(file) {
    const allowedMimeTypes = ['model/gltf-binary', 'model/gltf+json'];
    const allowedExtensions = ['.glb', '.gltf'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    // Check file size
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }

    // Check file extension
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      throw new Error('Invalid file format. Only GLB and GLTF files are allowed');
    }

    return true;
  }

  /**
   * Validate file for image upload
   * @param {Object} file - Multer file object
   * @returns {boolean}
   */
  validateImageFile(file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Check file size
    if (file.size > maxSize) {
      throw new Error('Image size exceeds 10MB limit');
    }

    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid image format. Only JPEG, PNG, and WebP are allowed');
    }

    return true;
  }
}

export default new GCSService();