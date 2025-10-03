import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  sub: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  provider: string;
  iat?: number;
  exp?: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer token' });
  }
  
  const token = auth.slice('Bearer '.length);
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    (req as any).user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice('Bearer '.length);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      (req as any).user = payload;
    } catch {
      // Token inválido, mas continuamos sem user
    }
  }
  
  return next();
}