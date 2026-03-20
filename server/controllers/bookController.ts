import { Request, Response } from 'express';
import { query } from '../config/db';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await query('SELECT * FROM books ORDER BY title ASC');
    res.json(books.rows);
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({ message: 'Server error fetching books.' });
  }
};
