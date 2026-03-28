import { Router } from 'express';
import { submitContact, getContacts } from '../controllers/contactController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

router.post('/', submitContact);
router.get('/', auth, admin, getContacts);

export default router;
