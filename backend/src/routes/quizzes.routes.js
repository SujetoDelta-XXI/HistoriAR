import { Router } from 'express';
import { listQuiz, getQuiz, createQuizController, updateQuizController, deleteQuizController, evaluateQuizController } from '../controllers/quizzesController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listQuiz);
router.get('/:id', getQuiz);
router.post('/', verifyToken, requireRole('admin'), createQuizController);
router.put('/:id', verifyToken, requireRole('admin'), updateQuizController);
router.delete('/:id', verifyToken, requireRole('admin'), deleteQuizController);

// evaluar respuestas del usuario (público con login)
router.post('/:id/evaluate', verifyToken, evaluateQuizController);

export default router;
