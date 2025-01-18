import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import pool from '../../db';

const router = Router();

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password')
      .isLength({ min: 6 })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const isEmailUnique = await pool.query<ResultSetHeader[]>(
      'SELECT * FROM clients WHERE email = ?',
      [req.body.email]
    );

    if (isEmailUnique[0].length > 0) {
      res.status(400).json({ message: 'Email is not valid' });
      return;
    }

    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
        // password: req.body.password,
        password: bcrypt.hashSync(req.body.password, 10),
      };
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO clients (name, email, password) VALUES (?, ?, ?)',
        [user.name, user.email, user.password]
      );

      res.status(200).json({ ...user, userID: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

export default router;
