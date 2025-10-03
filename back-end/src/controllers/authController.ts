import { Request, Response } from 'express';

export function authCallback(req: Request, res: Response) {
    res.redirect('http://localhost:5173');
}

export function authFailure(req: Request, res: Response) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
}


