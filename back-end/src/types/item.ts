import z from "zod";


const itemSchema = {
    nome: z.string(),
    descricao: z.string(),
    durabilidadeOriginal: z.number(),
    durabilidadeAtual: z.number()
}

export type Item = z.infer<typeof itemSchema>;