export interface Character {
  // Informações básicas
  nome: string;
  raca: string;
  classe: string;
  profissao: string;
  potencial: string;
  nivelClasse: number;
  nivelProfissao: number;
  
  // Status
  vida?: number; // Para compatibilidade com JSON antigo
  vidaAtual: number;
  vidaMax: number;
  vigor?: number; // Para compatibilidade com JSON antigo
  vigorAtual: number;
  vigorMax: number;
  classeAcerto: number;
  classeDificuldade: number;
  determinacao: number;
  bonusMaestria: number;
  sorte: number;
  deslocamento: string;
  
  // Atributos principais - Base
  forcaBase: number;
  destrezaBase: number;
  vitalidadeBase: number;
  aparenciaBase: number;
  conhecimentoBase: number;
  raciocinioBase: number;
  vontadeBase: number;
  destinoBase: number;
  velocidadeBase: number;
  resilienciaBase: number;
  
  // Atributos principais - Bônus
  forcaBonus: number;
  destrezaBonus: number;
  vitalidadeBonus: number;
  aparenciaBonus: number;
  conhecimentoBonus: number;
  raciocinioBonus: number;
  vontadeBonus: number;
  destinoBonus: number;
  velocidadeBonus: number;
  resilienciaBonus: number;
  
  // Atributos principais - Total
  forcaTotal: number;
  destrezaTotal: number;
  vitalidadeTotal: number;
  aparenciaTotal: number;
  conhecimentoTotal: number;
  raciocinioTotal: number;
  vontadeTotal: number;
  destinoTotal: number;
  velocidadeTotal: number;
  resilienciaTotal: number;
  
  // Atributos derivados - Base
  agilidadeBase: number;
  resistenciaBase: number;
  persistenciaBase: number;
  disciplinaBase: number;
  carismaBase: number;
  
  // Atributos derivados - Bônus
  agilidadeBonus: number;
  resistenciaBonus: number;
  persistenciaBonus: number;
  disciplinaBonus: number;
  carismaBonus: number;
  
  // Atributos derivados - Total
  agilidadeTotal: number;
  resistenciaTotal: number;
  persistenciaTotal: number;
  disciplinaTotal: number;
  carismaTotal: number;
  
  // Reservas
  reservaVidaQtd: number;
  reservaVigorQtd: number;
  
  // Ferimentos e Lesões
  localGolpe?: string;
  danoFerimento?: number;
  ferimentosAtivos?: number; // Reduz vida máxima
  lesoesAtivas?: number; // Reduz vigor máximo
  
  // Akuma no Mi
  akumaNome: string;
  akumaTipo: string;
  akumaSubtipo: string;
  akumaTematica: string;
  akumaDesejo: string;
  nivelFruta: number;
  
  // Listas de habilidades e competências
  habilidades: Habilidade[];
  frutaHabilidades: Habilidade[];
  listaCompetencias: Competencia[];
  listaAptidoes: Competencia[];
  listaItens: Item[];
  ferimentos: Ferimento[];
  lesoes: Lesao[];
  listaSessoes: Sessao[];
  
  // Informações pessoais
  ilhaOrigem: string;
  historia: string;
  sonho: string;
  pessoaImportante: string;
  objetivos: string;
  qualidades: string;
  habilidadeInutil: string;
  defeitos: string;
  reputacao: string;
  moral: string;
  bounty: string;
  dinheiro: string;
  anotacoesGerais: string;
  
  // Ataques
  ataques: Ataque[];
  
  // Competências, Aptidões e Trunfos
  competenciasAptidoesTrunfos: CompetenciaAptidaoTrunfo[];
  pontosCompetenciaDisponiveis: number;
  pontosAptidaoDisponiveis: number;
  
  // Pontos para compra
  habilidadePontos: number;
  habilidadeFrutaPontos: number;
  competenciaPontos: number;
  aptidaoPontos: number;
  
  // Avatar
  avatarBase64: string;
  
  // Campos opcionais para compatibilidade
  id?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface Sessao {
  titulo: string;
  resumo: string;
}

export interface Competencia {
  nome: string;
  tipo: 'competencia' | 'aptidao' | 'trunfo';
  nivel: number;
  observacoes?: string;
}

export interface Habilidade {
  nome: string;
  custo: string;
  descricao: string;
  custoCompra?: string;
  alcance?: string;
  expanded?: boolean; // Para estado do accordion
  comprada?: boolean; // Para indicar se foi comprada
}

export interface Ataque {
  nome: string;
  bonus: string;
  dano: string;
}

export interface CompetenciaAptidaoTrunfo {
  nome: string;
  tipo: 'Competência' | 'Aptidão' | 'Trunfo';
  nivel: number;
  observacoes?: string;
  especializacao?: string;
}

export interface Item {
  nome: string;
  descricao: string;
  durabilidade?: string;
}

export interface Ferimento {
  local: string;
  dano: number;
}

export interface Lesao {
  local: string;
  dano: number;
}

export interface CharacterContextType {
  characters: Character[];
  currentCharacter: Character | null;
  setCurrentCharacter: (character: Character | null) => void;
  createCharacter: (character: Omit<Character, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  duplicateCharacter: (id: string) => void;
  exportCharacter: (id: string) => void;
  importCharacter: (file: File) => Promise<void>;
  clearAllCharacters: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}