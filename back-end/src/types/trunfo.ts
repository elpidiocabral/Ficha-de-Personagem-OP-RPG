import { ObjectId } from "mongodb";
import z from "zod";


export const TrunfoSchema = z.object({
    _id: z.string(),
    nome: z.string(),
    nivel: z.number(),
    createdAt: z.coerce.date(),
    obs: z.string().optional(),
    tags: z.string().optional()
})

export type Trunfo = z.infer<typeof TrunfoSchema>;