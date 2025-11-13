import { Router } from 'express';
import { listInstitution, getInstitution, createInstitutionController, updateInstitutionController, deleteInstitutionController } from '../controllers/institutionsController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload endpoint for institution images - MUST be before /:id route
router.post('/upload-image', verifyToken, requireRole('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { monumentId } = req.body; // monumentId es el institutionId en este caso
    if (!monumentId) {
      return res.status(400).json({ error: 'Institution ID is required' });
    }

    const gcsService = (await import('../services/gcsService.js')).default;
    const Institution = (await import('../models/Institution.js')).default;
    
    // Validate image file
    gcsService.validateImageFile(req.file);

    // Obtener la institución actual para verificar si tiene imagen previa
    const institution = await Institution.findById(monumentId);
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Si tiene imagen anterior, borrarla de GCS
    if (institution.imageUrl) {
      try {
        // Extraer el nombre del archivo de la URL
        const oldImagePath = institution.imageUrl.split(`${gcsService.bucket.name}/`)[1];
        if (oldImagePath) {
          const oldFile = gcsService.bucket.file(oldImagePath);
          await oldFile.delete().catch(err => {
            console.log('Old image not found or already deleted:', err.message);
          });
        }
      } catch (error) {
        console.log('Error deleting old image:', error.message);
        // Continuar aunque falle el borrado
      }
    }

    // Crear nombre de archivo único: institution_{institutionId}_{timestamp}.ext
    const timestamp = Date.now();
    const extension = req.file.originalname.split('.').pop();
    const filename = `images/institutions/institution_${monumentId}_${timestamp}.${extension}`;
    
    // Upload file to GCS
    const file = gcsService.bucket.file(filename);
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });
    
    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${gcsService.bucket.name}/${filename}`;
    
    // Actualizar la institución con la nueva URL
    institution.imageUrl = publicUrl;
    await institution.save();

    res.json({
      imageUrl: publicUrl,
      fileName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Error uploading institution image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// Standard CRUD routes - MUST be after specific routes like /upload-image
router.get('/', listInstitution);
router.get('/:id', getInstitution);
router.post('/', verifyToken, requireRole('admin'), createInstitutionController);
router.put('/:id', verifyToken, requireRole('admin'), updateInstitutionController);
router.delete('/:id', verifyToken, requireRole('admin'), deleteInstitutionController);

export default router;
