import { Router } from 'express';
import { listHistoricalData, getHistoricalData, createHistoricalDataController, updateHistoricalDataController, deleteHistoricalDataController } from '../controllers/historicalDataController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { uploadImage } from '../utils/uploader.js';

const router = Router();

router.get('/', listHistoricalData);
router.get('/:id', getHistoricalData);

router.post('/',
  verifyToken, requireRole('admin'),
  uploadImage.array('oldImages', 10),
  createHistoricalDataController
);

router.put('/:id',
  verifyToken, requireRole('admin'),
  uploadImage.array('oldImages', 10),
  updateHistoricalDataController
);

router.delete('/:id', verifyToken, requireRole('admin'), deleteHistoricalDataController);

export default router;
