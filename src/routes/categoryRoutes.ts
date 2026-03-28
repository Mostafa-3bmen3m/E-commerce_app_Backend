import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', auth, admin, createCategory);
router.put('/:id', auth, admin, updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

export default router;
