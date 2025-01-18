import jwt from 'jsonwebtoken';
import { User } from '../types/User';

const AuthMiddleware = (req: any, res: any, next: any) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, no token provided!' });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decodedValue: any) => {
        if (err) {
          return res.status(403).json({ message: 'Unauthorized' });
        }
        req.user = {
          name: decodedValue.name,
          uid: decodedValue.uid,
          email: decodedValue.email,
        } as User;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Unauthorized' });
  }
};

export default AuthMiddleware;
