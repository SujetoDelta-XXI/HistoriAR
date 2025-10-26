import { Router } from 'express';
import { verifyGCSConnection } from '../config/gcs.js';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        gcs: 'unknown'
      }
    };

    // Check GCS connection
    try {
      await verifyGCSConnection();
      healthStatus.services.gcs = 'connected';
    } catch (error) {
      healthStatus.services.gcs = 'disconnected';
      healthStatus.status = 'DEGRADED';
    }

    const statusCode = healthStatus.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * GCS specific health check
 * GET /api/health/gcs
 */
router.get('/gcs', async (req, res) => {
  try {
    await verifyGCSConnection();
    res.json({
      status: 'OK',
      message: 'GCS connection verified',
      bucket: process.env.GCS_BUCKET_NAME,
      project: process.env.GCS_PROJECT_ID
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'GCS connection failed',
      error: error.message
    });
  }
});

export default router;