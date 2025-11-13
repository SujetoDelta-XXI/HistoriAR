import { Router } from 'express';
import { 
  createTourController, 
  listToursController, 
  getTourController, 
  updateTourController, 
  deleteTourController,
  getToursByInstitutionController
} from '../controllers/toursController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listToursController);
router.get('/:id', getTourController);
router.get('/institution/:institutionId', getToursByInstitutionController);

// Admin routes
router.post('/', verifyToken, requireRole('admin'), createTourController);
router.put('/:id', verifyToken, requireRole('admin'), updateTourController);
router.delete('/:id', verifyToken, requireRole('admin'), deleteTourController);

export default router;
