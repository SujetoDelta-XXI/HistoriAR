import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { uploadImage, uploadModel } from '../utils/uploader.js';

const router = Router();

router.post('/image', verifyToken, requireRole('admin'), uploadImage.single('image'), (req, res) => {
  res.json({ url: req.file?.path, public_id: req.file?.filename });
});

router.post('/model', verifyToken, requireRole('admin'), uploadModel.single('model3d'), (req, res) => {
  res.json({ url: req.file?.path, public_id: req.file?.filename });
});

export default router;
