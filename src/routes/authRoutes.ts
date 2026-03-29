import { Router } from 'express';
import { register, login, getAllUsers, refresh, logout, getProfile, updateProfile, updateUserRole } from '../controllers/authController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', auth, logout);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id/role', auth, admin, updateUserRole);

export default router;
