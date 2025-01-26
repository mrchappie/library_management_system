import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../db';
import { User } from '../../types/User';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.post('/validate-token', async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  // const decodedValues = jwt.decode(accessToken) as User;

  if (!accessToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // const [rows] = await pool.query<RowDataPacket[]>(
  //   'SELECT * FROM refresh_tokens WHERE user_id = ? AND NOT revoked',
  //   [decodedValues.uid]
  // );

  // if (rows.length === 0) {
  //   res.status(401).json({ message: 'Unauthorized' });
  //   return;
  // }

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET as string,
    (err: any, decodedValue: any) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const newAccessToken = jwt.sign(
        { email: decodedValue.email, uid: decodedValue.uid },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '15m',
        }
      );

      console.log(newAccessToken);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({ message: 'Token validated' });

      // res.status(200).json({
      //   accessToken: jwt.sign(
      //     { email: decodedValue.email, uid: decodedValue.uid },
      //     process.env.JWT_SECRET as string,
      //     {
      //       expiresIn: '15m',
      //     }
      //   ),
      // });
    }
  );
});

export default router;
