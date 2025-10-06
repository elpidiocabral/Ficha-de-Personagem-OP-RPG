import { Request, Response } from "express";

import { FichaService } from "../services/fichaService";
import { FichaRepository } from "../repository/fichaRepository";

const service = new FichaService(new FichaRepository());

export async function createFicha(req: Request, res: Response) {
    const user = req.user as { id: string };
    const ficha = req.body;
    await service.createFicha(ficha, user.id)
    res.status(201).json({ message: "Ficha created successfully" });
}

export async function getFichasByUserId(req: Request, res: Response) {
    const user = req.user as { id: string };
    const fichas = await service.getFichasByUserId(user.id);
    res.status(200).json(fichas);
}

export async function updateFicha(req: Request, res: Response) {
    const fichaId = req.params.id;
    const ficha = req.body;
    await service.updateFicha(ficha, fichaId);
    res.status(200).json({ message: "Ficha updated sucessfully" });
}

export async function deleteFicha(req: Request, res: Response) {
    const fichaId = req.params.id;
    await service.deleteFicha(fichaId);
    res.status(200).json({ message: "Ficha deleted successfully" });
}