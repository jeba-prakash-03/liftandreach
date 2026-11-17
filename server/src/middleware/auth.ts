import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'liftandreach_super_secure_jwt_secret_key_2026_xyz!';

  try {
    const decoded = jwt.verify(token, secret) as { id: number; email: string; name: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};
