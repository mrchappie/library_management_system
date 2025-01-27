import { Router, Request, Response } from 'express';
import pool from '../../db';
import AuthMiddleware from '../../utils/authMiddleware';
import { ResultSetHeader } from 'mysql2';

const router = Router();

// router.get(
//   '/',
//   AuthMiddleware, async (req: Request, res: Response) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM books');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Database error' });
//     }
//   }
// );

router.get(
  '/:id',
  /*AuthMiddleware,*/ async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        'SELECT * FROM clients WHERE client_id = ?',
        [req.params.id]
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

export default router;
