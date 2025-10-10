import z from "zod"


const habilidadeSchema = {
    nome : z.string(),
    descricao: z.string(),
    custo : z.string().optional(),
    comprada : z.boolean(),
    expanded: z.boolean()
}

type Habilidade = z.infer<typeof habilidadeSchema>;

