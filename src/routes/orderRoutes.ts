import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders } from '../controllers/orderController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

router.use(auth);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/', admin, getAllOrders);
router.get('/:id', getOrderById);

export default router;
