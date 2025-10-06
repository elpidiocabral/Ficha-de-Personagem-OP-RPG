import { Request, Response } from "express";
import { exampleRepository } from "../repository/exampleRepository";
import { ExampleService } from "../services/exampleService";

const repository = new exampleRepository();
const service = new ExampleService(repository);

async function getAllExamples(req: Request, res: Response) {
    const resposta = await service.getAllExamples();
    res.status(200).json(resposta);
}

async function postExample(req: Request, res: Response) {
    const item = req.body;
    await service.postExample(item);
    res.status(201).send("Item criado com sucesso");
}

export { getAllExamples, postExample };