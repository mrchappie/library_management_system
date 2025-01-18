import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import pool from '../../db';
import { User } from '../../types/User';

const router = Router();

router.delete('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodedValues = jwt.decode(refreshToken) as User;

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    console.log('first');
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      [decodedValues.uid]
    );
    console.log('second');

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log('third');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;
