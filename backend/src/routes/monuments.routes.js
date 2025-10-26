import { Router } from 'express';
import { listMonument, getMonument, createMonumentController, updateMonumentController, deleteMonumentController, searchMonumentsController, getFilterOptionsController } from '../controllers/monumentsController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import multer from 'multer';

const router = Router();

// Configure multer for monument file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
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

export default router;
