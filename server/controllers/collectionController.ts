import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getCollections = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(`
      SELECT c.*, (SELECT COUNT(*) FROM collection_quotes WHERE collection_id = c.id) as quotes_count
      FROM collections c
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getCollections:', error);
    res.status(500).json({ message: 'Server error fetching collections.' });
  }
};

export const createCollection = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, emoji } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(`
      INSERT INTO collections (user_id, name, emoji)
      VALUES ($1, $2, $3)
      RETURNING *, 0 as quotes_count
    `, [userId, name, emoji]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in createCollection:', error);
    res.status(500).json({ message: 'Server error creating collection.' });
  }
};

export const saveToCollection = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id: collectionId } = req.params;
  const { quoteId } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify collection belongs to user
    const collectionCheck = await query('SELECT id FROM collections WHERE id = $1 AND user_id = $2', [collectionId, userId]);
    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    await query(`
      INSERT INTO collection_quotes (collection_id, quote_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [collectionId, quoteId]);
    
    res.json({ message: 'Quote saved to collection.' });
  } catch (error) {
    console.error('Error in saveToCollection:', error);
    res.status(500).json({ message: 'Server error saving to collection.' });
  }
};

export const getCollectionQuotes = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id: collectionId } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify collection belongs to user
    const collectionCheck = await query('SELECT id FROM collections WHERE id = $1 AND user_id = $2', [collectionId, userId]);
    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    const result = await query(`
      SELECT q.*, 
             u.username, u.avatar_url,
             b.title as book_title, b.author as book_author, b.cover_url as book_cover,
             (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count,
             (SELECT COUNT(*) FROM shares WHERE quote_id = q.id) as shares_count
      FROM quotes q
      JOIN collection_quotes cq ON q.id = cq.quote_id
      JOIN users u ON q.user_id = u.id
      LEFT JOIN books b ON q.book_id = b.id
      WHERE cq.collection_id = $1
      ORDER BY cq.created_at DESC
    `, [collectionId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getCollectionQuotes:', error);
    res.status(500).json({ message: 'Server error fetching collection quotes.' });
  }
};
