import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the GCS bucket first
const mockFile = {
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn()
};

const mockBucket = {
  file: vi.fn(() => mockFile),
  name: 'histori_ar'
};

// Mock the GCS service bucket
vi.mock('../../src/config/gcs.js', () => ({
  bucket: mockBucket
}));

// Import after mocking
const { default: gcsService } = await import('../../src/services/gcsService.js');

describe('GCSService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateModelFile', () => {
    it('should validate GLB files correctly', () => {
      const mockFile = {
        originalname: 'model.glb',
        size: 10 * 1024 * 1024, // 10MB
        mimetype: 'model/gltf-binary'
      };

      expect(() => gcsService.validateModelFile(mockFile)).not.toThrow();
    });

    it('should validate GLTF files correctly', () => {
      const mockFile = {
        originalname: 'model.gltf',
        size: 10 * 1024 * 1024, // 10MB
        mimetype: 'model/gltf+json'
      };

      expect(() => gcsService.validateModelFile(mockFile)).not.toThrow();
    });

    it('should reject files exceeding 50MB limit', () => {
      const mockFile = {
        originalname: 'model.glb',
        size: 60 * 1024 * 1024, // 60MB
        mimetype: 'model/gltf-binary'
      };

      expect(() => gcsService.validateModelFile(mockFile))
        .toThrow('File size exceeds 50MB limit');
    });

    it('should reject invalid file formats', () => {
      const mockFile = {
        originalname: 'model.obj',
        size: 10 * 1024 * 1024,
        mimetype: 'application/octet-stream'
      };

      expect(() => gcsService.validateModelFile(mockFile))
        .toThrow('Invalid file format. Only GLB and GLTF files are allowed');
    });
  });

  describe('validateImageFile', () => {
    it('should validate JPEG files correctly', () => {
      const mockFile = {
        originalname: 'image.jpg',
        size: 5 * 1024 * 1024, // 5MB
        mimetype: 'image/jpeg'
      };

      expect(() => gcsService.validateImageFile(mockFile)).not.toThrow();
    });

    it('should validate PNG files correctly', () => {
      const mockFile = {
        originalname: 'image.png',
        size: 5 * 1024 * 1024, // 5MB
        mimetype: 'image/png'
      };

      expect(() => gcsService.validateImageFile(mockFile)).not.toThrow();
    });

    it('should validate WebP files correctly', () => {
      const mockFile = {
        originalname: 'image.webp',
        size: 5 * 1024 * 1024, // 5MB
        mimetype: 'image/webp'
      };

      expect(() => gcsService.validateImageFile(mockFile)).not.toThrow();
    });

    it('should reject images exceeding 10MB limit', () => {
      const mockFile = {
        originalname: 'image.jpg',
        size: 15 * 1024 * 1024, // 15MB
        mimetype: 'image/jpeg'
      };

      expect(() => gcsService.validateImageFile(mockFile))
        .toThrow('Image size exceeds 10MB limit');
    });

    it('should reject invalid image formats', () => {
      const mockFile = {
        originalname: 'image.gif',
        size: 5 * 1024 * 1024,
        mimetype: 'image/gif'
      };

      expect(() => gcsService.validateImageFile(mockFile))
        .toThrow('Invalid image format. Only JPEG, PNG, and WebP are allowed');
    });
  });

  describe('uploadModel', () => {
    it('should upload model successfully and return URL', async () => {
      const fileBuffer = Buffer.from('mock file content');
      const originalName = 'test-model.glb';
      const mimeType = 'model/gltf-binary';

      mockFile.save.mockResolvedValue();

      const result = await gcsService.uploadModel(fileBuffer, originalName, mimeType);

      expect(mockBucket.file).toHaveBeenCalledWith(expect.stringMatching(/^models\/.*\.glb$/));
      expect(mockFile.save).toHaveBeenCalledWith(fileBuffer, {
        metadata: { contentType: mimeType }
      });
      expect(result.url).toMatch(/^https:\/\/storage\.googleapis\.com\/histori_ar\/models\/.*\.glb$/);
      expect(result.filename).toMatch(/^models\/.*\.glb$/);
    });

    it('should handle upload errors', async () => {
      const fileBuffer = Buffer.from('mock file content');
      const originalName = 'test-model.glb';
      const mimeType = 'model/gltf-binary';

      mockFile.save.mockRejectedValue(new Error('Upload failed'));

      await expect(gcsService.uploadModel(fileBuffer, originalName, mimeType))
        .rejects.toThrow('Failed to upload model: Upload failed');
    });
  });

  describe('uploadImage', () => {
    it('should upload image successfully and return URL', async () => {
      const fileBuffer = Buffer.from('mock image content');
      const originalName = 'test-image.jpg';
      const mimeType = 'image/jpeg';

      mockFile.save.mockResolvedValue();

      const result = await gcsService.uploadImage(fileBuffer, originalName, mimeType);

      expect(mockBucket.file).toHaveBeenCalledWith(expect.stringMatching(/^images\/.*\.jpg$/));
      expect(mockFile.save).toHaveBeenCalledWith(fileBuffer, {
        metadata: { contentType: mimeType }
      });
      expect(result.url).toMatch(/^https:\/\/storage\.googleapis\.com\/histori_ar\/images\/.*\.jpg$/);
      expect(result.filename).toMatch(/^images\/.*\.jpg$/);
    });

    it('should handle upload errors', async () => {
      const fileBuffer = Buffer.from('mock image content');
      const originalName = 'test-image.jpg';
      const mimeType = 'image/jpeg';

      mockFile.save.mockRejectedValue(new Error('Upload failed'));

      await expect(gcsService.uploadImage(fileBuffer, originalName, mimeType))
        .rejects.toThrow('Failed to upload image: Upload failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const filename = 'models/test-model.glb';
      mockFile.delete.mockResolvedValue();

      const result = await gcsService.deleteFile(filename);

      expect(mockBucket.file).toHaveBeenCalledWith(filename);
      expect(mockFile.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle deletion errors', async () => {
      const filename = 'models/test-model.glb';
      mockFile.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(gcsService.deleteFile(filename))
        .rejects.toThrow('Failed to delete file: Delete failed');
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      const filename = 'models/test-model.glb';
      mockFile.exists.mockResolvedValue([true]);

      const result = await gcsService.fileExists(filename);

      expect(mockBucket.file).toHaveBeenCalledWith(filename);
      expect(mockFile.exists).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const filename = 'models/test-model.glb';
      mockFile.exists.mockResolvedValue([false]);

      const result = await gcsService.fileExists(filename);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      const filename = 'models/test-model.glb';
      mockFile.exists.mockRejectedValue(new Error('Check failed'));

      const result = await gcsService.fileExists(filename);

      expect(result).toBe(false);
    });
  });
});