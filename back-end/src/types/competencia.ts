import z from "zod"

export const CompetenciaSchema = z.object({
    nome: z.string(),
    nivel: z.number(),
    obs: z.string().optional()
})

export type Competencia = z.infer<typeof CompetenciaSchema>;