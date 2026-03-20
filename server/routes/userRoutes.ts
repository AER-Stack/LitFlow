import express from 'express';
import { getUserProfile, followUser, unfollowUser, updateProfile, getUserLikes } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/likes', getUserLikes);
router.put('/:id', authenticateToken, updateProfile);
router.post('/:id/follow', authenticateToken, followUser);
router.post('/:id/unfollow', authenticateToken, unfollowUser);

export default router;
