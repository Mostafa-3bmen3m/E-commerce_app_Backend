import { Router } from 'express';
import { getWatchlist, toggleWatchlistItem } from '../controllers/watchlistController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

router.use(auth);

router.get('/', getWatchlist);
router.post('/toggle', toggleWatchlistItem);

export default router;
