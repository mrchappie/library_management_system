import { Router, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import pool from '../../db';
import jwt from 'jsonwebtoken';
import { formatErrors } from './utils';

const router = Router();

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: formatErrors(errors.array()) });
      return;
    }
    try {
      const [existingUser] = await pool.query<RowDataPacket[]>(
        'SELECT password, client_id FROM clients WHERE email = ?',
        [req.body.email]
      );

      if (existingUser.length === 0) {
        res
          .status(400)
          .json({ errors: { email: 'Invalid email or password' } });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        existingUser[0].password as string
      );

      if (!passwordMatch) {
        res
          .status(400)
          .json({ errors: { email: 'Invalid email or password' } });
        return;
      }

      const accessToken = jwt.sign(
        { email: req.body.email, uid: existingUser[0].client_id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { email: req.body.email, uid: existingUser[0].client_id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '5d' }
      );

      // await pool.query(
      //   'INSERT INTO refresh_tokens (client_id, refresh_token, expiry_date) VALUES (?, ?, ?)',
      //   [
      //     existingUser[0].client_id,
      //     refreshToken,
      //     new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      //   ]
      // );

      res
        .status(200)
        .json({ message: 'Login successful', accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error' });
    }
  }
);

export default router;

interface User {
  password: string;
}
