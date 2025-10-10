import z from "zod"

const competenciaSchema = {
    nome: z.string(),
    nivel: z.number(),
    obs: z.string().optional()
}

type Competencia = z.infer<typeof competenciaSchema>;