import { bucket } from '../config/gcs.js';
import { v4 as uuidv4 } from 'uuid';
import ModelVersion from '../models/ModelVersion.js';
import Monument from '../models/Monument.js';

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
      });

      // File is automatically public due to bucket-level permissions
      // No need to call makePublic() when UBLA is enabled

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
      });

      // File is automatically public due to bucket-level permissions
      // No need to call makePublic() when UBLA is enabled

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
   * Upload modelo 3D con versionado
   * Estructura: models/monuments/{monumentId}/{timestamp}_{filename}
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} monumentId - Monument ID for folder organization
   * @param {string} originalFilename - Original filename from upload
   * @param {string} mimeType - File MIME type
   * @param {string} userId - User ID who uploaded
   * @returns {Promise<{url: string, filename: string, versionId: string}>}
   */
  async uploadModelWithVersioning(fileBuffer, monumentId, originalFilename, mimeType, userId) {
    try {
      // Generate timestamp for version
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Sanitize original filename (keep only alphanumeric, dots, and hyphens)
      const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Create path with structure: models/monuments/{monumentId}/{timestamp}_{filename}
      const filename = `models/monuments/${monumentId}/${timestamp}_${sanitizedFilename}`;

      // Upload file to GCS (folder is created automatically)
      const file = this.bucket.file(filename);
      await file.save(fileBuffer, {
        metadata: { contentType: mimeType }
      });

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;

      // Deactivate previous active version
      await ModelVersion.updateMany(
        { monumentId: monumentId, isActive: true },
        { isActive: false }
      );

      // Create ModelVersion record
      const modelVersion = new ModelVersion({
        monumentId: monumentId,
        filename: filename,
        url: publicUrl,
        uploadedBy: userId,
        isActive: true,
        fileSize: fileBuffer.length
      });

      await modelVersion.save();

      // Update Monument's active model reference
      await Monument.findByIdAndUpdate(monumentId, {
        model3DUrl: publicUrl,
        gcsModelFileName: filename
      });

      return {
        url: publicUrl,
        filename: filename,
        versionId: modelVersion._id
      };
    } catch (error) {
      console.error('Error uploading model with versioning:', error);
      throw new Error(`Failed to upload model: ${error.message}`);
    }
  }

  /**
   * Upload imagen con estructura organizada por monumentId
   * Estructura: 
   * - images/monuments/{monumentId}/{timestamp}_{filename} (imagen principal del monumento)
   * - images/monuments/{monumentId}/fichas/{timestamp}_{filename} (fichas históricas)
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} monumentId - Monument ID for folder organization
   * @param {string} originalFilename - Original filename from upload
   * @param {string} mimeType - File MIME type
   * @param {boolean} isHistoricalData - If true, saves in fichas subfolder
   * @returns {Promise<{url: string, filename: string}>}
   */
  async uploadImageWithVersioning(fileBuffer, monumentId, originalFilename, mimeType, isHistoricalData = false) {
    try {
      // Generate timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Sanitize original filename (keep only alphanumeric, dots, and hyphens)
      const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Create path with structure based on usage
      const basePath = `images/monuments/${monumentId}`;
      const subPath = isHistoricalData ? '/fichas' : '';
      const filename = `${basePath}${subPath}/${timestamp}_${sanitizedFilename}`;

      // Upload file to GCS (folder is created automatically)
      const file = this.bucket.file(filename);
      await file.save(fileBuffer, {
        metadata: { contentType: mimeType }
      });

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;

      return {
        url: publicUrl,
        filename: filename
      };
    } catch (error) {
      console.error('Error uploading image with versioning:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Obtener historial de versiones de un monumento
   * @param {string} monumentId - Monument ID
   * @returns {Promise<Array>}
   */
  async getFileHistory(monumentId) {
    try {
      return await ModelVersion.find({ monumentId })
        .sort({ uploadedAt: -1 })
        .populate('uploadedBy', 'name email');
    } catch (error) {
      console.error('Error getting file history:', error);
      throw new Error(`Failed to get file history: ${error.message}`);
    }
  }

  /**
   * Activate a specific model version
   * @param {string} monumentId - Monument ID
   * @param {string} versionId - Version ID to activate
   * @returns {Promise<Object>}
   */
  async activateVersion(monumentId, versionId) {
    try {
      // Deactivate current active version
      await ModelVersion.updateMany(
        { monumentId, isActive: true },
        { isActive: false }
      );

      // Activate selected version
      const version = await ModelVersion.findByIdAndUpdate(
        versionId,
        { isActive: true },
        { new: true }
      );

      if (!version) {
        throw new Error('Version not found');
      }

      // Update Monument's active model reference
      await Monument.findByIdAndUpdate(monumentId, {
        model3DUrl: version.url,
        gcsModelFileName: version.filename
      });

      return version;
    } catch (error) {
      console.error('Error activating version:', error);
      throw new Error(`Failed to activate version: ${error.message}`);
    }
  }

  /**
   * Delete a model version
   * @param {string} monumentId - Monument ID
   * @param {string} versionId - Version ID to delete
   * @returns {Promise<boolean>}
   */
  async deleteVersion(monumentId, versionId) {
    try {
      const version = await ModelVersion.findOne({ _id: versionId, monumentId });
      
      if (!version) {
        throw new Error('Version not found');
      }

      if (version.isActive) {
        throw new Error('Cannot delete active version. Please activate another version first.');
      }

      // Delete file from GCS
      const file = this.bucket.file(version.filename);
      await file.delete();

      // Delete ModelVersion record
      await ModelVersion.findByIdAndDelete(versionId);

      return true;
    } catch (error) {
      console.error('Error deleting version:', error);
      throw new Error(`Failed to delete version: ${error.message}`);
    }
  }

  /**
   * Generate a V4 signed URL for client direct upload (PUT/write)
   * @param {string} filename - Destination filename in bucket
   * @param {string} contentType - MIME type of the file to be uploaded
   * @param {number} expiresMinutes - Expiration time in minutes
   * @returns {Promise<{url: string, filename: string}>}
   */
  async generateV4UploadSignedUrl(filename, contentType, expiresMinutes = 15) {
    try {
      if (!this.bucket) throw new Error('GCS bucket not initialized');
      const file = this.bucket.file(filename);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiresMinutes * 60 * 1000,
        contentType,
      });

      return { url, filename };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Register a model file that was uploaded directly to GCS by the client.
   * This creates a ModelVersion record and updates the Monument's active model reference.
   * @param {string} filename - Path of the uploaded file in the bucket
   * @param {string} monumentId
   * @param {number} fileSize
   * @param {string} userId
   */
  async registerUploadedModel(filename, monumentId, fileSize, userId) {
    try {
      if (!filename) throw new Error('filename is required');
      if (!monumentId) throw new Error('monumentId is required');

      // Build public URL assuming standard storage.googleapis.com access
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;

      // Deactivate previous active version
      await ModelVersion.updateMany(
        { monumentId: monumentId, isActive: true },
        { isActive: false }
      );

      // Create ModelVersion record
      const modelVersion = new ModelVersion({
        monumentId: monumentId,
        filename: filename,
        url: publicUrl,
        uploadedBy: userId,
        isActive: true,
        fileSize: fileSize || 0
      });

      await modelVersion.save();

      // Update Monument's active model reference
      await Monument.findByIdAndUpdate(monumentId, {
        model3DUrl: publicUrl,
        gcsModelFileName: filename
      });

      return {
        url: publicUrl,
        filename,
        versionId: modelVersion._id
      };
    } catch (error) {
      console.error('Error registering uploaded model:', error);
      throw new Error(`Failed to register uploaded model: ${error.message}`);
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
    const maxSize = 50 * 1024 * 1024; // 50MB (actualizado de 100MB)

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