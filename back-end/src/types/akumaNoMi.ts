import { ObjectId } from "mongodb"

type AkumaNoMi = {
    _id: ObjectId,
    nome: string,
    tipo: string,
    createdAt: Date,
    subtipo?: string,
    tematica?: string
    desejo?: string,
    habilidadesBase?: string
}