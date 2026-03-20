import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getReadingList = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(`
      SELECT rl.*, b.title as book_title, b.author as book_author, b.cover_url as book_cover
      FROM reading_list rl
      JOIN books b ON rl.book_id = b.id
      WHERE rl.user_id = $1
      ORDER BY rl.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getReadingList:', error);
    res.status(500).json({ message: 'Server error fetching reading list.' });
  }
};

export const updateReadingStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bookId, status } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(`
      INSERT INTO reading_list (user_id, book_id, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id) 
      DO UPDATE SET status = EXCLUDED.status, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, bookId, status]);

    // Fetch book details to return a complete object
    const bookResult = await query('SELECT title as book_title, author as book_author, cover_url as book_cover FROM books WHERE id = $1', [bookId]);
    
    res.json({
      ...result.rows[0],
      ...bookResult.rows[0]
    });
  } catch (error) {
    console.error('Error in updateReadingStatus:', error);
    res.status(500).json({ message: 'Server error updating reading status.' });
  }
};
