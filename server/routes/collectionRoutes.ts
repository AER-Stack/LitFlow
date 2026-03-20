import express from 'express';
import { getCollections, createCollection, saveToCollection, getCollectionQuotes } from '../controllers/collectionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getCollections);
router.post('/', authenticateToken, createCollection);
router.post('/:id/save', authenticateToken, saveToCollection);
router.get('/:id/quotes', authenticateToken, getCollectionQuotes);

export default router;
