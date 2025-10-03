import { Response, Request, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) next();
  res.status(401).json({ sucess: false, message: 'Not authenticated' });
}