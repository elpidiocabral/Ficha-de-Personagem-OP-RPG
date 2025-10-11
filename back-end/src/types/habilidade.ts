import z from "zod"


export const HabilidadeSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  custo: z.string().optional(),
  comprada: z.boolean(),
  expanded: z.boolean(),
});

export type Habilidade = z.infer<typeof HabilidadeSchema>;

