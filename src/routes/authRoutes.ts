import { Router } from 'express';
import { register, login, getAllUsers } from '../controllers/authController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, admin, getAllUsers);

export default router;
