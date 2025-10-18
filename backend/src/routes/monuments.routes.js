import { Router } from 'express';
import { listMonument, getMonument, createMonumentController, updateMonumentController, deleteMonumentController } from '../controllers/monumentsController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { uploadImage, uploadModel } from '../utils/uploader.js';

const router = Router();

router.get('/', listMonument);
router.get('/:id', getMonument);

router.post('/',
  verifyToken, requireRole('admin'),
  uploadImage.fields([{ name: 'image', maxCount: 1 }]),
  uploadModel.fields([{ name: 'model3d', maxCount: 1 }]),
  createMonumentController
);

router.put('/:id',
  verifyToken, requireRole('admin'),
  uploadImage.fields([{ name: 'image', maxCount: 1 }]),
  uploadModel.fields([{ name: 'model3d', maxCount: 1 }]),
  updateMonumentController
);

router.delete('/:id', verifyToken, requireRole('admin'), deleteMonumentController);

export default router;
