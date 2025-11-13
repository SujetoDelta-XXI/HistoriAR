import { Router } from 'express';
import { 
  listMonument, 
  getMonument, 
  createMonumentController, 
  updateMonumentController, 
  deleteMonumentController, 
  searchMonumentsController, 
  getFilterOptionsController,
  getModelVersionsController,
  activateModelVersionController,
  deleteModelVersionController,
  uploadModelVersionController
} from '../controllers/monumentsController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import multer from 'multer';

const router = Router();

// Configure multer for monument file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

router.get('/', listMonument);
router.get('/search', searchMonumentsController);
router.get('/filter-options', getFilterOptionsController);
router.get('/:id', getMonument);

router.post('/',
  verifyToken, requireRole('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model3d', maxCount: 1 }
  ]),
  createMonumentController
);

router.put('/:id',
  verifyToken, requireRole('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model3d', maxCount: 1 }
  ]),
  updateMonumentController
);

router.delete('/:id', verifyToken, requireRole('admin'), deleteMonumentController);

// Model versioning endpoints
router.get('/:id/model-versions', verifyToken, requireRole('admin'), getModelVersionsController);
router.post('/:id/upload-model', verifyToken, requireRole('admin'), upload.single('model'), uploadModelVersionController);
router.post('/:id/model-versions/:versionId/activate', verifyToken, requireRole('admin'), activateModelVersionController);
router.delete('/:id/model-versions/:versionId', verifyToken, requireRole('admin'), deleteModelVersionController);

// Upload endpoints specifically for monuments
router.post('/upload-image', verifyToken, requireRole('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { monumentId } = req.body;
    const gcsService = (await import('../services/gcsService.js')).default;
    
    // Validate image file
    gcsService.validateImageFile(req.file);

    let result;
    
    if (monumentId) {
      // Upload to structured path: images/monuments/{monumentId}/
      result = await gcsService.uploadImageWithVersioning(
        req.file.buffer,
        monumentId,
        req.file.originalname,
        req.file.mimetype,
        false // isHistoricalData = false (imagen principal del monumento)
      );
    } else {
      // Fallback to old method for backward compatibility (creating new monuments)
      result = await gcsService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

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

router.post('/upload-model', verifyToken, requireRole('admin'), upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No 3D model file provided' });
    }

    const gcsService = (await import('../services/gcsService.js')).default;
    
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

export default router;
