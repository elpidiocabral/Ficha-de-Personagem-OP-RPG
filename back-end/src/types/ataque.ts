import z from "zod";

export const AtaqueSchema = z.object({
    nome: z.string(),
    bonus: z.string(),
    dano: z.string()
})

export type Ataque = z.infer<typeof AtaqueSchema>;