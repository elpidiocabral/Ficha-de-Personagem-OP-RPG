import z from "zod";


const itemSchema = {
    nome: z.string(),
    descricao: z.string(),
    durabilidadeOriginal: z.number(),
    durabilidadeAtual: z.number()
}

type Item = z.infer<typeof itemSchema>;