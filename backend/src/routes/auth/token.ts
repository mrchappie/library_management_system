import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../db';
import { User } from '../../types/User';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.post('/token', async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const decodedValues = jwt.decode(refreshToken) as User;

  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM refresh_tokens WHERE user_id = ? AND NOT revoked',
    [decodedValues.uid]
  );

  if (rows.length === 0) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    (err: any, decodedValue: any) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      res.json({
        accessToken: jwt.sign(
          { email: decodedValue.email, uid: decodedValue.uid },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '30s',
          }
        ),
      });
    }
  );
});

export default router;
