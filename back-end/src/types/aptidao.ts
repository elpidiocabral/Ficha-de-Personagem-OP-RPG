import z from "zod";


export const AptidaoSchema = z.object({
    nome: z.string(),
    nivel: z.number(),
    obs: z.string().optional()
})

export type Aptidao = z.infer<typeof AptidaoSchema>

