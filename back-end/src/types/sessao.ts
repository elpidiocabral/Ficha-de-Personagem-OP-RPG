import { ObjectId } from "mongodb"
import z from "zod";


const sessaosSchema = {
     _id: z.string(),
    personagemId: z.string(),
    numero: z.number(),
    data: z.coerce.date(),
    createdAt: z.coerce.date(),
    titulo: z.string().optional(),
    resumo: z.string().optional(),
    xpGanho: z.number(),
    recompensas: z.string().optional(),
    anotacoes: z.string().optional(),
}

type Sessao = z.infer<typeof sessaosSchema>;