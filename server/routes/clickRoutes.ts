import express from 'express';
import { trackClick } from '../controllers/clickController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', optionalAuthenticateToken, trackClick);

export default router;
