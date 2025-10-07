import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(userId: string, role: UserRole) {
  return jwt.sign({ userId, role } satisfies JwtPayload, JWT_SECRET, { expiresIn: '7d' });
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(roles?: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : req.cookies?.token;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
