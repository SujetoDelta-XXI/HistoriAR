import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = Router();

router.post('/register', [ body('name').notEmpty(), body('email').isEmail() ], register);
router.post('/login',    [ body('email').isEmail(), body('password').notEmpty() ], login);

export default router;
