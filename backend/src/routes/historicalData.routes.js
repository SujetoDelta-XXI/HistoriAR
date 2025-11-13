import express from 'express';
import multer from 'multer';
import {
  getHistoricalDataByMonument,
  getHistoricalDataById,
  createHistoricalData,
  updateHistoricalData,
  deleteHistoricalData,
  reorderHistoricalData
} from '../controllers/historicalDataController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
});

// Get all historical data for a monument
router.get(
  '/monuments/:monumentId/historical-data',
  verifyToken,
  requireRole('admin'),
  getHistoricalDataByMonument
);

// Get a single historical data entry
router.get(
  '/historical-data/:id',
  verifyToken,
  requireRole('admin'),
  getHistoricalDataById
);

// Create new historical data entry
router.post(
  '/monuments/:monumentId/historical-data',
  verifyToken,
  requireRole('admin'),
  upload.single('image'),
  createHistoricalData
);

// Update historical data entry
router.put(
  '/historical-data/:id',
  verifyToken,
  requireRole('admin'),
  upload.single('image'),
  updateHistoricalData
);

// Delete historical data entry
router.delete(
  '/historical-data/:id',
  verifyToken,
  requireRole('admin'),
  deleteHistoricalData
);

// Reorder historical data entries
router.put(
  '/monuments/:monumentId/historical-data/reorder',
  verifyToken,
  requireRole('admin'),
  reorderHistoricalData
);

export default router;
