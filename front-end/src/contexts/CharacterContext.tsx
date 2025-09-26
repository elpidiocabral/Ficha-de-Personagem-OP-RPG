import React, { createContext, useContext, useEffect, useState } from 'react';
import { Character, CharacterContextType } from '../types';
import { useJSONHandler } from '../hooks/useJSONHandler';

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter deve ser usado dentro de um CharacterProvider');
  }
  return context;
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createDefaultCharacter = (): Omit<Character, 'id' | 'criadoEm' | 'atualizadoEm'> => ({
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
  classeAcerto: 1,
  classeDificuldade: 1,
  determinacao: 0,
  bonusMaestria: 1,
  sorte: 0,
  deslocamento: '3m',
  
  // Atributos principais - Base
  forcaBase: 0,
  destrezaBase: 0,
  vitalidadeBase: 0,
  aparenciaBase: 0,
  conhecimentoBase: 0,
  raciocinioBase: 0,
  vontadeBase: 0,
  destinoBase: 0,
  velocidadeBase: 0,
  resilienciaBase: 0,
  
  // Atributos principais - Bônus
  forcaBonus: 0,
  destrezaBonus: 0,
  vitalidadeBonus: 0,
  aparenciaBonus: 0,
  conhecimentoBonus: 0,
  raciocinioBonus: 0,
  vontadeBonus: 0,
  destinoBonus: 0,
  velocidadeBonus: 0,
  resilienciaBonus: 0,
  
  // Atributos principais - Total
  forcaTotal: 0,
  destrezaTotal: 0,
  vitalidadeTotal: 0,
  aparenciaTotal: 0,
  conhecimentoTotal: 0,
  raciocinioTotal: 0,
  vontadeTotal: 0,
  destinoTotal: 0,
  velocidadeTotal: 0,
  resilienciaTotal: 0,
  
  // Atributos derivados - Base
  agilidadeBase: 0,
  resistenciaBase: 0,
  persistenciaBase: 0,
  disciplinaBase: 0,
  carismaBase: 0,
  
  // Atributos derivados - Bônus
  agilidadeBonus: 0,
  resistenciaBonus: 0,
  persistenciaBonus: 0,
  disciplinaBonus: 0,
  carismaBonus: 0,
  
  // Atributos derivados - Total
  agilidadeTotal: 0,
  resistenciaTotal: 0,
  persistenciaTotal: 0,
  disciplinaTotal: 0,
  carismaTotal: 0,
  
  // Reservas
  reservaVidaQtd: 1,
  reservaVigorQtd: 1,
  
  // Ferimentos e Lesões
  localGolpe: '',
  danoFerimento: 0,
  ferimentosAtivos: 0,
  lesoesAtivas: 0,
  
  // Akuma no Mi
  akumaNome: '',
  akumaTipo: 'Paramecia',
  akumaSubtipo: '',
  akumaTematica: '',
  akumaDesejo: '',
  nivelFruta: 0,
  
  // Listas
  habilidades: [],
  frutaHabilidades: [],
  ataques: [],
  listaCompetencias: [],
  listaAptidoes: [],
  listaItens: [],
  ferimentos: [],
  lesoes: [],
  listaSessoes: [],
  
  // Novos campos unificados
  competenciasAptidoesTrunfos: [],
  pontosCompetenciaDisponiveis: 0,
  pontosAptidaoDisponiveis: 0,
  
  // Informações pessoais
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
  
  // Pontos para compra
  habilidadePontos: 0,
  habilidadeFrutaPontos: 0,
  competenciaPontos: 0,
  aptidaoPontos: 0,
  
  // Avatar
  avatarBase64: '',
});

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  // Default para 'dark' quando não há preferência salva
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Carregar tema do localStorage na inicialização (se existir)
  useEffect(() => {
    const savedTheme = localStorage.getItem('onePieceTheme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Se não houver, garante persistência do padrão 'dark'
      try {
        localStorage.setItem('onePieceTheme', 'dark');
        localStorage.setItem('temaRPG', 'escuro');
      } catch (e) {
        // não crítico
        console.warn('CharacterContext: não foi possível salvar tema padrão no localStorage', e);
      }
    }
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Salvar tema no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('onePieceTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Carregar personagens do localStorage na inicialização
  useEffect(() => {
    const savedCharacters = localStorage.getItem('onePieceCharacters');
    if (savedCharacters) {
      try {
        const parsed = JSON.parse(savedCharacters);
        setCharacters(parsed);
      } catch (error) {
        console.error('Erro ao carregar personagens:', error);
      }
    }
  }, []);

  // Salvar personagens no localStorage sempre que houver mudanças
  useEffect(() => {
    if (characters.length > 0) {
      localStorage.setItem('onePieceCharacters', JSON.stringify(characters));
    }
  }, [characters]);

  const createCharacter = (characterData: Omit<Character, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const now = new Date().toISOString();
    const newCharacter: Character = {
      ...characterData,
      id: generateId(),
      criadoEm: now,
      atualizadoEm: now,
    };

    setCharacters(prev => [...prev, newCharacter]);
    return newCharacter;
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(prev => 
      prev.map(char => 
        char.id === id 
          ? { ...char, ...updates, atualizadoEm: new Date().toISOString() }
          : char
      )
    );

    // Atualizar personagem atual se for o que está sendo editado
    if (currentCharacter?.id === id) {
      setCurrentCharacter(prev => prev ? { ...prev, ...updates, atualizadoEm: new Date().toISOString() } : prev);
    }
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
    if (currentCharacter?.id === id) {
      setCurrentCharacter(null);
    }
  };

  const duplicateCharacter = (id: string) => {
    const character = characters.find(char => char.id === id);
    if (character) {
      const { id: _, criadoEm: __, atualizadoEm: ___, ...characterData } = character;
      const duplicated = createCharacter({
        ...characterData,
        nome: `${character.nome} (Cópia)`,
      });
      return duplicated;
    }
  };

  const exportCharacter = (id: string) => {
    const character = characters.find(char => char.id === id);
    if (character) {
      const dataStr = JSON.stringify(character, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${character.nome.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ficha.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  // Use the JSON handler's sanitization to support legacy formats
  const { importCharacterFromJSON } = useJSONHandler();

  const importCharacter = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            // Delegate to the JSON handler which will normalize legacy structures
            importCharacterFromJSON(result, (sanitizedData: Character) => {
              // Ensure we don't keep the old id
              const { id: _, ...cleanData } = sanitizedData as any;
              createCharacter({
                ...createDefaultCharacter(),
                ...cleanData,
              });
              resolve();
            });
          } else {
            reject(new Error('Arquivo inválido ou corrompido'));
          }
        } catch (error) {
          reject(new Error('Arquivo inválido ou corrompido'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsText(file);
    });
  };

  const clearAllCharacters = () => {
    setCharacters([]);
    setCurrentCharacter(null);
    localStorage.removeItem('onePieceCharacters');
  };

  const value: CharacterContextType = {
    characters,
    currentCharacter,
    setCurrentCharacter,
    createCharacter,
    createDefaultCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    exportCharacter,
    importCharacter,
    clearAllCharacters,
    theme,
    toggleTheme,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};