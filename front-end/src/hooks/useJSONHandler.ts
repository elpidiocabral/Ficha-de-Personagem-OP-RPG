import { useCallback } from 'react';
import { Character } from '../types';

interface UseJSONHandlerReturn {
  exportCharacterAsFile: (character: Character) => void;
  importCharacterFromFile: (onImport: (data: Character) => void) => void;
  importCharacterFromJSON: (jsonString: string, onImport: (data: Character) => void) => void;
  validateCharacterData: (data: any) => boolean;
}

export const useJSONHandler = (): UseJSONHandlerReturn => {
  
  // Export character as downloadable JSON file
  const exportCharacterAsFile = useCallback((character: Character) => {
    try {
      const characterName = (character.nome || 'Personagem').replace(/[^a-zA-Z0-9_-]+/g, '_');
      const jsonString = JSON.stringify(character, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fichaOnePiece_${characterName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Character exported successfully');
    } catch (error) {
      console.error('Error exporting character:', error);
      alert('Erro ao exportar personagem: ' + (error as Error).message);
    }
  }, []);

  // Import character from file input
  const importCharacterFromFile = useCallback((onImport: (data: Character) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          importCharacterFromJSON(jsonString, onImport);
        } catch (error) {
          console.error('Error reading file:', error);
          alert('Erro ao ler arquivo: ' + (error as Error).message);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, []);

  // Import character from JSON string
  const importCharacterFromJSON = useCallback((
    jsonString: string, 
    onImport: (data: Character) => void
  ) => {
    try {
      const data = JSON.parse(jsonString);
      
      console.log('🔍 Dados brutos do JSON:', data);
      console.log('🔍 Habilidades brutas:', data.habilidades);
      if (data.habilidades && data.habilidades[0]) {
        console.log('🔍 Primeira habilidade COMPLETA:', data.habilidades[0]);
        console.log('🔍 Campo desc da primeira habilidade:', data.habilidades[0].desc);
        console.log('🔍 Campo descricao da primeira habilidade:', data.habilidades[0].descricao);
        console.log('🔍 Todos os campos da primeira habilidade:', Object.keys(data.habilidades[0]));
      }
      
      if (!validateCharacterData(data)) {
        throw new Error('Dados do personagem inválidos ou incompletos');
      }
      
      // Função para mapear valores antigos para novos
      const mapRaca = (raca: string): string => {
        const racaMap: { [key: string]: string } = {
          'umano': 'Humano',
          'Humano': 'Humano',
          'Humano-Peixe': 'Humano-Peixe',
          'Tritao': 'Tritão',
          'Tritão': 'Tritão',
          'Mink': 'Mink',
          'Povo do Ceu': 'Povo do Céu',
          'Povo do Céu': 'Povo do Céu',
          'Anao Tontatta': 'Anão Tontatta',
          'Anão Tontatta': 'Anão Tontatta'
        };
        return racaMap[raca] || 'Humano';
      };
      
      const mapClasse = (classe: string): string => {
        const classeMap: { [key: string]: string } = {
          'Lutador': 'Lutador',
          'Guerrilheiro': 'Guerrilheiro', 
          'ArtistaMarcial': 'Artista Marcial',
          'Artista Marcial': 'Artista Marcial',
          'Espadachim': 'Espadachim',
          'Atirador': 'Atirador',
          'Especialista': 'Especialista',
          'Assassino': 'Assassino',
          'Ladrao': 'Ladrão',
          'Ladrão': 'Ladrão'
        };
        return classeMap[classe] || 'Lutador';
      };
      
      const mapProfissao = (profissao: string): string => {
        const profissaoMap: { [key: string]: string } = {
          'Capitao': 'Capitão', 'Capitão': 'Capitão',
          'Imediato': 'Imediato',
          'Navegador': 'Navegador',
            'Cozinheiro': 'Cozinheiro',
          'Medico': 'Médico', 'Médico': 'Médico',
          'Arqueologo': 'Arqueólogo', 'Arqueólogo': 'Arqueólogo',
          'Carpinteiro': 'Carpinteiro',
          'Musico': 'Músico', 'Músico': 'Músico',
          'Atirador': 'Atirador',
          // Novas profissões adicionadas
          'Marinheiro': 'Marinheiro',
          'Cacador de Recompensas': 'Caçador de Recompensas', 'Caçador de Recompensas': 'Caçador de Recompensas', 'Cacador': 'Caçador de Recompensas',
          'Revolucionario': 'Revolucionário', 'Revolucionário': 'Revolucionário',
          'Combatente': 'Combatente', // já usada como default inicial em contexto
          'Outro': 'Outro'
        };
        // Se já estiver em lista retorna normalizado; caso contrário retorna original (em vez de forçar Outro)
        return profissaoMap[profissao] || profissaoMap[profissao.trim()] || profissao;
      };
      
      const mapPotencial = (potencial: string): string => {
        const potencialMap: { [key: string]: string } = {
          'Desastre Sobrenatural': 'Desastre Sobrenatural',
          'Monstro': 'Monstro',
          'Sobre-Humano': 'Sobre-Humano',
          'Humano': 'Humano',
          'Ciborgue': 'Ciborgue'
        };
        return potencialMap[potencial] || 'Monstro';
      };
      
      // Ensure all required arrays exist
      const sanitizedData: Character = {
        // Basic Info
        nome: data.nome || '',
        raca: mapRaca(data.raca || 'Humano'),
        classe: mapClasse(data.classe || 'Lutador'),
        profissao: mapProfissao(data.profissao || 'Outro'),
        potencial: mapPotencial(data.potencial || 'Monstro'),
        nivelClasse: parseInt(String(data.nivelClasse)) || 1,
        nivelProfissao: parseInt(String(data.nivelProfissao)) || 1,
        
        // Status - compatibilidade com formato antigo
        vidaAtual: parseInt(String(data.vidaAtual || data.vida)) || 10,
        vidaMax: parseInt(String(data.vidaMax)) || 10,
        vigorAtual: parseInt(String(data.vigorAtual || data.vigor)) || 6,
        vigorMax: parseInt(String(data.vigorMax)) || 6,
        determinacao: parseInt(String(data.determinacao)) || 0,
        bonusMaestria: parseInt(String(data.bonusMaestria)) || 1,
        sorte: parseInt(String(data.sorte)) || 0,
        classeAcerto: parseInt(String(data.classeAcerto)) || 1,
        classeDificuldade: parseInt(String(data.classeDificuldade)) || 1,
        deslocamento: data.deslocamento || '3m',
        
        // Primary Attributes - Base
        forcaBase: parseInt(String(data.forcaBase)) || 0,
        destrezaBase: parseInt(String(data.destrezaBase)) || 0,
        vitalidadeBase: parseInt(String(data.vitalidadeBase)) || 0,
        aparenciaBase: parseInt(String(data.aparenciaBase)) || 0,
        conhecimentoBase: parseInt(String(data.conhecimentoBase)) || 0,
        raciocinioBase: parseInt(String(data.raciocinioBase)) || 0,
        vontadeBase: parseInt(String(data.vontadeBase)) || 0,
        destinoBase: parseInt(String(data.destinoBase)) || 0,
        velocidadeBase: parseInt(String(data.velocidadeBase)) || 0,
        resilienciaBase: parseInt(String(data.resilienciaBase)) || 0,
        
        // Primary Attributes - Bonus
        forcaBonus: parseInt(String(data.forcaBonus)) || 0,
        destrezaBonus: parseInt(String(data.destrezaBonus)) || 0,
        vitalidadeBonus: parseInt(String(data.vitalidadeBonus)) || 0,
        aparenciaBonus: parseInt(String(data.aparenciaBonus)) || 0,
        conhecimentoBonus: parseInt(String(data.conhecimentoBonus)) || 0,
        raciocinioBonus: parseInt(String(data.raciocinioBonus)) || 0,
        vontadeBonus: parseInt(String(data.vontadeBonus)) || 0,
        destinoBonus: parseInt(String(data.destinoBonus)) || 0,
        velocidadeBonus: parseInt(String(data.velocidadeBonus)) || 0,
        resilienciaBonus: parseInt(String(data.resilienciaBonus)) || 0,
        
        // Primary Attributes - Total (recalculados automaticamente)
        forcaTotal: parseInt(String(data.forcaTotal)) || 0,
        destrezaTotal: parseInt(String(data.destrezaTotal)) || 0,
        vitalidadeTotal: parseInt(String(data.vitalidadeTotal)) || 0,
        aparenciaTotal: parseInt(String(data.aparenciaTotal)) || 0,
        conhecimentoTotal: parseInt(String(data.conhecimentoTotal)) || 0,
        raciocinioTotal: parseInt(String(data.raciocinioTotal)) || 0,
        vontadeTotal: parseInt(String(data.vontadeTotal)) || 0,
        destinoTotal: parseInt(String(data.destinoTotal)) || 0,
        velocidadeTotal: parseInt(String(data.velocidadeTotal)) || 0,
        resilienciaTotal: parseInt(String(data.resilienciaTotal)) || 0,
        
        // Derived Attributes - Base
        agilidadeBase: parseInt(String(data.agilidadeBase)) || 0,
        resistenciaBase: parseInt(String(data.resistenciaBase)) || 0,
        persistenciaBase: parseInt(String(data.persistenciaBase)) || 0,
        disciplinaBase: parseInt(String(data.disciplinaBase)) || 0,
        carismaBase: parseInt(String(data.carismaBase)) || 0,
        
        // Derived Attributes - Bonus
        agilidadeBonus: parseInt(String(data.agilidadeBonus)) || 0,
        resistenciaBonus: parseInt(String(data.resistenciaBonus)) || 0,
        persistenciaBonus: parseInt(String(data.persistenciaBonus)) || 0,
        disciplinaBonus: parseInt(String(data.disciplinaBonus)) || 0,
        carismaBonus: parseInt(String(data.carismaBonus)) || 0,
        
        // Derived Attributes - Total (recalculados automaticamente)
        agilidadeTotal: parseInt(String(data.agilidadeTotal)) || 0,
        resistenciaTotal: parseInt(String(data.resistenciaTotal)) || 0,
        persistenciaTotal: parseInt(String(data.persistenciaTotal)) || 0,
        disciplinaTotal: parseInt(String(data.disciplinaTotal)) || 0,
        carismaTotal: parseInt(String(data.carismaTotal)) || 0,
        
        // Reserves
        reservaVidaQtd: parseInt(String(data.reservaVidaQtd)) || 1,
        reservaVigorQtd: parseInt(String(data.reservaVigorQtd)) || 1,
        
        // Ferimentos e Lesões
        localGolpe: data.localGolpe || '',
        danoFerimento: parseInt(String(data.danoFerimento)) || 0,
        ferimentosAtivos: parseInt(String(data.ferimentosAtivos)) || 0,
        lesoesAtivas: parseInt(String(data.lesoesAtivas)) || 0,
        
        // Devil Fruit - with smart defaults
        akumaNome: data.akumaNome || (data.akumaTipo && data.akumaTipo !== '' ? 'Fruta do Macaco' : ''),
        akumaTipo: data.akumaTipo || 'Paramecia',
        akumaTematica: data.akumaTematica || (data.akumaSubtipo && data.akumaSubtipo !== '' ? data.akumaSubtipo : ''),
        akumaDesejo: data.akumaDesejo || (data.akumaNome && data.akumaNome === '' ? 'Liberdade e Poder' : ''),
        akumaSubtipo: data.akumaSubtipo || '',
        nivelFruta: data.nivelFruta || 0,
        
        // Arrays - ensure they exist and handle different formats
        habilidades: Array.isArray(data.habilidades) ? data.habilidades : [],
        frutaHabilidades: Array.isArray(data.frutaHabilidades) ? data.frutaHabilidades : [],
        listaCompetencias: Array.isArray(data.listaCompetencias) ? data.listaCompetencias : [],
        listaAptidoes: Array.isArray(data.listaAptidoes) ? data.listaAptidoes : [],
        listaItens: Array.isArray(data.listaItens) ? data.listaItens : [],
        ferimentos: Array.isArray(data.ferimentos) ? data.ferimentos : [],
        lesoes: Array.isArray(data.lesoes) ? data.lesoes : [],
        listaSessoes: Array.isArray(data.listaSessoes) ? data.listaSessoes : [],
        ataques: Array.isArray(data.ataques) ? data.ataques : [],
        
        // Competências, Aptidões e Trunfos - formato unificado
        competenciasAptidoesTrunfos: (() => {
          const competenciasAptidoesTrunfos: any[] = [];
          
          // Importar competências da estrutura antiga (listaCompetencias)
          if (Array.isArray(data.listaCompetencias)) {
            data.listaCompetencias.forEach((comp: any) => {
              if (comp.nome) {
                competenciasAptidoesTrunfos.push({
                  nome: comp.nome,
                  tipo: 'Competência',
                  nivel: parseInt(String(comp.nivel)) || 0,
                  observacoes: comp.observacoes || comp.especializacao || ''
                });
              }
            });
          }
          
          // Importar aptidões da estrutura antiga (listaAptidoes)
          if (Array.isArray(data.listaAptidoes)) {
            data.listaAptidoes.forEach((apt: any) => {
              if (apt.nome) {
                competenciasAptidoesTrunfos.push({
                  nome: apt.nome,
                  tipo: 'Aptidão',
                  nivel: parseInt(String(apt.nivel)) || 0,
                  observacoes: apt.observacoes || apt.atributo || ''
                });
              }
            });
          }
          
          // Importar trunfos se existirem
          if (Array.isArray(data.listaTrunfos)) {
            data.listaTrunfos.forEach((trunfo: any) => {
              if (trunfo.nome) {
                competenciasAptidoesTrunfos.push({
                  nome: trunfo.nome,
                  tipo: 'Trunfo',
                  nivel: 0, // Trunfos não têm nível
                  observacoes: trunfo.descricao || trunfo.observacoes || ''
                });
              }
            });
          }
          
          // Se já existe o formato novo, usar ele diretamente
          if (Array.isArray(data.competenciasAptidoesTrunfos)) {
            return data.competenciasAptidoesTrunfos;
          }
          
          return competenciasAptidoesTrunfos;
        })(),
        pontosCompetenciaDisponiveis: parseInt(String(data.pontosCompetenciaDisponiveis || data.competenciaPontos)) || 0,
        pontosAptidaoDisponiveis: parseInt(String(data.pontosAptidaoDisponiveis || data.aptidaoPontos)) || 0,
        
        // Personal Info
        ilhaOrigem: data.ilhaOrigem || '',
        historia: data.historia || '',
        sonho: data.sonho || '',
        pessoaImportante: data.pessoaImportante || '',
        objetivos: data.objetivos || '',
        qualidades: data.qualidades || '',
        habilidadeInutil: data.habilidadeInutil || '',
        defeitos: data.defeitos || '',
        reputacao: data.reputacao || '',
        moral: data.moral || '',
        bounty: data.bounty || '',
        dinheiro: data.dinheiro || '',
        anotacoesGerais: data.anotacoesGerais || '',
        
        // Points
        habilidadePontos: data.habilidadePontos || 0,
        habilidadeFrutaPontos: data.habilidadeFrutaPontos || 0,
        competenciaPontos: data.competenciaPontos || 0,
        aptidaoPontos: data.aptidaoPontos || 0,
        
        // Avatar
        avatarBase64: data.avatarBase64 || ''
      };
      
      console.log('✅ Dados sanitizados:', sanitizedData);
      console.log('✅ Raça mapeada:', data.raca, '->', sanitizedData.raca);
      console.log('✅ Classe mapeada:', data.classe, '->', sanitizedData.classe);
      console.log('✅ Profissão mapeada:', data.profissao, '->', sanitizedData.profissao);
      
      onImport(sanitizedData);
      alert('Personagem importado com sucesso!');
      
    } catch (error) {
      console.error('Error importing character:', error);
      alert('Erro ao importar personagem: ' + (error as Error).message);
    }
  }, []);

  // Validate if the data structure is a valid character
  const validateCharacterData = useCallback((data: any): boolean => {
    // Basic validation - check if it's an object
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Check if it has at least some character-like properties
    const hasBasicProperties = (
      typeof data.nome !== 'undefined' ||
      typeof data.raca !== 'undefined' ||
      typeof data.classe !== 'undefined' ||
      typeof data.forcaBase !== 'undefined' ||
      typeof data.destrezaBase !== 'undefined'
    );
    
    return hasBasicProperties;
  }, []);

  return {
    exportCharacterAsFile,
    importCharacterFromFile,
    importCharacterFromJSON,
    validateCharacterData,
  };
};