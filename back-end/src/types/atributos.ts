import z from "zod";


const AtributosSchema = z.object({
  Base: z.number(),
  Bonus: z.number(), 
});

const nomesAtributos = [
  "forca",
  "agilidade",
  "destreza",
  "velocidade",
  "conhecimento",
  "raciocinio",
  "disciplina",
  "persistencia",
  "vontade",
  "carisma",
  "aparencia",
  "destino",
  "resiliencia",
  "resistencia",
  "vitalidade",
] as const;


export type Atributos = z.infer<typeof AtributosSchema>;

// os dados ficam dessa forma:

// const dados = {
//   forca: { Base: 10, Bonus: 2, },
//   agilidade: { Base: 8, Bonus: 1 },
//   destreza: { Base: 7, Bonus: 0 },
//   velocidade: { Base: 5, Bonus: 3 },
//   conhecimento: { Base: 6, Bonus: 2 },
//   raciocinio: { Base: 9, Bonus: 0 },
//   disciplina: { Base: 4, Bonus: 1 },
//   persistencia: { Base: 5, Bonus: 2 },
//   vontade: { Base: 7, Bonus: 1 },
//   carisma: { Base: 6, Bonus: 0 },
//   aparencia: { Base: 5, Bonus: 0 },
//   destino: { Base: 4, Bonus: 1 },
//   resiliencia: { Base: 8, Bonus: 1 },
//   resistencia: { Base: 7, Bonus: 2 },
//   vitalidade: { Base: 10, Bonus: 0 },
// };