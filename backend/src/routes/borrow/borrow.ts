import { Router, Request, Response } from 'express';
import pool from '../../db';
import AuthMiddleware from '../../utils/authMiddleware';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = Router();

router.post('/', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const [book] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM books WHERE id = ?',
      [req.body.book_id]
    );

    if (book.length === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book[0].quantity - book[0].borrowed === 0) {
      res.status(404).json({ message: 'All books are borrowed' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO borrowedbooks (client_id, book_id) VALUES (?, ?)',
      [req.user?.uid, req.body.book_id]
    );

    if (result.affectedRows !== 0) {
      await pool.query<ResultSetHeader>(
        'UPDATE books SET borrowed = borrowed + 1 WHERE id = ?',
        [req.body.book_id]
      );
    }

    res.status(200).json({
      message: 'Book borrowed successfully',
      borrowed_book_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

router.get(
  '/all_borrowed_books',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM borrowedbooks WHERE client_id = ?',
        [req.user?.uid]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

export default router;
