import z from "zod";


export const ItemSchema = z.object({
    nome: z.string(),
    descricao: z.string(),
    durabilidadeOriginal: z.number(),
    durabilidadeAtual: z.number()
})

export type Item = z.infer<typeof ItemSchema>;