import { useCallback } from 'react';
import { Character } from '../types';

interface UseCalculationsReturn {
  calculateAttributes: (character: Character) => Partial<Character>;
  calculateCombatInfo: (character: Character) => {
    classeAcerto: number;
    classeDificuldade: number;
    deslocamento: string;
  };
  calculateReserves: (resistencia: number, persistencia: number) => {
    reservaVidaDados: string;
    reservaVigorDados: string;
  };
  updateHealthBars: (
    vidaAtual: number,
    vidaMax: number,
    vigorAtual: number,
    vigorMax: number,
    ferimentos: any[],
    lesoes: any[]
  ) => {
    vidaPercentual: number;
    vigorPercentual: number;
    vidaMaxAjustada: number;
    vigorMaxAjustado: number;
    reducaoVida: number;
    reducaoVigor: number;
  };
}

export const useCalculations = (): UseCalculationsReturn => {
  
  // Calculate all attributes based on base + bonus values
  const calculateAttributes = useCallback((character: Character): Record<string, number> => {
    // Primary attributes totals
    const forcaTotal = (character.forcaBase || 0) + (character.forcaBonus || 0);
    const destrezaTotal = (character.destrezaBase || 0) + (character.destrezaBonus || 0);
    const vitalidadeTotal = (character.vitalidadeBase || 0) + (character.vitalidadeBonus || 0);
    const aparenciaTotal = (character.aparenciaBase || 0) + (character.aparenciaBonus || 0);
    const conhecimentoTotal = (character.conhecimentoBase || 0) + (character.conhecimentoBonus || 0);
    const raciocinioTotal = (character.raciocinioBase || 0) + (character.raciocinioBonus || 0);
    const vontadeTotal = (character.vontadeBase || 0) + (character.vontadeBonus || 0);
    const destinoTotal = (character.destinoBase || 0) + (character.destinoBonus || 0);
    const velocidadeTotal = (character.velocidadeBase || 0) + (character.velocidadeBonus || 0);
    const resilienciaTotal = (character.resilienciaBase || 0) + (character.resilienciaBonus || 0);

    // Derived attributes base values
    const agilidadeBase = destrezaTotal + velocidadeTotal;
    const resistenciaBase = forcaTotal + resilienciaTotal;
    const persistenciaBase = conhecimentoTotal + vitalidadeTotal;
    const disciplinaBase = raciocinioTotal + vontadeTotal;
    const carismaBase = aparenciaTotal + destinoTotal;

    // Derived attributes totals
    const agilidadeTotal = agilidadeBase + (character.agilidadeBonus || 0);
    const resistenciaTotal = resistenciaBase + (character.resistenciaBonus || 0);
    const persistenciaTotal = persistenciaBase + (character.persistenciaBonus || 0);
    const disciplinaTotal = disciplinaBase + (character.disciplinaBonus || 0);
    const carismaTotal = carismaBase + (character.carismaBonus || 0);

    return {
      // Primary totals
      forcaTotal,
      destrezaTotal,
      vitalidadeTotal,
      aparenciaTotal,
      conhecimentoTotal,
      raciocinioTotal,
      vontadeTotal,
      destinoTotal,
      velocidadeTotal,
      resilienciaTotal,
      
      // Derived base values
      agilidadeBase,
      resistenciaBase,
      persistenciaBase,
      disciplinaBase,
      carismaBase,
      
      // Derived totals
      agilidadeTotal,
      resistenciaTotal,
      persistenciaTotal,
      disciplinaTotal,
      carismaTotal,
    };
  }, []);

  // Calculate combat information (CA, CD, Deslocamento)
  const calculateCombatInfo = useCallback((character: Character) => {
    const resistencia = (Number(character.forcaTotal) || 0) + (Number(character.resilienciaTotal) || 0) + (Number(character.resistenciaBonus) || 0);
    const agilidade = (Number(character.destrezaTotal) || 0) + (Number(character.velocidadeTotal) || 0) + (Number(character.agilidadeBonus) || 0);
    const persistencia = (Number(character.conhecimentoTotal) || 0) + (Number(character.vitalidadeTotal) || 0) + (Number(character.persistenciaBonus) || 0);
    const disciplina = (Number(character.raciocinioTotal) || 0) + (Number(character.vontadeTotal) || 0) + (Number(character.disciplinaBonus) || 0);

    // Calculate CA and CD correctly
    const classeAcerto = 1 + Math.max(resistencia, agilidade);
    const classeDificuldade = 1 + Math.max(persistencia, disciplina);
    
    // Cálculo correto do deslocamento baseado na tabela de Agilidade
    const calcularDeslocamento = (agilidade: number): string => {
      if (agilidade <= 0) return '1.5m p/min';
      if (agilidade >= 1 && agilidade <= 4) return '3m p/min';
      if (agilidade >= 5 && agilidade <= 9) return '15m p/min';
      if (agilidade >= 10 && agilidade <= 19) return '30m p/min';
      if (agilidade >= 20 && agilidade <= 39) return '60m p/min';
      if (agilidade >= 40) return '120m p/min';
      return '3m p/min';
    };
    
    const deslocamento = calcularDeslocamento(agilidade);

    return {
      classeAcerto,
      classeDificuldade,
      deslocamento,
    };
  }, []);

  // Calculate reserve dice based on attribute points
  const calculateReserves = useCallback((resistencia: number, persistencia: number) => {
    const calculateDiceForPoints = (points: number): string => {
      // Escala oficial (Resistência / Persistência) conforme tabela fornecida:
      // <0 => 0 | 0 => 1 | 1-2 => 1d2 | 3-4 => 1d4 | 5-6 => 1d6 | 7-8 => 1d8
      // 9-10 => 1d10 | 11-12 => 2d6 | 13-14 => 1d8 + 1d6 | 15-16 => 2d8
      // 17-18 => 1d10 + 1d8 | 19-20 => 2d10 | >20 (clamp) => 2d10
      if (points < 0) return '0';
      if (points === 0) return '1';
      if (points <= 2) return '1d2';
      if (points <= 4) return '1d4';
      if (points <= 6) return '1d6';
      if (points <= 8) return '1d8';
      if (points <= 10) return '1d10';
      if (points <= 12) return '2d6';
      if (points <= 14) return '1d8 + 1d6';
      if (points <= 16) return '2d8';
      if (points <= 18) return '1d10 + 1d8';
      // 19-20 e acima
      return '2d10';
    };

    return {
      reservaVidaDados: calculateDiceForPoints(resistencia),
      reservaVigorDados: calculateDiceForPoints(persistencia),
    };
  }, []);

  // Update health and vigor bars with injuries
  const updateHealthBars = useCallback((
    vidaAtual: number,
    vidaMax: number,
    vigorAtual: number,
    vigorMax: number,
    ferimentos: any[] = [],
    lesoes: any[] = []
  ) => {
    // Calculate damage reductions
    const reducaoVida = ferimentos.reduce((total, fer) => total + (fer.dano || 0), 0);
    const reducaoVigor = lesoes.reduce((total, les) => total + (les.dano || 0), 0);

    // Adjust maximum values
    const vidaMaxAjustada = Math.max(vidaMax - reducaoVida, 0);
    const vigorMaxAjustado = Math.max(vigorMax - reducaoVigor, 0);

    // Calculate current percentages
    const vidaPercentual = vidaMax > 0 ? (vidaAtual / vidaMax) * 100 : 0;
    const vigorPercentual = vigorMax > 0 ? (vigorAtual / vigorMax) * 100 : 0;

    return {
      vidaPercentual,
      vigorPercentual,
      vidaMaxAjustada,
      vigorMaxAjustado,
      reducaoVida,
      reducaoVigor,
    };
  }, []);

  return {
    calculateAttributes,
    calculateCombatInfo,
    calculateReserves,
    updateHealthBars,
  };
};