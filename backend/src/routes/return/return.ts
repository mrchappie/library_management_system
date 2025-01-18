import { Router, Request, Response } from 'express';
import pool from '../../db';
import AuthMiddleware from '../../utils/authMiddleware';
import { ResultSetHeader } from 'mysql2';

const router = Router();

router.delete('/', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM borrowedbooks WHERE id = ? AND client_id = ?',
      [req.body.borrowed_id, req.user?.uid]
    );

    if (result.affectedRows === 1) {
      await pool.query<ResultSetHeader>(
        'UPDATE books SET borrowed = borrowed - 1 WHERE id = ?',
        [req.body.book_id]
      );
    }

    res.status(200).json({
      message: 'Book returned successfully',
      book_id: req.body.book_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;
