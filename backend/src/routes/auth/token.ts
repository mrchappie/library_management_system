import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../db';
import { User } from '../../types/User';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.post('/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Validate the refresh token
  try {
    const refreshTokenDecoded = validateToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    if (refreshTokenDecoded === 'expired') {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    } else {
      // Issue new tokens
      const newAccessToken = jwt.sign(
        { email: refreshTokenDecoded.email, uid: refreshTokenDecoded.uid },
        process.env.JWT_SECRET as string,
        { expiresIn: '15s' }
      );

      // const newRefreshToken = jwt.sign(
      //   { email: refreshTokenDecoded.email, uid: refreshTokenDecoded.uid },
      //   process.env.JWT_REFRESH_SECRET as string,
      //   { expiresIn: '1h' }
      // );

      // Set cookies
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 15,
      });

      // res.cookie('refreshToken', newRefreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: 'none',
      //   maxAge: 3600,
      // });

      res.status(200).json({
        message: 'Tokens refreshed',
        accessToken: newAccessToken,
        // refreshToken: newRefreshToken,
      });
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
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  // res.status(200).json({
  //   accessToken: jwt.sign(
  //     { email: decodedValue.email, uid: decodedValue.uid },
  //     process.env.JWT_SECRET as string,
  //     {
  //       expiresIn: '15m',
  //     }
  //   ),
  // });
});

router.post('/validate-access-token', async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Validate token
  try {
    const accessTokenDecoded = validateToken(
      accessToken,
      process.env.JWT_SECRET as string
    );

    if (accessTokenDecoded === 'expired') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    } else {
      res.status(200).json({ message: 'Token Valid' });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
});

export default router;

const validateToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return 'expired';
    }
    throw new Error('Invalid token');
  }
};
