import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(`
      SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ message: 'Server error marking notification as read.' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({ message: 'Server error marking all notifications as read.' });
  }
};
