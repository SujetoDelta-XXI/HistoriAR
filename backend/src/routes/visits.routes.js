import { Router } from 'express';
import { listVisit, getVisit, createVisitController, updateVisitController, deleteVisitController } from '../controllers/visitsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, listVisit);
router.get('/:id', verifyToken, getVisit);
router.post('/', verifyToken, createVisitController);
router.put('/:id', verifyToken, updateVisitController);
router.delete('/:id', verifyToken, deleteVisitController);

export default router;
