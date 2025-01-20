import { Router, Request, Response } from 'express';
import pool from '../../db';
import AuthMiddleware from '../../utils/authMiddleware';
import { createUpdateBookQuery } from './utils';
import { ResultSetHeader } from 'mysql2';

const router = Router();

router.get(
  '/',
  /*AuthMiddleware,*/ async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM books');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

router.get(
  '/:id',
  /*AuthMiddleware,*/ async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM books WHERE book_id = ?', [
        req.params.id,
      ]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

router.post(
  '/add_book',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO books (title, author, quantity, client_id) VALUES (?, ?, ?, ?)',
        [req.body.title, req.body.author, +req.body.quantity, req.user?.uid]
      );
      // console.log(rows);
      res
        .status(200)
        .json({ message: 'Book added successfully', book_id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

router.put(
  '/update_book/:id',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    try {
      const [columns, values] = createUpdateBookQuery(req.body);
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE books SET ${columns} WHERE id = ? AND client_id = ?`,
        [...values, req.params.id, req.user?.uid]
      );
      res.status(200).json({
        message: 'Book updated successfully',
        book_id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

router.delete(
  '/delete_book/:id',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM books WHERE id = ? AND client_id = ?',
        [req.params.id, req.user?.uid]
      );

      res.status(200).json({
        message: 'Book deleted successfully',
        book_id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

export default router;
