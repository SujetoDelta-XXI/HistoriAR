import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock the GCS service first
const mockGcsService = {
  validateImageFile: vi.fn(),
  validateModelFile: vi.fn(),
  uploadImage: vi.fn(),
  uploadModel: vi.fn(),
  deleteFile: vi.fn()
};

vi.mock('../../src/services/gcsService.js', () => ({
  default: mockGcsService
}));

// Mock auth middleware
vi.mock('../../src/middlewares/auth.js', () => ({
  verifyToken: (req, res, next) => {
    req.user = { sub: 'test-user-id' };
    next();
  },
  requireRole: (role) => (req, res, next) => next()
}));

// Import after mocking
const { default: uploadsRouter } = await import('../../src/routes/uploads.routes.js');

const app = express();
app.use(express.json());
app.use('/api/uploads', uploadsRouter);

describe('Upload Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/uploads/image', () => {
    it('should upload image successfully', async () => {
      mockGcsService.validateImageFile.mockReturnValue(true);
      mockGcsService.uploadImage.mockResolvedValue({
        url: 'https://storage.googleapis.com/histori_ar/images/test.jpg',
        filename: 'images/test.jpg'
      });

      const response = await request(app)
        .post('/api/uploads/image')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        url: 'https://storage.googleapis.com/histori_ar/images/test.jpg',
        filename: 'images/test.jpg',
        message: 'Image uploaded successfully'
      });
    });

    it('should return 400 when no file is provided', async () => {
      const response = await request(app)
        .post('/api/uploads/image');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No image file provided');
    });

    it('should handle validation errors', async () => {
      // This test will fail at multer level due to file filter, so we expect 500
      const response = await request(app)
        .post('/api/uploads/image')
        .attach('image', Buffer.from('fake image'), 'test.txt');

      expect(response.status).toBe(500);
    });

    it('should handle upload errors', async () => {
      mockGcsService.validateImageFile.mockReturnValue(true);
      mockGcsService.uploadImage.mockRejectedValue(new Error('Upload failed'));

      const response = await request(app)
        .post('/api/uploads/image')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Upload failed');
    });
  });

  describe('POST /api/uploads/model', () => {
    it('should upload 3D model successfully', async () => {
      mockGcsService.validateModelFile.mockReturnValue(true);
      mockGcsService.uploadModel.mockResolvedValue({
        url: 'https://storage.googleapis.com/histori_ar/models/test.glb',
        filename: 'models/test.glb'
      });

      const response = await request(app)
        .post('/api/uploads/model')
        .attach('model3d', Buffer.from('fake model'), 'test.glb');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        url: 'https://storage.googleapis.com/histori_ar/models/test.glb',
        filename: 'models/test.glb',
        message: '3D model uploaded successfully'
      });
    });

    it('should return 400 when no file is provided', async () => {
      const response = await request(app)
        .post('/api/uploads/model');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No 3D model file provided');
    });

    it('should handle validation errors', async () => {
      // This test will fail at multer level due to file filter, so we expect 500
      const response = await request(app)
        .post('/api/uploads/model')
        .attach('model3d', Buffer.from('fake model'), 'test.obj');

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/uploads/file/:filename', () => {
    it('should delete file successfully', async () => {
      mockGcsService.deleteFile.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/uploads/file/models/test.glb');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'File deleted successfully',
        filename: 'models/test.glb'
      });
      expect(mockGcsService.deleteFile).toHaveBeenCalledWith('models/test.glb');
    });

    it('should return 400 when filename is missing', async () => {
      const response = await request(app)
        .delete('/api/uploads/file/');

      expect(response.status).toBe(400); // Route expects filename parameter
    });

    it('should handle deletion errors', async () => {
      mockGcsService.deleteFile.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app)
        .delete('/api/uploads/file/models/test.glb');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Delete failed');
    });
  });
});