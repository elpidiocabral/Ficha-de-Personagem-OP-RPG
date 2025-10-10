import { ObjectId } from "mongodb"

type Sessao = {
    _id: ObjectId,
    personagemId: ObjectId,
    numero: Number,
    data: Date,
    createdAt: Date,
    titulo?: string,
    resumo?: string,
    xpGanho?: number,
    recompensas?: string,
    anotacoes?: string,
};