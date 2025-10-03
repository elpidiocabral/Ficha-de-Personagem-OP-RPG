import { Request, Response } from "express";

import { getUserObject } from "../services/userService";

export function getProfile(req: Request, res: Response) {
    res.status(200).json(getUserObject(req.user));
}
