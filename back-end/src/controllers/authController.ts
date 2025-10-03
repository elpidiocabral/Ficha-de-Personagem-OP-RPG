import { Request, Response } from 'express';

const FRONTEND_URL = process.env.FRONTEND_URL;

export function authCallback(req: Request, res: Response) {
    const redirect = FRONTEND_URL;
    res.redirect(redirect!);
}

export function authFailure(req: Request, res: Response) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
}


