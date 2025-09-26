import { useContext, useCallback, useEffect } from 'react';
// Update the import path if necessary, for example:
import { CharacterContext } from '../contexts/CharacterContext';
import { Character } from '../types';

interface UseCharacterDataReturn {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  saveCharacter: () => void;
  loadCharacterFromJSON: (jsonData: Partial<Character>) => void;
  exportCharacterAsJSON: () => string;
  resetCharacter: () => void;
}

export const useCharacterData = (): UseCharacterDataReturn => {
  const context = useContext(CharacterContext);

  if (!context || !('character' in context) || !('updateCharacter' in context)) {
    throw new Error('useCharacterData must be used within a CharacterProvider');
  }

  const { character, updateCharacter: contextUpdate } = context as {
    character: Character;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
  };

  // Update character with auto-save
  const updateCharacter = useCallback((updates: Partial<Character>) => {
    // Check if character has an 'id' property
    if (character.id) {
      contextUpdate(character.id, updates);
    }
  }, [contextUpdate, character.id]);

  // Save character to localStorage
  const saveCharacter = useCallback(() => {
    try {
      localStorage.setItem('fichaOnePiece', JSON.stringify(character));
      console.log('Character saved to localStorage');
    } catch (error) {
      console.error('Error saving character:', error);
    }
  }, [character]);

  // Load character from JSON data
  const loadCharacterFromJSON = useCallback((jsonData: Partial<Character>) => {
    try {
      const mergedData: Partial<Character> = {
        habilidades: jsonData.habilidades || character.habilidades || [],
        listaCompetencias: jsonData.listaCompetencias || character.listaCompetencias || [],
        listaAptidoes: jsonData.listaAptidoes || character.listaAptidoes || [],
        listaItens: jsonData.listaItens || character.listaItens || [],
        ferimentos: jsonData.ferimentos || character.ferimentos || [],
        lesoes: jsonData.lesoes || character.lesoes || [],
        listaSessoes: jsonData.listaSessoes || character.listaSessoes || [],
        
        // Novos campos unificados
        competenciasAptidoesTrunfos: jsonData.competenciasAptidoesTrunfos || character.competenciasAptidoesTrunfos || [],
        pontosCompetenciaDisponiveis: jsonData.pontosCompetenciaDisponiveis || character.pontosCompetenciaDisponiveis || 0,
        pontosAptidaoDisponiveis: jsonData.pontosAptidaoDisponiveis || character.pontosAptidaoDisponiveis || 0,
      };

      updateCharacter(mergedData);
      console.log('Character loaded from JSON data');
    } catch (error) {
      console.error('Error loading character from JSON:', error);
      alert('Erro ao importar personagem: ' + (error as Error).message);
    }
  }, [character, updateCharacter]);

  // Export character as JSON
  const exportCharacterAsJSON = useCallback((): string => {
    try {
      return JSON.stringify(character, null, 2);
    } catch (error) {
      console.error('Error exporting character:', error);
      return '{}';
    }
  }, [character]);

  // Reset character to default values
  const resetCharacter = useCallback(() => {
    const defaultCharacter: Character = {
      // Basic Info
      nome: '',
      raca: 'Humano',
      classe: 'Lutador',
      profissao: 'Combatente',
      potencial: 'Monstro',
      nivelClasse: 1,
      nivelProfissao: 1,

      // Status
      vidaAtual: 10,
      vidaMax: 10,
      vigorAtual: 6,
      vigorMax: 6,
      determinacao: 0,
      bonusMaestria: 1,
      sorte: 0,
      classeAcerto: 1,
      classeDificuldade: 1,
      deslocamento: '3m',
      
      // Primary Attributes
      forcaBase: 0,
      forcaBonus: 0,
      forcaTotal: 0,
      destrezaBase: 0,
      destrezaBonus: 0,
      destrezaTotal: 0,
      vitalidadeBase: 0,
      vitalidadeBonus: 0,
      vitalidadeTotal: 0,
      aparenciaBase: 0,
      aparenciaBonus: 0,
      aparenciaTotal: 0,
      conhecimentoBase: 0,
      conhecimentoBonus: 0,
      conhecimentoTotal: 0,
      raciocinioBase: 0,
      raciocinioBonus: 0,
      raciocinioTotal: 0,
      vontadeBase: 0,
      vontadeBonus: 0,
      vontadeTotal: 0,
      destinoBase: 0,
      destinoBonus: 0,
      destinoTotal: 0,
      velocidadeBase: 0,
      velocidadeBonus: 0,
      velocidadeTotal: 0,
      resilienciaBase: 0,
      resilienciaBonus: 0,
      resilienciaTotal: 0,
      
      // Derived Attributes
      agilidadeBase: 0,
      agilidadeBonus: 0,
      agilidadeTotal: 0,
      resistenciaBase: 0,
      resistenciaBonus: 0,
      resistenciaTotal: 0,
      persistenciaBase: 0,
      persistenciaBonus: 0,
      persistenciaTotal: 0,
      disciplinaBase: 0,
      disciplinaBonus: 0,
      disciplinaTotal: 0,
      carismaBase: 0,
      carismaBonus: 0,
      carismaTotal: 0,
      
      // Arrays
      habilidades: [],
      frutaHabilidades: [],
      listaCompetencias: [],
      listaAptidoes: [],
      listaItens: [],
      ferimentos: [],
      lesoes: [],
      listaSessoes: [],
      ataques: [],
      
      // Competências, Aptidões e Trunfos
      competenciasAptidoesTrunfos: [],
      pontosCompetenciaDisponiveis: 0,
      pontosAptidaoDisponiveis: 0,
      
      // Reserves
      reservaVidaQtd: 1,
      reservaVigorQtd: 1,
      
      // Ferimentos e Lesões
      localGolpe: '',
      danoFerimento: 0,
      ferimentosAtivos: 0,
      lesoesAtivas: 0,
      
      // Devil Fruit
      akumaNome: '',
      akumaTipo: 'Paramecia',
      akumaTematica: '',
      akumaDesejo: '',
      akumaSubtipo: '',
      nivelFruta: 0,
      
      // Personal Info
      ilhaOrigem: '',
      historia: '',
      sonho: '',
      pessoaImportante: '',
      objetivos: '',
      qualidades: '',
      habilidadeInutil: '',
      defeitos: '',
      reputacao: '',
      moral: '',
      bounty: '',
      dinheiro: '',
      anotacoesGerais: '',
      
      // Points
      habilidadePontos: 0,
      habilidadeFrutaPontos: 0,
      competenciaPontos: 0,
      aptidaoPontos: 0,
      
      // Avatar
      avatarBase64: ''
    };
    
    updateCharacter(defaultCharacter);
    console.log('Character reset to default values');
  }, [updateCharacter]);

  // Auto-save when character changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCharacter();
    }, 500); // Debounce save for 500ms

    return () => clearTimeout(timeoutId);
  }, [character, saveCharacter]);

  return {
    character,
    updateCharacter,
    saveCharacter,
    loadCharacterFromJSON,
    exportCharacterAsJSON,
    resetCharacter,
  };
};