import { Router } from 'express';
import { verifyS3Connection } from '../config/s3.js';

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
        s3: 'unknown'
      }
    };

    // Check S3 connection
    try {
      await verifyS3Connection();
      healthStatus.services.s3 = 'connected';
    } catch (error) {
      healthStatus.services.s3 = 'disconnected';
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
 * S3 specific health check
 * GET /api/health/s3
 */
router.get('/s3', async (req, res) => {
  try {
    await verifyS3Connection();
    res.json({
      status: 'OK',
      message: 'S3 connection verified',
      bucket: process.env.S3_BUCKET,
      region: process.env.AWS_REGION
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'S3 connection failed',
      error: error.message
    });
  }
});

export default router;