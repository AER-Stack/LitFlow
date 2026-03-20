import express from 'express';
import { getAllQuotes, createQuote, likeQuote, commentOnQuote, getCommentsByQuote, trackShare } from '../controllers/quoteController';
import { optionalAuthenticateToken, authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuthenticateToken, getAllQuotes);
router.post('/', authenticateToken, createQuote);
router.post('/:id/like', authenticateToken, likeQuote);
router.post('/:id/comment', authenticateToken, commentOnQuote);
router.post('/:id/share', optionalAuthenticateToken, trackShare);
router.get('/:id/comments', getCommentsByQuote);

export default router;
