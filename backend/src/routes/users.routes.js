import { Router } from 'express';
import {
  listUsers,
  getUser,
  getMyProfile,
  createUserController,
  updateUserController,
  deleteUserController
} from '../controllers/usersController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

/**
 * 👤 Ruta para obtener el perfil del usuario autenticado
 * Disponible para cualquier usuario con token válido.
 * Endpoint: GET /api/users/me
 */
router.get('/me', verifyToken, getMyProfile);

/**
 * 🔒 Rutas protegidas solo para administradores
 */
router.use(verifyToken, requireRole('admin'));

router.get('/', listUsers);                 // Listar todos los usuarios (solo admin)
router.get('/:id', getUser);                // Obtener usuario por ID (solo admin)
router.post('/', createUserController);     // Crear usuario (solo admin)
router.put('/:id', updateUserController);   // Actualizar usuario (solo admin)
router.delete('/:id', deleteUserController);// Eliminar usuario (solo admin)

export default router;
