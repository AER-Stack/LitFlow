import { Request, Response } from 'express';
import { query } from '../config/db';

export const trackClick = async (req: Request, res: Response) => {
  const { bookId, platform } = req.body;
  const userId = (req as any).user?.id;

  try {
    await query(
      'INSERT INTO clicks (user_id, book_id, platform) VALUES ($1, $2, $3)',
      [userId || null, bookId, platform]
    );
    res.json({ message: 'Click tracked successfully.' });
  } catch (error) {
    console.error('Error in trackClick:', error);
    res.status(500).json({ message: 'Server error tracking click.' });
  }
};
