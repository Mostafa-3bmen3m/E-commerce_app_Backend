import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/', auth, createReview);

export default router;
