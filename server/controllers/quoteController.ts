import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAllQuotes = async (req: AuthRequest, res: Response) => {
    const { filter, page = 1, limit = 10, genre, author, search, sortBy } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;

    try {
      let queryStr = `
        SELECT q.*, 
               u.username, u.avatar_url,
               b.title as book_title, b.author as book_author, b.cover_url as book_cover,
               (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
               (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count,
               (SELECT COUNT(*) FROM shares WHERE quote_id = q.id) as shares_count
        FROM quotes q
        JOIN users u ON q.user_id = u.id
        LEFT JOIN books b ON q.book_id = b.id
        WHERE 1=1
      `;

      const queryParams: any[] = [];

      if (filter === 'curated') {
        queryStr += ' AND q.is_curated = true';
      } else if (filter === 'community') {
        queryStr += ' AND q.is_curated = false';
      } else if (filter === 'following') {
        if (!userId) {
          return res.status(401).json({ message: 'Authentication required for following feed.' });
        }
        // Fetch following list
        const userResult = await query('SELECT following FROM users WHERE id = $1', [userId]);
        const following = userResult.rows[0]?.following || [];
        
        if (following.length === 0) {
          return res.json({ quotes: [], pagination: { total: 0, page: Number(page), limit: Number(limit), totalPages: 0 } });
        }
        
        queryParams.push(following);
        queryStr += ` AND q.user_id = ANY($${queryParams.length})`;
      } else if (filter === 'for-you') {
        if (userId) {
          const userResult = await query('SELECT following, preferred_genres, followed_authors FROM users WHERE id = $1', [userId]);
          const user = userResult.rows[0] || { following: [], preferred_genres: [], followed_authors: [] };
          
          const following = user.following || [];
          const genres = user.preferred_genres || [];
          const authors = user.followed_authors || [];

          queryParams.push(following, genres, authors);
          
          // Reconstruct query with relevance score
          queryStr = `
            SELECT q.*, 
                   u.username, u.avatar_url,
                   b.title as book_title, b.author as book_author, b.cover_url as book_cover,
                   (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
                   (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count,
                   (
                     CASE WHEN q.user_id = ANY($${queryParams.length - 2}) THEN 10 ELSE 0 END +
                     CASE WHEN b.author = ANY($${queryParams.length}) THEN 8 ELSE 0 END +
                     CASE WHEN b.genres && $${queryParams.length - 1} THEN 5 ELSE 0 END +
                     (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) * 0.1
                   ) as relevance_score
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN books b ON q.book_id = b.id
            WHERE 1=1
          `;
        } else {
          // For guests, relevance is just popularity
          queryStr = `
            SELECT q.*, 
                   u.username, u.avatar_url,
                   b.title as book_title, b.author as book_author, b.cover_url as book_cover,
                   (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
                   (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count,
                   (SELECT COUNT(*) FROM shares WHERE quote_id = q.id) as shares_count,
                   ((SELECT COUNT(*) FROM likes WHERE quote_id = q.id) * 1.0) as relevance_score
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN books b ON q.book_id = b.id
            WHERE 1=1
          `;
        }
      } else if (filter === 'trending') {
        queryStr = `
          SELECT q.*, 
                 u.username, u.avatar_url,
                 b.title as book_title, b.author as book_author, b.cover_url as book_cover,
                 (SELECT COUNT(*) FROM likes WHERE quote_id = q.id) as likes_count,
                 (SELECT COUNT(*) FROM comments WHERE quote_id = q.id) as comments_count,
                 (SELECT COUNT(*) FROM shares WHERE quote_id = q.id) as shares_count,
                 (
                   (SELECT COUNT(*) FROM likes WHERE quote_id = q.id AND created_at > NOW() - INTERVAL '7 days') * 1.0 +
                   (SELECT COUNT(*) FROM comments WHERE quote_id = q.id AND created_at > NOW() - INTERVAL '7 days') * 2.0 +
                   (SELECT COUNT(*) FROM shares WHERE quote_id = q.id AND created_at > NOW() - INTERVAL '7 days') * 3.0
                 ) as trending_score
          FROM quotes q
          JOIN users u ON q.user_id = u.id
          LEFT JOIN books b ON q.book_id = b.id
          WHERE 1=1
        `;
      }

      if (genre) {
        queryParams.push(`%${genre}%`);
        queryStr += ` AND b.genres::text LIKE $${queryParams.length}`;
      }

      if (author) {
        queryParams.push(author);
        queryStr += ` AND b.author = $${queryParams.length}`;
      }

      if (search) {
        queryParams.push(`%${search}%`);
        queryStr += ` AND (q.content ILIKE $${queryParams.length} OR b.title ILIKE $${queryParams.length} OR b.author ILIKE $${queryParams.length})`;
      }

      if (filter === 'for-you') {
        queryStr += ' ORDER BY relevance_score DESC, q.created_at DESC';
      } else if (filter === 'trending') {
        queryStr += ' ORDER BY trending_score DESC, q.created_at DESC';
      } else if (sortBy === 'popularity') {
        queryStr += ' ORDER BY likes_count DESC';
      } else {
        queryStr += ' ORDER BY q.created_at DESC';
      }
      
      queryStr += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);

    const quotesResult = await query(queryStr, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) 
      FROM quotes q
      LEFT JOIN books b ON q.book_id = b.id
      WHERE 1=1
    `;
    const countParams: any[] = [];
    
    if (filter === 'curated') {
      countQuery += ' AND q.is_curated = true';
    } else if (filter === 'community') {
      countQuery += ' AND q.is_curated = false';
    } else if (filter === 'following') {
      if (userId) {
        const userResult = await query('SELECT following FROM users WHERE id = $1', [userId]);
        const following = userResult.rows[0]?.following || [];
        countParams.push(following);
        countQuery += ` AND q.user_id = ANY($${countParams.length})`;
      }
    } else if (filter === 'for-you') {
      // No specific WHERE clause for for-you, it's about ordering
    }

    if (genre) {
      countParams.push(`%${genre}%`);
      countQuery += ` AND b.genres::text LIKE $${countParams.length}`;
    }

    if (author) {
      countParams.push(author);
      countQuery += ` AND b.author = $${countParams.length}`;
    }

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (q.content ILIKE $${countParams.length} OR b.title ILIKE $${countParams.length} OR b.author ILIKE $${countParams.length})`;
    }
    
    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count || '0');

    res.json({
      quotes: quotesResult.rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error in getAllQuotes:', error);
    res.status(500).json({ message: 'Server error fetching quotes.' });
  }
};

export const createQuote = async (req: AuthRequest, res: Response) => {
  const { content, book_id, book_title, author, is_original = false, is_curated = false } = req.body;
  const user_id = req.user?.id;

  if (!content) {
    return res.status(400).json({ message: 'Content is required.' });
  }

  if (content.length > 300) {
    return res.status(400).json({ message: 'Content exceeds character limit of 300.' });
  }

  try {
    let finalBookId = book_id;

    if (!is_original && !book_id && book_title && author) {
      // Create a new book
      const newBook = await query(
        'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING id',
        [book_title, author]
      );
      finalBookId = newBook.rows[0].id;
    }

    const newQuote = await query(
      'INSERT INTO quotes (content, book_id, user_id, is_curated) VALUES ($1, $2, $3, $4) RETURNING *',
      [content, is_original ? null : finalBookId, user_id, is_curated]
    );

    // Fetch the full quote with user and book info to return
    const fullQuote = await query(`
      SELECT q.*, 
             u.username, u.avatar_url,
             b.title as book_title, b.author as book_author, b.cover_url as book_cover,
             0 as likes_count,
             0 as comments_count
      FROM quotes q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN books b ON q.book_id = b.id
      WHERE q.id = $1
    `, [newQuote.rows[0].id]);

    res.status(201).json(fullQuote.rows[0]);
  } catch (error) {
    console.error('Error in createQuote:', error);
    res.status(500).json({ message: 'Server error creating quote.' });
  }
};

export const likeQuote = async (req: AuthRequest, res: Response) => {
  const { id: quote_id } = req.params;
  const user_id = req.user?.id;

  try {
    // Check if already liked
    const likeCheck = await query('SELECT * FROM likes WHERE user_id = $1 AND quote_id = $2', [user_id, quote_id]);

    if (likeCheck.rows.length > 0) {
      // Unlike
      await query('DELETE FROM likes WHERE user_id = $1 AND quote_id = $2', [user_id, quote_id]);
      return res.json({ liked: false, message: 'Quote unliked.' });
    } else {
      // Like
      try {
        await query('INSERT INTO likes (user_id, quote_id) VALUES ($1, $2)', [user_id, quote_id]);
        return res.json({ liked: true, message: 'Quote liked.' });
      } catch (insertError: any) {
        if (insertError.code === '23505') { // unique_violation
          return res.json({ liked: true, message: 'Quote already liked.' });
        }
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error in likeQuote:', error);
    res.status(500).json({ message: 'Server error toggling like.' });
  }
};

export const commentOnQuote = async (req: AuthRequest, res: Response) => {
  const { id: quote_id } = req.params;
  const { content } = req.body;
  const user_id = req.user?.id;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required.' });
  }

  try {
    const newComment = await query(
      'INSERT INTO comments (user_id, quote_id, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, quote_id, content]
    );

    // Fetch comment with user info
    const fullComment = await query(`
      SELECT c.*, u.username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [newComment.rows[0].id]);

    res.status(201).json(fullComment.rows[0]);
  } catch (error) {
    console.error('Error in commentOnQuote:', error);
    res.status(500).json({ message: 'Server error adding comment.' });
  }
};

export const getCommentsByQuote = async (req: Request, res: Response) => {
  const { id: quote_id } = req.params;

  try {
    const comments = await query(`
      SELECT c.*, u.username, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.quote_id = $1
      ORDER BY c.created_at ASC
    `, [quote_id]);

    res.json(comments.rows);
  } catch (error) {
    console.error('Error in getCommentsByQuote:', error);
    res.status(500).json({ message: 'Server error fetching comments.' });
  }
};

export const trackShare = async (req: AuthRequest, res: Response) => {
  const { id: quote_id } = req.params;
  const { platform } = req.body;
  const user_id = req.user?.id;

  try {
    await query(
      'INSERT INTO shares (user_id, quote_id, platform) VALUES ($1, $2, $3)',
      [user_id, quote_id, platform]
    );
    res.status(201).json({ message: 'Share tracked.' });
  } catch (error) {
    console.error('Error in trackShare:', error);
    res.status(500).json({ message: 'Server error tracking share.' });
  }
};
