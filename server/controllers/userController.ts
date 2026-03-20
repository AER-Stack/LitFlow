import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userResult = await query(`
      SELECT id, username, email, avatar_url, bio, following, created_at,
             (SELECT COUNT(*) FROM quotes WHERE user_id = $1) as total_quotes,
             (SELECT COUNT(*) FROM likes WHERE user_id = $1) as total_likes,
             (SELECT COUNT(*) FROM reading_list WHERE user_id = $1 AND status = 'finished') as books_completed,
             (SELECT COUNT(*) FROM reading_list WHERE user_id = $1 AND status = 'currently_reading') as currently_reading
      FROM users
      WHERE id = $1
    `, [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userResult.rows[0];
    const stats = {
      quotes: parseInt(user.total_quotes || '0'),
      likes: parseInt(user.total_likes || '0'),
      books_completed: parseInt(user.books_completed || '0'),
      currently_reading: parseInt(user.currently_reading || '0')
    };

    // Remove raw count fields and add stats object
    const { total_quotes, total_likes, books_completed, currently_reading, ...userWithoutRawStats } = user;
    const finalUser = { ...userWithoutRawStats, stats };

    // Fetch user's quotes
    const quotesResult = await query(`
      SELECT q.*, 
             u.username, u.avatar_url,
             b.title as book_title, b.author as book_author, b.cover_url as book_cover,
             (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count
      FROM quotes q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN books b ON q.book_id = b.id
      WHERE q.user_id = $1
      ORDER BY q.created_at DESC
    `, [id]);

    res.json({
      user: finalUser,
      quotes: quotesResult.rows
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

export const followUser = async (req: AuthRequest, res: Response) => {
  const { id: targetUserId } = req.params;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }

  try {
    // Add targetUserId to current user's following array if not already there
    await query(`
      UPDATE users 
      SET following = array_append(following, $1) 
      WHERE id = $2 AND NOT ($1 = ANY(following))
    `, [targetUserId, currentUserId]);

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error in followUser:', error);
    res.status(500).json({ message: 'Server error following user.' });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  const { id: targetUserId } = req.params;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Remove targetUserId from current user's following array
    await query(`
      UPDATE users 
      SET following = array_remove(following, $1) 
      WHERE id = $2
    `, [targetUserId, currentUserId]);

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    res.status(500).json({ message: 'Server error unfollowing user.' });
  }
};

export const getUserLikes = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const likesResult = await query('SELECT quote_id FROM likes WHERE user_id = $1', [id]);
    const likedQuoteIds = likesResult.rows.map(row => row.quote_id);
    res.json(likedQuoteIds);
  } catch (error) {
    console.error('Error in getUserLikes:', error);
    res.status(500).json({ message: 'Server error fetching user likes.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { username, bio, avatar_url, preferred_genres, followed_authors } = req.body;
  const currentUserId = req.user?.id;

  if (!currentUserId || currentUserId != id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Check if username is taken by another user
    if (username) {
      const usernameCheck = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, id]);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
    }

    const updateResult = await query(`
      UPDATE users 
      SET username = COALESCE($1, username),
          bio = COALESCE($2, bio),
          avatar_url = COALESCE($3, avatar_url),
          preferred_genres = COALESCE($4, preferred_genres),
          followed_authors = COALESCE($5, followed_authors)
      WHERE id = $6
      RETURNING id, username, email, avatar_url, bio, following, preferred_genres, followed_authors, created_at
    `, [username, bio, avatar_url, preferred_genres, followed_authors, currentUserId]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
