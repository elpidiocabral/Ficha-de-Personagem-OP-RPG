import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Character } from '../../types';
import { useCalculations } from '../../hooks/useCalculations';
import { useJSONHandler } from '../../hooks/useJSONHandler';

interface AttributesTabProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

interface AttributeCardProps {
  title: string;
  acronym: string;
  baseValue: number;
  bonusValue: number;
  onBaseChange: (value: number) => void;
  onBonusChange: (value: number) => void;
}

const AttributeCard: React.FC<AttributeCardProps> = ({
  title,
  acronym,
  baseValue,
  bonusValue,
  onBaseChange,
  onBonusChange,
}) => {
  // Garantir que são números e fazer a soma correta
  const base = Number(baseValue) || 0;
  const bonus = Number(bonusValue) || 0;
  const total = base + bonus;

  return (
    <Card className="glass-card border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="pb-3 pt-4 px-4 relative z-10">
        <CardTitle className="text-base font-bold text-blue-700 dark:text-blue-300 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          {title} ({acronym})
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 relative z-10">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
            {total}
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mt-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium text-xs">Base</label>
            <Input
              type="number"
              value={base || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onBaseChange(isNaN(val) ? 0 : val);
              }}
              className="text-center h-8 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium text-xs">Bônus</label>
            <Input
              type="number"
              value={bonus || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onBonusChange(isNaN(val) ? 0 : val);
              }}
              className="text-center h-8 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DerivedAttributeCardProps {
  title: string;
  acronym: string;
  baseValue: number;
  bonusValue: number;
  formula: string;
  onBonusChange: (value: number) => void;
}

const DerivedAttributeCard: React.FC<DerivedAttributeCardProps> = ({
  title,
  baseValue,
  bonusValue,
  formula,
  onBonusChange,
}) => {
  // Garantir que são números e fazer a soma correta
  const base = Number(baseValue) || 0;
  const bonus = Number(bonusValue) || 0;
  const total = base + bonus;

  return (
    <Card className="glass-card border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="pb-2 pt-4 px-4 relative z-10">
        <CardTitle className="text-base font-bold text-green-700 dark:text-green-300 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {title}
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </CardTitle>
        <p className="text-xs text-center text-green-600 dark:text-green-400 font-medium bg-green-100/50 dark:bg-green-800/30 rounded-full px-2 py-1 mx-auto w-fit">{formula}</p>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 relative z-10">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">
            {total}
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto mt-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium text-xs">Base</label>
            <Input
              type="number"
              value={base}
              readOnly
              className="text-center h-8 text-sm bg-gray-100/80 dark:bg-gray-800/80 border border-green-200 dark:border-green-700 rounded-lg backdrop-blur-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium text-xs">Bônus</label>
            <Input
              type="number"
              value={bonus}
              onChange={(e) => onBonusChange(parseInt(e.target.value) || 0)}
              className="text-center h-8 text-sm border border-green-200 dark:border-green-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AttributesTab: React.FC<AttributesTabProps> = ({ character, onUpdate }) => {
  // Use hooks for data management and calculations
  const { calculateAttributes, calculateCombatInfo } = useCalculations();
  const { exportCharacterAsFile, importCharacterFromFile } = useJSONHandler();
  
  // State for file upload
  const [isImporting, setIsImporting] = useState(false);
  
  // States para os formulários
  const [novoItemTipo, setNovoItemTipo] = useState<'Competência' | 'Aptidão' | 'Trunfo'>('Competência');
  
  // States para controlar expansão dos benefícios
  const [expandedCompetencias, setExpandedCompetencias] = useState<Record<number, boolean>>({});
  const [expandedAptidoes, setExpandedAptidoes] = useState<Record<number, boolean>>({});

  // Funções para obter descrições dos benefícios
  const getBeneficioAptidao = (nivel: number): string => {
    const beneficios = {
      0: "Você tem desvantagem em testes dessa aptidão.",
      1: "Você faz o teste da aptidão sem desvantagem.",
      2: "Você adiciona seu bônus de Maestria em jogadas de teste para a aptidão.",
      3: "Você não perde Vigor ao realizar testes dessa aptidão.",
      4: "Seu bônus de Maestria é duplicado para essa aptidão.",
      5: "1x por dia, ao falhar em um teste dessa aptidão você pode escolher passar."
    };
    return beneficios[nivel as keyof typeof beneficios] || "";
  };

  const getBeneficioCompetencia = (nivel: number): string => {
    const beneficios = {
      0: "Você tem desvantagem ao usar essa arma/ferramenta e não pode somar seu bônus do Atributo relacionado.",
      1: "Você usa arma/ferramenta sem desvantagem e somando o Atributo relacionado.",
      2: "Você pode somar seu bônus de Maestria relacionado ao usar a arma/ferramenta.",
      3: "1x por combate/cena, ao falhar em um teste com essa arma/ferramenta você pode re-rolar o teste e ficar com o novo resultado.",
      4: "Você escolhe uma Especialização para essa arma/ferramenta da tabela de Especializações.",
      5: "Você usa 150% do Atributo relacionado no uso da arma/ferramenta (150% no Acerto e 100% no Dano)."
    };
    return beneficios[nivel as keyof typeof beneficios] || "";
  };

  // Função para obter todos os benefícios acumulados até o nível atual
  const getBeneficiosAcumulados = (nivelAtual: number, tipo: 'Competência' | 'Aptidão'): string[] => {
    const beneficios: string[] = [];
    
    for (let i = 0; i <= nivelAtual; i++) {
      let beneficio = "";
      if (tipo === 'Aptidão') {
        beneficio = getBeneficioAptidao(i);
      } else {
        beneficio = getBeneficioCompetencia(i);
      }
      
      if (beneficio) {
        beneficios.push(`Nível ${i}: ${beneficio}`);
      }
    }
    
    return beneficios;
  };

  const especializacoes = [
    { 
      nome: "Ataque Frenético", 
      descricao: "1x por combate, ao realizar uma ação de ataque você pode realizar um ataque adicional" 
    },
    { 
      nome: "Crítico 2.0", 
      descricao: "Ao invés de multiplicar os seus dados ao acertar um golpe crítico, você joga o dano normalmente e multiplica o resultado por 2" 
    },
    { 
      nome: "Crítico Supremo", 
      descricao: "A sua margem de crítico com essa arma diminui em 1, porém todos os ataques realizados com ela gastam 1d2 de vigor para serem executados" 
    },
    { 
      nome: "Pico de Poder", 
      descricao: "A sua escala de dano com essa arma aumenta em 1, porém todos os ataques realizados com ela gastam 1d2 de vigor para serem executados" 
    },
    { 
      nome: "Dano Maximum", 
      descricao: "1x por combate, ao acertar um ataque com essa arma que exigiu uma jogada de acerto, você pode escolher causar dano máximo ao invés de jogar os dados de dano" 
    },
    { 
      nome: "Golpe Pesado", 
      descricao: "Ao rolar para um ataque corpo-a-corpo com essa arma, você pode rolar novamente os dados de dano da arma e usar o resultado que quiser" 
    },
    { 
      nome: "Golpe de Desespero", 
      descricao: "Ao cair a 0 pontos de vida, e não tenha nenhum teste para voltar a 1, você pode executar um último ataque em quem o derrubou desde que esteja em posse desta arma" 
    },
    { 
      nome: "Raspão", 
      descricao: "Uma vez por turno, se você errar uma criatura com essa arma, causará dano igual a metade do modificador de atributo que usou para fazer a jogada" 
    },
    { 
      nome: "Manus Férrea", 
      descricao: "É impossível o desarmar. Mesmo que você esteja inconsciente é difícil lhe separar de sua arma/ferramenta" 
    }
  ];

  // Debug log para ver os dados recebidos
  console.log('AttributesTab recebeu character:', character);
  console.log('Character raca:', character.raca);
  console.log('Character classe:', character.classe);
  console.log('Character potencial:', character.potencial);
  console.log('Character profissao:', character.profissao);

  // Monitor character changes
  useEffect(() => {
    console.log('Character changed in AttributesTab:', character);
  }, [character]);

  // Função para calcular os dados de vida e vigor baseado na tabela
  const calcularDadosVitalidade = (pontos: number): string => {
    if (pontos < 0) return '0';
    if (pontos === 0) return '1';
    if (pontos >= 1 && pontos <= 2) return '1d2';
    if (pontos >= 3 && pontos <= 4) return '1d4';
    if (pontos >= 5 && pontos <= 6) return '1d6';
    if (pontos >= 7 && pontos <= 8) return '1d8';
    if (pontos >= 9 && pontos <= 10) return '1d10';
    if (pontos >= 11 && pontos <= 12) return '2d6';
    if (pontos >= 13 && pontos <= 14) return '1d8 + 1d6';
    if (pontos >= 15 && pontos <= 16) return '2d8';
    if (pontos >= 17 && pontos <= 18) return '1d10 + 1d8';
    if (pontos >= 19 && pontos <= 20) return '2d10';
    return '2d10'; // Para valores acima de 20
  };

  // Handle JSON import
  const handleImportJSON = () => {
    setIsImporting(true);
    importCharacterFromFile((importedData) => {
      console.log('Dados importados no handleImportJSON:', importedData);
      onUpdate(importedData);
      setIsImporting(false);
    });
  };

  // Handle JSON export
  const handleExportJSON = () => {
    exportCharacterAsFile(character);
  };

  // Update attribute handler
  const handleAttributeUpdate = (field: keyof Character, value: any) => {
    console.log(`🔄 handleAttributeUpdate chamado - Campo: ${field}, Valor:`, value);
    
    // Garantir que valores numéricos sejam convertidos corretamente
    const numericFields = [
      'forcaBase', 'forcaBonus', 'forcaTotal',
      'destrezaBase', 'destrezaBonus', 'destrezaTotal',
      'vitalidadeBase', 'vitalidadeBonus', 'vitalidadeTotal',
      'aparenciaBase', 'aparenciaBonus', 'aparenciaTotal',
      'conhecimentoBase', 'conhecimentoBonus', 'conhecimentoTotal',
      'raciocinioBase', 'raciocinioBonus', 'raciocinioTotal',
      'vontadeBase', 'vontadeBonus', 'vontadeTotal',
      'destinoBase', 'destinoBonus', 'destinoTotal',
      'velocidadeBase', 'velocidadeBonus', 'velocidadeTotal',
      'resilienciaBase', 'resilienciaBonus', 'resilienciaTotal',
      'reservaVidaQtd', 'reservaVigorQtd', 'danoFerimento', 'ferimentosAtivos', 'lesoesAtivas',
      'nivelClasse', 'nivelProfissao', 'vidaAtual', 'vidaMax', 'vigorAtual', 'vigorMax'
    ];
    
    let updateData: any;
    
    if (numericFields.includes(field as string)) {
      // Converter para número e garantir que seja um inteiro válido
      const numValue = parseInt(String(value)) || 0;
      updateData = { [field]: numValue };
    } else {
      // Para campos de string, usar o valor diretamente
      updateData = { [field]: value };
    }
    
    // Se for um campo de atributo base ou bonus, recalcular tudo em uma única chamada
    const isAttributeField = field.toString().includes('Base') || field.toString().includes('Bonus');
    if (isAttributeField) {
      // Criar personagem temporário com a mudança aplicada
      const tempCharacter = { ...character, ...updateData };
      
      // Calcular atributos derivados baseado no personagem temporário
      const calculatedAttributes = calculateAttributes(tempCharacter);
      const combatInfo = calculateCombatInfo(tempCharacter);
      
      // Calcular totais
      const updatedTotals = {
        forcaTotal: (Number(tempCharacter.forcaBase) || 0) + (Number(tempCharacter.forcaBonus) || 0),
        destrezaTotal: (Number(tempCharacter.destrezaBase) || 0) + (Number(tempCharacter.destrezaBonus) || 0),
        vitalidadeTotal: (Number(tempCharacter.vitalidadeBase) || 0) + (Number(tempCharacter.vitalidadeBonus) || 0),
        aparenciaTotal: (Number(tempCharacter.aparenciaBase) || 0) + (Number(tempCharacter.aparenciaBonus) || 0),
        conhecimentoTotal: (Number(tempCharacter.conhecimentoBase) || 0) + (Number(tempCharacter.conhecimentoBonus) || 0),
        raciocinioTotal: (Number(tempCharacter.raciocinioBase) || 0) + (Number(tempCharacter.raciocinioBonus) || 0),
        vontadeTotal: (Number(tempCharacter.vontadeBase) || 0) + (Number(tempCharacter.vontadeBonus) || 0),
        destinoTotal: (Number(tempCharacter.destinoBase) || 0) + (Number(tempCharacter.destinoBonus) || 0),
        velocidadeTotal: (Number(tempCharacter.velocidadeBase) || 0) + (Number(tempCharacter.velocidadeBonus) || 0),
        resilienciaTotal: (Number(tempCharacter.resilienciaBase) || 0) + (Number(tempCharacter.resilienciaBonus) || 0),
      };
      
      // Atualizar tudo de uma vez
      console.log('📊 Atualizando atributos calculados:', {
        ...updateData,
        ...updatedTotals,
        ...calculatedAttributes,
        ...combatInfo,
      });
      onUpdate({
        ...updateData,
        ...updatedTotals,
        ...calculatedAttributes,
        ...combatInfo,
      });
    } else {
      // Para campos não relacionados a atributos, apenas atualizar o campo
      console.log('🔧 Atualizando campo não-atributo:', updateData);
      onUpdate(updateData);
    }
  };

  // Calcular atributos derivados usando os valores base + bonus diretamente
  const forcaTotal = (Number(character.forcaBase) || 0) + (Number(character.forcaBonus) || 0);
  const destrezaTotal = (Number(character.destrezaBase) || 0) + (Number(character.destrezaBonus) || 0);
  const vitalidadeTotal = (Number(character.vitalidadeBase) || 0) + (Number(character.vitalidadeBonus) || 0);
  const aparenciaTotal = (Number(character.aparenciaBase) || 0) + (Number(character.aparenciaBonus) || 0);
  const conhecimentoTotal = (Number(character.conhecimentoBase) || 0) + (Number(character.conhecimentoBonus) || 0);
  const raciocinioTotal = (Number(character.raciocinioBase) || 0) + (Number(character.raciocinioBonus) || 0);
  const vontadeTotal = (Number(character.vontadeBase) || 0) + (Number(character.vontadeBonus) || 0);
  const destinoTotal = (Number(character.destinoBase) || 0) + (Number(character.destinoBonus) || 0);
  const velocidadeTotal = (Number(character.velocidadeBase) || 0) + (Number(character.velocidadeBonus) || 0);
  const resilienciaTotal = (Number(character.resilienciaBase) || 0) + (Number(character.resilienciaBonus) || 0);
  
  const agilidade = destrezaTotal + velocidadeTotal;
  const resistencia = forcaTotal + resilienciaTotal;
  const persistencia = conhecimentoTotal + vitalidadeTotal;
  const disciplina = raciocinioTotal + vontadeTotal;
  const carisma = aparenciaTotal + destinoTotal;

  const agilidadeTotal = agilidade + (Number(character.agilidadeBonus) || 0);
  const resistenciaTotal = resistencia + (Number(character.resistenciaBonus) || 0);
  const persistenciaTotal = persistencia + (Number(character.persistenciaBonus) || 0);
  const disciplinaTotal = disciplina + (Number(character.disciplinaBonus) || 0);

  // Cálculo dos dados de vida e vigor
  const dadosVida = calcularDadosVitalidade(vitalidadeTotal);
  const dadosVigor = calcularDadosVitalidade(vontadeTotal);

  const classeAcerto = 1 + Math.max(resistenciaTotal, agilidadeTotal);
  const classeDificuldade = 1 + Math.max(persistenciaTotal, disciplinaTotal);
  
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
  
  const deslocamento = calcularDeslocamento(agilidadeTotal);

  // Funções para Ferimentos e Lesões
  const aplicarFerimento = () => {
    const dano = Number(character.danoFerimento) || 0;
    if (dano > 0) {
      const novosFerimentos = (character.ferimentosAtivos || 0) + dano;
      // Reduz a vida atual se ela for maior que a nova vida máxima
      const novaVidaMax = Math.max(1, character.vidaMax - novosFerimentos);
      const novaVidaAtual = Math.min(character.vidaAtual, novaVidaMax);
      
      onUpdate({ 
        ferimentosAtivos: novosFerimentos,
        vidaAtual: novaVidaAtual,
        danoFerimento: 0,
        localGolpe: ''
      });
    }
  };

  const aplicarLesao = () => {
    const dano = Number(character.danoFerimento) || 0;
    if (dano > 0) {
      const novasLesoes = (character.lesoesAtivas || 0) + dano;
      // Reduz o vigor atual se ele for maior que o novo vigor máximo
      const novoVigorMax = Math.max(1, character.vigorMax - novasLesoes);
      const novoVigorAtual = Math.min(character.vigorAtual, novoVigorMax);
      
      onUpdate({ 
        lesoesAtivas: novasLesoes,
        vigorAtual: novoVigorAtual,
        danoFerimento: 0,
        localGolpe: ''
      });
    }
  };

  const curarFerimentos = () => {
    onUpdate({ 
      ferimentosAtivos: 0
    });
  };

  const curarLesoes = () => {
    onUpdate({ 
      lesoesAtivas: 0
    });
  };

  // Cálculos de vida e vigor ajustados por ferimentos e lesões
  const vidaMaxAjustada = Math.max(1, character.vidaMax - (character.ferimentosAtivos || 0));
  const vigorMaxAjustado = Math.max(1, character.vigorMax - (character.lesoesAtivas || 0));

  const handleHealthUpdate = (field: 'vidaAtual' | 'vigorAtual', value: number) => {
    const maxField = field === 'vidaAtual' ? 'vidaMax' : 'vigorMax';
    const maxValue = character[maxField];
    const clampedValue = Math.max(0, Math.min(value, maxValue));
    onUpdate({ [field]: clampedValue });
  };

  const handleMaxHealthUpdate = (field: 'vidaMax' | 'vigorMax', value: number) => {
    const currentField = field === 'vidaMax' ? 'vidaAtual' : 'vigorAtual';
    const currentValue = character[currentField];
    const updates: Partial<Character> = { [field]: Math.max(1, value) };
    
    // Ajustar valor atual se exceder o novo máximo
    if (currentValue > value) {
      updates[currentField] = value;
    }
    
    onUpdate(updates);
  };

  const resetToMax = () => {
    onUpdate({
      vidaAtual: character.vidaMax,
      vigorAtual: character.vigorMax,
    });
  };

  // Definir listas de opções
  const racas = ['Humano', 'Humano-Peixe', 'Tritão', 'Mink', 'Povo do Céu', 'Anão Tontatta'];
  const potenciais = ['Desastre Sobrenatural', 'Monstro', 'Sobre-Humano', 'Humano', 'Ciborgue'];
  const classes = ['Lutador', 'Guerrilheiro', 'Artista Marcial', 'Espadachim', 'Atirador', 'Especialista', 'Assassino', 'Ladrão'];
  const profissoes = ['Capitão', 'Imediato', 'Navegador', 'Cozinheiro', 'Médico', 'Arqueólogo', 'Carpinteiro', 'Músico', 'Atirador', 'Outro'];

  return (
    <div className="space-y-6">
      {/* Layout com informações compactas à esquerda e atributos à direita */}
      <div className="grid grid-cols-12 gap-6">
        {/* Coluna da esquerda - Informações + Vida e Vigor */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Informações do Personagem */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 relative z-10">
              {/* Avatar no topo */}
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-500 shadow-xl mb-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse opacity-20"></div>
                  <img 
                    src={character.avatarBase64 || "/api/placeholder/96/96"} 
                    alt="Avatar do Personagem"
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          handleAttributeUpdate('avatarBase64', base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      Escolher Imagem
                    </span>
                  </Button>
                  {character.avatarBase64 && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="text-xs px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleAttributeUpdate('avatarBase64', '')}
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Remover
                      </span>
                    </Button>
                  )}
                </div>
                
                {/* Botões de Import/Export JSON */}
                <div className="mt-3 pt-3 border-t border-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600">
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      onClick={handleImportJSON}
                      disabled={isImporting}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                        {isImporting ? 'Importando...' : 'Importar JSON'}
                      </span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleExportJSON}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-xs px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Exportar JSON
                      </span>
                    </Button>

                  </div>
          
                </div>
              </div>

              {/* Nome do Personagem */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Nome do Personagem</label>
                <Input
                  value={character.nome}
                  onChange={(e) => handleAttributeUpdate('nome', e.target.value as any)}
                  placeholder="Digite o nome"
                  className="h-8 text-sm"
                />
              </div>

              {/* Linha 1: Raça, Classe */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Raça</label>
                  <Select value={character.raca || 'Humano'} onValueChange={(value) => handleAttributeUpdate('raca', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Selecione uma raça" />
                    </SelectTrigger>
                    <SelectContent>
                      {racas.map((raca) => (
                        <SelectItem key={raca} value={raca}>
                          {raca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Classe</label>
                  <Select value={character.classe || 'Lutador'} onValueChange={(value) => handleAttributeUpdate('classe', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Selecione uma classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classe) => (
                        <SelectItem key={classe} value={classe}>
                          {classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Linha 2: Potencial, Profissão */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Potencial</label>
                  <Select value={character.potencial || 'Monstro'} onValueChange={(value) => handleAttributeUpdate('potencial', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Selecione um potencial" />
                    </SelectTrigger>
                    <SelectContent>
                      {potenciais.map((potencial) => (
                        <SelectItem key={potencial} value={potencial}>
                          {potencial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Profissão</label>
                  <Select value={character.profissao || 'Outro'} onValueChange={(value) => handleAttributeUpdate('profissao', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Selecione uma profissão" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissoes.map((profissao) => (
                        <SelectItem key={profissao} value={profissao}>
                          {profissao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Linha 3: Níveis */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Nível Classe</label>
                  <Input
                    type="number"
                    value={character.nivelClasse}
                    onChange={(e) => handleAttributeUpdate('nivelClasse', parseInt(e.target.value) || 1)}
                    min="1"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Nível</label>
                  <Input
                    type="number"
                    value={2}
                    className="h-8 text-sm"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Vida e Vigor - EMBAIXO das informações */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-orange-50/20 to-green-50/30 dark:from-red-900/10 dark:via-orange-900/10 dark:to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-green-400 rounded-full animate-pulse"></span>
                Vida e Vigor
                <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-green-400 rounded-full animate-pulse"></span>
              </CardTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 via-orange-400 to-green-400 rounded-full mx-auto"></div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 relative z-10">
              {/* Vida */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-heartbeat"></span>
                    Vida
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Atual</span>
                    <Input
                      type="number"
                      value={character.vidaAtual}
                      onChange={(e) => handleHealthUpdate('vidaAtual', parseInt(e.target.value) || 0)}
                      min="0"
                      max={vidaMaxAjustada}
                      className="w-16 h-8 text-center text-sm"
                    />
                    <span>/</span>
                    <span className="text-gray-600 dark:text-gray-400">{vidaMaxAjustada}</span>
                    <span className="text-xs text-gray-500">({character.vidaMax} base)</span>
                    <Input
                      type="number"
                      value={character.vidaMax}
                      onChange={(e) => handleMaxHealthUpdate('vidaMax', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-16 h-8 text-center text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
                {/* Dados de Vida */}
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-1 border border-red-200 dark:border-red-700">
                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                      🎲 Dados de Vida: <span className="font-bold">{dadosVida}</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-red-200 dark:bg-red-900 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(5, Math.min((character.vidaAtual / vidaMaxAjustada) * 100, 100))}%`,
                    }}
                  />
                </div>
              </div>
              
              {/* Vigor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400">Vigor</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span>Atual</span>
                    <Input
                      type="number"
                      value={character.vigorAtual}
                      onChange={(e) => handleHealthUpdate('vigorAtual', parseInt(e.target.value) || 0)}
                      min="0"
                      max={vigorMaxAjustado}
                      className="w-16 h-8 text-center text-sm"
                    />
                    <span>/</span>
                    <span className="text-gray-600 dark:text-gray-400">{vigorMaxAjustado}</span>
                    <span className="text-xs text-gray-500">({character.vigorMax} base)</span>
                    <Input
                      type="number"
                      value={character.vigorMax}
                      onChange={(e) => handleMaxHealthUpdate('vigorMax', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-16 h-8 text-center text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
                {/* Dados de Vigor */}
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg px-3 py-1 border border-green-200 dark:border-green-700">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      🎲 Dados de Vigor: <span className="font-bold">{dadosVigor}</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(5, Math.min((character.vigorAtual / vigorMaxAjustado) * 100, 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Aplicar Dano ou Gastar Vigor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Aplicar Dano ou Gastar Vigor</label>
                <Input
                  type="number"
                  placeholder="Quantidade"
                  className="h-8 text-sm mb-2"
                  id="danoInput"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600 text-white flex-1"
                    onClick={() => {
                      const input = document.getElementById('danoInput') as HTMLInputElement;
                      const dano = parseInt(input.value) || 0;
                      if (dano > 0) {
                        handleHealthUpdate('vidaAtual', character.vidaAtual - dano);
                        input.value = '';
                      }
                    }}
                  >
                    Receber Dano
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    onClick={() => {
                      const input = document.getElementById('danoInput') as HTMLInputElement;
                      const vigor = parseInt(input.value) || 0;
                      if (vigor > 0) {
                        handleHealthUpdate('vigorAtual', character.vigorAtual - vigor);
                        input.value = '';
                      }
                    }}
                  >
                    Gastar Vigor
                  </Button>
                </div>
              </div>

              {/* Recuperar Vida ou Vigor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Recuperar Vida ou Vigor</label>
                <Input
                  type="number"
                  placeholder="Quantidade"
                  className="h-8 text-sm mb-2"
                  id="curaInput"
                />
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2"
                    onClick={() => {
                      const input = document.getElementById('curaInput') as HTMLInputElement;
                      const cura = parseInt(input.value) || 0;
                      if (cura > 0) {
                        handleHealthUpdate('vidaAtual', character.vidaAtual + cura);
                        input.value = '';
                      }
                    }}
                  >
                    Curar Vida
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2"
                    onClick={() => {
                      const input = document.getElementById('curaInput') as HTMLInputElement;
                      const vigor = parseInt(input.value) || 0;
                      if (vigor > 0) {
                        handleHealthUpdate('vigorAtual', character.vigorAtual + vigor);
                        input.value = '';
                      }
                    }}
                  >
                    Recuperar Vigor
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2"
                    onClick={resetToMax}
                  >
                    Recuperar Tudo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Ferimentos e Lesões / Reservas */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/20 to-blue-50/30 dark:from-orange-900/10 dark:via-red-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-lg text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></span>
                Ferimentos e Lesões
                <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Local do Golpe
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Braço esquerdo"
                    className="text-sm border-orange-200 dark:border-orange-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    value={character.localGolpe || ''}
                    onChange={(e) => handleAttributeUpdate('localGolpe', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                    Dano
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 5"
                    className="text-sm"
                    value={character.danoFerimento || ''}
                    onChange={(e) => handleAttributeUpdate('danoFerimento', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={aplicarFerimento}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Ferimento
                  </span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={aplicarLesao}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Lesão
                  </span>
                </Button>
              </div>

              {/* Indicadores de Ferimentos e Lesões Ativos */}
              {((character.ferimentosAtivos || 0) > 0 || (character.lesoesAtivas || 0) > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⚠️ Status Atual</h4>
                  {(character.ferimentosAtivos || 0) > 0 && (
                    <div className="flex items-center justify-between bg-red-100 dark:bg-red-900/30 rounded p-2">
                      <span className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Ferimentos: -{character.ferimentosAtivos} Vida Máx
                      </span>
                      <Button 
                        size="sm" 
                        onClick={curarFerimentos}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-6"
                      >
                        Curar
                      </Button>
                    </div>
                  )}
                  {(character.lesoesAtivas || 0) > 0 && (
                    <div className="flex items-center justify-between bg-orange-100 dark:bg-orange-900/30 rounded p-2">
                      <span className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        Lesões: -{character.lesoesAtivas} Vigor Máx
                      </span>
                      <Button 
                        size="sm" 
                        onClick={curarLesoes}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-6"
                      >
                        Curar
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Divisor */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  Reservas de Vida e Vigor
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Reserva de Vida */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      Reserva de Vida
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Baseado em: Resistência
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Quantidade</div>
                        <Input
                          type="number"
                          value={character.reservaVidaQtd || 0}
                          onChange={(e) => handleAttributeUpdate('reservaVidaQtd', parseInt(e.target.value) || 0)}
                          className="text-center h-8 w-12 text-sm"
                          min="0"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Dados</div>
                        <div className="bg-blue-500 text-white rounded px-3 py-1 text-sm font-bold">
                          1d6
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reserva de Vigor */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      Reserva de Vigor
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Baseado em: Persistência
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Quantidade</div>
                        <Input
                          type="number"
                          value={character.reservaVigorQtd || 0}
                          onChange={(e) => handleAttributeUpdate('reservaVigorQtd', parseInt(e.target.value) || 0)}
                          className="text-center h-8 w-12 text-sm"
                          min="0"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Dados</div>
                        <div className="bg-blue-500 text-white rounded px-3 py-1 text-sm font-bold">
                          1d6
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Combate - EMBAIXO da Vida e Vigor */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-blue-50/30 dark:from-purple-900/10 dark:via-indigo-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-lg text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-pulse"></span>
                Informações de Combate
                <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-pulse"></span>
              </CardTitle>
              <div className="w-16 h-1 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
                    Classe de Acerto (CA)
                  </label>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {classeAcerto}
                  </div>
                  <div className="w-12 h-1 bg-purple-500 rounded-full mx-auto"></div>
                </div>
                <div className="text-center">
                  <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
                    Classe de Dificuldade (CD)
                  </label>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {classeDificuldade}
                  </div>
                  <div className="w-12 h-1 bg-purple-500 rounded-full mx-auto"></div>
                </div>
              </div>
              
              <div className="text-center">
                <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
                  Deslocamento
                </label>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {deslocamento}
                </div>
                <div className="w-16 h-1 bg-purple-500 rounded-full mx-auto"></div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div>CA: 1 + Maior entre Resistência ({resistenciaTotal}) e Agilidade ({agilidadeTotal})</div>
                <div>CD: 1 + Maior entre Persistência ({persistenciaTotal}) e Disciplina ({disciplinaTotal})</div>
                <div>Deslocamento: Baseado na tabela de Agilidade ({agilidadeTotal})</div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Atributos - 8 colunas (2/3 da tela) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">

      {/* Atributos Principais */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Atributos Principais
          </h2>
          <div className="w-24 h-1 bg-blue-500 rounded-full mx-auto mb-4"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <AttributeCard
            title="Força"
            acronym="FOR"
            baseValue={character.forcaBase}
            bonusValue={character.forcaBonus}
            onBaseChange={(value) => handleAttributeUpdate('forcaBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('forcaBonus', value)}
          />
          <AttributeCard
            title="Vitalidade"
            acronym="VIT"
            baseValue={character.vitalidadeBase}
            bonusValue={character.vitalidadeBonus}
            onBaseChange={(value) => handleAttributeUpdate('vitalidadeBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('vitalidadeBonus', value)}
          />
          <AttributeCard
            title="Conhecimento"
            acronym="CON"
            baseValue={character.conhecimentoBase}
            bonusValue={character.conhecimentoBonus}
            onBaseChange={(value) => handleAttributeUpdate('conhecimentoBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('conhecimentoBonus', value)}
          />
          <AttributeCard
            title="Vontade"
            acronym="VON"
            baseValue={character.vontadeBase}
            bonusValue={character.vontadeBonus}
            onBaseChange={(value) => handleAttributeUpdate('vontadeBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('vontadeBonus', value)}
          />
          <AttributeCard
            title="Velocidade"
            acronym="VELO"
            baseValue={character.velocidadeBase}
            bonusValue={character.velocidadeBonus}
            onBaseChange={(value) => handleAttributeUpdate('velocidadeBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('velocidadeBonus', value)}
          />
          <AttributeCard
            title="Destreza"
            acronym="DESTR"
            baseValue={character.destrezaBase}
            bonusValue={character.destrezaBonus}
            onBaseChange={(value) => handleAttributeUpdate('destrezaBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('destrezaBonus', value)}
          />
          <AttributeCard
            title="Aparência"
            acronym="APA"
            baseValue={character.aparenciaBase}
            bonusValue={character.aparenciaBonus}
            onBaseChange={(value) => handleAttributeUpdate('aparenciaBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('aparenciaBonus', value)}
          />
          <AttributeCard
            title="Raciocínio"
            acronym="RAC"
            baseValue={character.raciocinioBase}
            bonusValue={character.raciocinioBonus}
            onBaseChange={(value) => handleAttributeUpdate('raciocinioBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('raciocinioBonus', value)}
          />
          <AttributeCard
            title="Destino"
            acronym="DESTI"
            baseValue={character.destinoBase}
            bonusValue={character.destinoBonus}
            onBaseChange={(value) => handleAttributeUpdate('destinoBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('destinoBonus', value)}
          />
          <AttributeCard
            title="Resiliência"
            acronym="RESI"
            baseValue={character.resilienciaBase}
            bonusValue={character.resilienciaBonus}
            onBaseChange={(value) => handleAttributeUpdate('resilienciaBase', value)}
            onBonusChange={(value) => handleAttributeUpdate('resilienciaBonus', value)}
          />
        </div>
      </div>

      {/* Atributos Derivados */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
            Atributos Derivados
          </h2>
          <div className="w-24 h-1 bg-green-500 rounded-full mx-auto mb-4"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <DerivedAttributeCard
            title="Persistência"
            acronym="PERS"
            baseValue={persistencia}
            bonusValue={Number(character.persistenciaBonus) || 0}
            formula="Conhecimento + Vitalidade"
            onBonusChange={(value) => handleAttributeUpdate('persistenciaBonus', value)}
          />
          <DerivedAttributeCard
            title="Disciplina"
            acronym="DISC"
            baseValue={disciplina}
            bonusValue={Number(character.disciplinaBonus) || 0}
            formula="Raciocínio + Vontade"
            onBonusChange={(value) => handleAttributeUpdate('disciplinaBonus', value)}
          />
          <DerivedAttributeCard
            title="Carisma"
            acronym="CAR"
            baseValue={carisma}
            bonusValue={Number(character.carismaBonus) || 0}
            formula="Aparência + Destino"
            onBonusChange={(value) => handleAttributeUpdate('carismaBonus', value)}
          />
          <DerivedAttributeCard
            title="Agilidade"
            acronym="AGI"
            baseValue={agilidade}
            bonusValue={Number(character.agilidadeBonus) || 0}
            formula="Destreza + Velocidade"
            onBonusChange={(value) => handleAttributeUpdate('agilidadeBonus', value)}
          />
          <DerivedAttributeCard
            title="Resistência"
            acronym="RES"
            baseValue={resistencia}
            bonusValue={Number(character.resistenciaBonus) || 0}
            formula="Força + Resiliência"
            onBonusChange={(value) => handleAttributeUpdate('resistenciaBonus', value)}
          />
        </div>
      </div>

      {/* Card de Ataques */}
      <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-orange-50/20 to-yellow-50/30 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
            <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-pulse"></span>
            Ataques
            <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-pulse"></span>
          </CardTitle>
          <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mx-auto"></div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          {/* Formulário para adicionar novo ataque */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <div>
              <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                Nome do Ataque
              </label>
              <Input
                type="text"
                placeholder="Ex: Ataque com Katana..."
                className="text-sm border-red-200 dark:border-red-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                id="novo-ataque-nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                Bônus de Acerto
              </label>
              <Input
                type="text"
                placeholder="+10"
                className="text-sm border-red-200 dark:border-red-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                id="novo-ataque-bonus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                Dano
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: 1d8+10 Perfurante"
                  className="text-sm border-red-200 dark:border-red-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                  id="novo-ataque-dano"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const nomeInput = document.getElementById('novo-ataque-nome') as HTMLInputElement;
                    const bonusInput = document.getElementById('novo-ataque-bonus') as HTMLInputElement;
                    const danoInput = document.getElementById('novo-ataque-dano') as HTMLInputElement;
                    
                    if (nomeInput?.value && bonusInput?.value && danoInput?.value) {
                      const novosAtaques = [...(character.ataques || []), {
                        nome: nomeInput.value,
                        bonus: bonusInput.value,
                        dano: danoInput.value
                      }];
                      
                      handleAttributeUpdate('ataques', novosAtaques);
                      
                      // Limpar campos
                      nomeInput.value = '';
                      bonusInput.value = '';
                      danoInput.value = '';
                      
                      console.log('Ataque adicionado:', novosAtaques);
                    } else {
                      alert('Preencha todos os campos do ataque!');
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Adicionar
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de ataques */}
          <div className="space-y-2">
            {character.ataques && character.ataques.length > 0 ? (
              character.ataques.map((ataque, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                        {ataque.nome}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        Bônus: {ataque.bonus}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Dano: {ataque.dano}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const novosAtaques = character.ataques.filter((_, i) => i !== index);
                      handleAttributeUpdate('ataques', novosAtaques);
                    }}
                    className="ml-3 h-8 w-20 text-xs bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Remover
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 dark:text-gray-600 text-sm">
                  Nenhum ataque cadastrado
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Use o formulário acima para adicionar ataques
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card de Competências / Aptidões / Trunfos */}
      <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
            <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></span>
            Competências / Aptidões / Trunfos
            <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></span>
          </CardTitle>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {/* Seção de Pontos e Adicionar Novo */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Pontos Disponíveis e Adicionar Novo
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </h3>
            
            {/* Pontos Disponíveis */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Pontos de Competência Disponíveis
                </label>
                <Input
                  type="number"
                  value={character.pontosCompetenciaDisponiveis || 0}
                  onChange={(e) => handleAttributeUpdate('pontosCompetenciaDisponiveis', parseInt(e.target.value) || 0)}
                  className="text-center h-8 text-sm border border-blue-200 dark:border-blue-700"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Pontos de Aptidão Disponíveis
                </label>
                <Input
                  type="number"
                  value={character.pontosAptidaoDisponiveis || 0}
                  onChange={(e) => handleAttributeUpdate('pontosAptidaoDisponiveis', parseInt(e.target.value) || 0)}
                  className="text-center h-8 text-sm border border-blue-200 dark:border-blue-700"
                  min="0"
                />
              </div>
            </div>

            {/* Formulário para adicionar novo item */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Combate Desarmado"
                  className="text-sm border-blue-200 dark:border-blue-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  id="novo-item-nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Tipo
                </label>
                <Select value={novoItemTipo} onValueChange={(value: 'Competência' | 'Aptidão' | 'Trunfo') => setNovoItemTipo(value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Competência">Competência</SelectItem>
                    <SelectItem value="Aptidão">Aptidão</SelectItem>
                    <SelectItem value="Trunfo">Trunfo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Nível
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  className="text-sm border-blue-200 dark:border-blue-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center h-8"
                  id="novo-item-nivel"
                />
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  onClick={() => {
                    const nomeInput = document.getElementById('novo-item-nome') as HTMLInputElement;
                    const nivelInput = document.getElementById('novo-item-nivel') as HTMLInputElement;
                    const observacoesTextarea = document.getElementById('novo-item-observacoes') as HTMLTextAreaElement;
                    
                    if (nomeInput?.value && novoItemTipo) {
                      const novoItem = {
                        nome: nomeInput.value,
                        tipo: novoItemTipo,
                        nivel: parseInt(nivelInput.value) || 0,
                        observacoes: observacoesTextarea?.value || ''
                      };
                      
                      const listaAtual = character.competenciasAptidoesTrunfos || [];
                      const novaLista = [...listaAtual, novoItem];
                      
                      handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                      
                      // Limpar campos
                      nomeInput.value = '';
                      nivelInput.value = '';
                      if (observacoesTextarea) observacoesTextarea.value = '';
                      setNovoItemTipo('Competência');
                    } else {
                      alert('Preencha pelo menos o nome do item!');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-8"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Adicionar
                  </span>
                </Button>
              </div>
            </div>

            {/* Campo de Observações */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                Observações
              </label>
              <textarea
                placeholder="Ex: Especialização em combate corpo a corpo..."
                className="w-full text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 resize-none"
                rows={2}
                id="novo-item-observacoes"
              />
            </div>
          </div>

          {/* Listas por Categoria */}
          {/* Competências */}
          <div>
            <h3 className="text-base font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Competências
            </h3>
            <div className="space-y-3">
              {character.competenciasAptidoesTrunfos?.filter(item => item.tipo === 'Competência').length > 0 ? (
                character.competenciasAptidoesTrunfos
                  .filter(item => item.tipo === 'Competência')
                  .map((competencia, index) => (
                    <div 
                      key={`competencia-${index}`}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Header da Competência */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {competencia.nome}
                          </div>
                          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            Nível: {competencia.nivel}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.map((item) => 
                                item.tipo === 'Competência' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Competência').indexOf(item) === index
                                  ? { ...item, nivel: Math.max(0, item.nivel - 1) }
                                  : item
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-6 p-0 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                          >
                            -
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.map((item) => 
                                item.tipo === 'Competência' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Competência').indexOf(item) === index
                                  ? { ...item, nivel: Math.min(5, item.nivel + 1) }
                                  : item
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white text-xs"
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.filter((item) => 
                                !(item.tipo === 'Competência' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Competência').indexOf(item) === index)
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-16 text-xs bg-red-500 hover:bg-red-600"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Benefícios Acumulados */}
                      <div className="px-3 pb-2">
                        <div className="space-y-1">
                          <div 
                            className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            onClick={() => setExpandedCompetencias(prev => ({...prev, [index]: !prev[index]}))}
                          >
                            <span className="flex items-center gap-1">
                              📋 Benefícios
                              <span className={`transform transition-transform duration-200 ${expandedCompetencias[index] ? 'rotate-90' : ''}`}>
                                ▶
                              </span>
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {expandedCompetencias[index] ? 'Clique para recolher' : 'Clique para expandir'}
                            </span>
                          </div>
                          
                          {/* Nível atual sempre visível */}
                          <div className="bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200 font-medium text-xs p-2 rounded border-l-2">
                            Nível {competencia.nivel}: {getBeneficioCompetencia(competencia.nivel)}
                          </div>
                          
                          {/* Níveis anteriores - expansíveis */}
                          {expandedCompetencias[index] && competencia.nivel > 0 && (
                            <div className="space-y-1 pl-2 border-l border-gray-200 dark:border-gray-600 ml-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                                📜 Níveis anteriores:
                              </div>
                              {getBeneficiosAcumulados(competencia.nivel - 1, 'Competência').map((beneficio, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs p-2 rounded border-l-2"
                                >
                                  {beneficio}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sistema de Especialização para Nível 4+ */}
                      {competencia.nivel >= 4 && (
                        <div className="px-3 pb-3">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-700">
                            <label className="block text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                              ⚡ Especialização Disponível (Nível {competencia.nivel}):
                            </label>
                            <Select 
                              value={competencia.especializacao || ''} 
                              onValueChange={(value) => {
                                const novaLista = character.competenciasAptidoesTrunfos?.map((item) => 
                                  item.tipo === 'Competência' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Competência').indexOf(item) === index
                                    ? { ...item, especializacao: value }
                                    : item
                                ) || [];
                                handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                              }}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Escolha uma especialização" />
                              </SelectTrigger>
                              <SelectContent>
                                {especializacoes.map((esp) => (
                                  <SelectItem key={esp.nome} value={esp.nome}>
                                    <div>
                                      <div className="font-medium">{esp.nome}</div>
                                      <div className="text-xs text-gray-500 mt-1">{esp.descricao}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {competencia.especializacao && (
                              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-yellow-300 dark:border-yellow-600">
                                <div className="text-xs">
                                  <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                    🎯 {competencia.especializacao}
                                  </div>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {especializacoes.find(e => e.nome === competencia.especializacao)?.descricao}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Observações */}
                      {competencia.observacoes && (
                        <div className="px-3 pb-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Observações:</strong> {competencia.observacoes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600 text-sm">
                  Nenhuma competência cadastrada
                </div>
              )}
            </div>
          </div>

          {/* Aptidões */}
          <div>
            <h3 className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Aptidões
            </h3>
            <div className="space-y-3">
              {character.competenciasAptidoesTrunfos?.filter(item => item.tipo === 'Aptidão').length > 0 ? (
                character.competenciasAptidoesTrunfos
                  .filter(item => item.tipo === 'Aptidão')
                  .map((aptidao, index) => (
                    <div 
                      key={`aptidao-${index}`}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Header da Aptidão */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            {aptidao.nome}
                          </div>
                          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            Nível: {aptidao.nivel}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.map((item) => 
                                item.tipo === 'Aptidão' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Aptidão').indexOf(item) === index
                                  ? { ...item, nivel: Math.max(0, item.nivel - 1) }
                                  : item
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-6 p-0 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                          >
                            -
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.map((item) => 
                                item.tipo === 'Aptidão' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Aptidão').indexOf(item) === index
                                  ? { ...item, nivel: Math.min(5, item.nivel + 1) }
                                  : item
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white text-xs"
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.filter((item) => 
                                !(item.tipo === 'Aptidão' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Aptidão').indexOf(item) === index)
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-16 text-xs bg-red-500 hover:bg-red-600"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Benefícios Acumulados */}
                      <div className="px-3 pb-2">
                        <div className="space-y-1">
                          <div 
                            className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            onClick={() => setExpandedAptidoes(prev => ({...prev, [index]: !prev[index]}))}
                          >
                            <span className="flex items-center gap-1">
                              📋 Benefícios
                              <span className={`transform transition-transform duration-200 ${expandedAptidoes[index] ? 'rotate-90' : ''}`}>
                                ▶
                              </span>
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {expandedAptidoes[index] ? 'Clique para recolher' : 'Clique para expandir'}
                            </span>
                          </div>
                          
                          {/* Nível atual sempre visível */}
                          <div className="bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-800 dark:text-purple-200 font-medium text-xs p-2 rounded border-l-2">
                            Nível {aptidao.nivel}: {getBeneficioAptidao(aptidao.nivel)}
                          </div>
                          
                          {/* Níveis anteriores - expansíveis */}
                          {expandedAptidoes[index] && aptidao.nivel > 0 && (
                            <div className="space-y-1 pl-2 border-l border-gray-200 dark:border-gray-600 ml-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                                📜 Níveis anteriores:
                              </div>
                              {getBeneficiosAcumulados(aptidao.nivel - 1, 'Aptidão').map((beneficio, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs p-2 rounded border-l-2"
                                >
                                  {beneficio}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Observações */}
                      {aptidao.observacoes && (
                        <div className="px-3 pb-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Observações:</strong> {aptidao.observacoes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600 text-sm">
                  Nenhuma aptidão cadastrada
                </div>
              )}
            </div>
          </div>

          {/* Trunfos */}
          <div>
            <h3 className="text-base font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Trunfos
            </h3>
            <div className="space-y-2">
              {character.competenciasAptidoesTrunfos?.filter(item => item.tipo === 'Trunfo').length > 0 ? (
                character.competenciasAptidoesTrunfos
                  .filter(item => item.tipo === 'Trunfo')
                  .map((trunfo, index) => (
                    <div 
                      key={`trunfo-${index}`}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                        <div>
                          <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                            {trunfo.nome}
                          </div>
                          {trunfo.observacoes && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {trunfo.observacoes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 items-center justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const novaLista = character.competenciasAptidoesTrunfos?.filter((item) => 
                                !(item.tipo === 'Trunfo' && character.competenciasAptidoesTrunfos?.filter(c => c.tipo === 'Trunfo').indexOf(item) === index)
                              ) || [];
                              handleAttributeUpdate('competenciasAptidoesTrunfos', novaLista);
                            }}
                            className="h-6 w-16 text-xs bg-red-500 hover:bg-red-600"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600 text-sm">
                  Nenhum trunfo cadastrado
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
      </div>
    </div>
  );
};

export default AttributesTab;