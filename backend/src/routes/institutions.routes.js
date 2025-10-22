import { Router } from 'express';
import { listInstitution, getInstitution, createInstitutionController, updateInstitutionController, deleteInstitutionController } from '../controllers/institutionsController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listInstitution);
router.get('/:id', getInstitution);
router.post('/', verifyToken, requireRole('admin'), createInstitutionController);
router.put('/:id', verifyToken, requireRole('admin'), updateInstitutionController);
router.delete('/:id', verifyToken, requireRole('admin'), deleteInstitutionController);

export default router;
