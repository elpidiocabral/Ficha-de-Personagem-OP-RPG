import z from "zod";

const ataqueSchema = {
    nome: z.string(),
    bonus: z.string(),
    dano: z.string()
}

export type Ataque = z.infer<typeof ataqueSchema>;