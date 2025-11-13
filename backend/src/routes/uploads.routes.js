import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { uploadImage, uploadModel } from '../utils/uploader.js';
import gcsService from '../services/gcsService.js';

const router = Router();

// Upload image to GCS
router.post('/image', verifyToken, requireRole('admin'), uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate image file
    gcsService.validateImageFile(req.file);

    // Upload to GCS
    const result = await gcsService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      imageUrl: result.url,
      filename: result.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upload image' 
    });
  }
});

// Upload 3D model to GCS
router.post('/model', verifyToken, requireRole('admin'), uploadModel.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No 3D model file provided' });
    }

    // Validate 3D model file
    gcsService.validateModelFile(req.file);

    // Upload to GCS
    const result = await gcsService.uploadModel(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      modelUrl: result.url,
      filename: result.filename,
      message: '3D model uploaded successfully'
    });
  } catch (error) {
    console.error('3D model upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upload 3D model' 
    });
  }
});

// Delete file from GCS
router.delete('/file/:filename(*)', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const filename = req.params.filename;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    await gcsService.deleteFile(filename);
    
    res.json({ 
      message: 'File deleted successfully',
      filename: filename
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete file' 
    });
  }
});

export default router;
