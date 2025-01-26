import { Router, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import pool from '../../db';
import { User } from '../../types/User';

const router = Router();

router.delete('/', async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);
    const decodedValues = jwt.decode(accessToken) as User;

    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    // console.log('first');
    // const [result] = await pool.query<ResultSetHeader>(
    //   'DELETE FROM refresh_tokens WHERE user_id = ?',
    //   [decodedValues.uid]
    // );
    // console.log('second');

    // if (result.affectedRows === 0) {
    //   res.status(404).json({ message: 'User not found' });
    //   return;
    // }
    // console.log('third');

    // Clear the cookie by setting it with an empty value and a past expiration date
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;
