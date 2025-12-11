import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { uploadImage, uploadModel } from '../utils/uploader.js';
import * as s3Service from '../services/s3Service.js';

const router = Router();

// Note: Signed URLs for S3 can be implemented later if needed
// For now, we use direct uploads through the backend

// Upload image to S3
router.post('/image', verifyToken, requireRole('admin'), uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { monumentId } = req.body;
    if (!monumentId) {
      return res.status(400).json({ error: 'monumentId is required' });
    }

    // Validate image file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only JPG and PNG images are allowed' });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'Image size must be less than 5MB' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${req.file.originalname}`;

    // Upload to S3
    const imageUrl = await s3Service.uploadImageToS3(
      req.file.buffer,
      filename,
      monumentId,
      req.file.mimetype
    );

    res.json({
      imageUrl,
      filename,
      message: 'Image uploaded successfully to S3'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upload image to S3' 
    });
  }
});

// Upload 3D model to S3
router.post('/model', verifyToken, requireRole('admin'), uploadModel.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No 3D model file provided' });
    }

    const { monumentId } = req.body;
    if (!monumentId) {
      return res.status(400).json({ error: 'monumentId is required' });
    }

    // Validate 3D model file
    const allowedTypes = ['model/gltf-binary', 'application/octet-stream', 'model/gltf+json'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only GLB and GLTF model files are allowed' });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'Model size must be less than 50MB' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${req.file.originalname}`;

    // Upload to S3
    const modelUrl = await s3Service.uploadModelToS3(
      req.file.buffer,
      filename,
      monumentId,
      req.file.mimetype
    );

    res.json({
      modelUrl,
      filename,
      message: '3D model uploaded successfully to S3'
    });
  } catch (error) {
    console.error('3D model upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upload 3D model to S3' 
    });
  }
});

// Delete file from S3 by URL
router.delete('/file', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ error: 'fileUrl is required' });
    }

    await s3Service.deleteFileFromS3(fileUrl);
    
    res.json({ 
      message: 'File deleted successfully from S3',
      fileUrl
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete file from S3' 
    });
  }
});

export default router;
