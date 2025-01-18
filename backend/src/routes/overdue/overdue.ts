import { Router, Request, Response } from 'express';
import pool from '../../db';
import AuthMiddleware from '../../utils/authMiddleware';
import { QueryResult, ResultSetHeader } from 'mysql2';

const router = Router();

router.get('/expired', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<QueryResult>(
      'SELECT * FROM borrowedbooks WHERE client_id = ? AND return_date < NOW()',
      [req.user?.uid]
    );
    res.status(200).json({ message: 'Overdue books', overdue_books: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

router.put('/extend', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE borrowedbooks SET return_date = DATE_ADD(return_date, INTERVAL 7 DAY) WHERE client_id = ? AND id = ?',
      [req.user?.uid, req.body.borrowed_id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Borrowed book not found' });
      return;
    }

    res.status(200).json({
      message: 'Return date extended successfully',
      book_id: req.body.borrowed_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;
