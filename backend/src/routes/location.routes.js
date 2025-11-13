import { Router } from 'express';
import { getLocationContextController, getNearbyMonumentsController } from '../controllers/locationController.js';

const router = Router();

// Public routes - no authentication required for location services
router.get('/context', getLocationContextController);
router.get('/nearby-monuments', getNearbyMonumentsController);

export default router;
