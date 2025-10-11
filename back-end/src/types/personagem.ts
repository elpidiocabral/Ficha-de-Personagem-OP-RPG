import z from "zod";
import { AtributosSchema } from "./atributos";
import { HabilidadeSchema } from "./habilidade";
import { ItemSchema } from "./item";
import { CompetenciaSchema } from "./competencia";
import { AtaqueSchema } from "./ataque";
import { TrunfoSchema } from "./trunfo";
import { AptidaoSchema } from "./aptidao";


export const PersonagemSchema = z.object({
    _id: z.string(),
    usuarioId: z.string(),
    raca: z.string(),
    classe: z.string(),
    profissao: z.string(),
    nivelClasse: z.number(),
    nivelProfissao: z.number(),
    nivelFruta: z.number(),
    vida: z.number(),
    vidaMax: z.number(),
    vigor: z.number(),
    vigorMax: z.number(),
    classeAcerto: z.number(),
    classeDificuldade: z.number(),
    determinacao: z.number(),
    bonusMaestria: z.number(),
    sorte: z.number(),
    deslocamento:z.number(),
    habilidadePontos:z.number(),
    atributos: AtributosSchema,
    habilidadeFrutaPontos:z.number().optional(),
    aptidaoPontos:z.number().optional(),
    moral: z.number().optional(),
    ferimentos: z.string().optional(),
    lesoes: z.string().optional(),
    historia: z.string().optional(),
    aparenciaBase64: z.string().optional(),
    objetivos: z.string().optional(),
    sonho: z.string().optional(),
    ilhaOrigem: z.string().optional(),
    anotacoesGerais: z.string().optional(),
    habilidades: z.array(HabilidadeSchema),
    items: z.array(ItemSchema),
    competencias: z.array(CompetenciaSchema),
    aptidoes: z.array(AptidaoSchema),
    ataques: z.array(AtaqueSchema),
    frutaId: z.string().optional(),
    trunfos: z.array(TrunfoSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})

export type personagem = z.infer<typeof PersonagemSchema>