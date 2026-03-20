import express from 'express';
import { getReadingList, updateReadingStatus } from '../controllers/readingListController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getReadingList);
router.post('/', authenticateToken, updateReadingStatus);

export default router;
