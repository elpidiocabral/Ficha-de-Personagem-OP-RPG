import { ObjectId } from "mongodb";

type Trunfo = {
    _id: ObjectId,
    nome: string,
    nivel: Number,
    createdAt: Date,
    obs?: string,
    tags?: string
};