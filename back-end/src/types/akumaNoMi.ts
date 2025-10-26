import { ObjectId } from "mongodb"
import { z } from "zod";

export const AkumanoMiSchema = z.object({
    _id: z.string(),
     nome: z.string(),
    tipo: z.string(),
    createdAt: z.coerce.date(),
    subtipo: z.string().optional(),
    tematica: z.string().optional(),
    desejo: z.string().optional(),
    habilidadesBase: z.string().optional()
})

export type AkumaNoMi = z.infer<typeof AkumanoMiSchema>;