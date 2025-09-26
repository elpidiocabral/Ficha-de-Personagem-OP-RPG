import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Character, Sessao } from '../../types';

interface PersonalTabProps {
  character: Character;
  handleAttributeUpdate: (field: keyof Character, value: any) => void;
}

const PersonalTab: React.FC<PersonalTabProps> = ({
  character,
  handleAttributeUpdate,
}) => {
  // Estados para controle de sessões
  const [novaSessao, setNovaSessao] = useState<Omit<Sessao, 'id'>>({
    titulo: '',
    data: new Date().toLocaleDateString('pt-BR'),
    resumo: '',
    experienciaGanha: 0,
    dinheiroPerdidoGanho: 0,
    observacoes: '',
  });

  const [editingSessao, setEditingSessao] = useState<number | null>(null);
  const [expandedSessoes, setExpandedSessoes] = useState<Record<number, boolean>>({});

  // Função para gerar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Função para adicionar sessão
  const adicionarSessao = () => {
    if (!novaSessao.titulo.trim()) {
      alert('Título da sessão é obrigatório!');
      return;
    }

    const sessaoComId: Sessao = {
      ...novaSessao,
      id: generateId()
    };

    const novaLista = [...(character.listaSessoes || []), sessaoComId];
    handleAttributeUpdate('listaSessoes', novaLista);
    
    // Limpar formulário
    setNovaSessao({
      titulo: '',
      data: new Date().toLocaleDateString('pt-BR'),
      resumo: '',
      experienciaGanha: 0,
      dinheiroPerdidoGanho: 0,
      observacoes: '',
    });
  };

  // Função para remover sessão
  const removerSessao = (index: number) => {
    const novaLista = character.listaSessoes?.filter((_, i) => i !== index) || [];
    handleAttributeUpdate('listaSessoes', novaLista);
  };

  // Função para iniciar edição
  const iniciarEdicao = (index: number) => {
    setEditingSessao(index);
  };

  // Função para salvar edição
  const salvarEdicao = (index: number, sessaoEditada: Sessao) => {
    const novaLista = character.listaSessoes?.map((sess, i) => 
      i === index ? sessaoEditada : sess
    ) || [];
    handleAttributeUpdate('listaSessoes', novaLista);
    setEditingSessao(null);
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setEditingSessao(null);
  };

  // Componente de edição de sessão
  const SessaoEditForm: React.FC<{
    sessao: Sessao;
    onSave: (sessao: Sessao) => void;
    onCancel: () => void;
  }> = ({ sessao, onSave, onCancel }) => {
    const [editedSessao, setEditedSessao] = useState<Sessao>(sessao);

    const handleSave = () => {
      onSave(editedSessao);
    };

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Título da sessão"
            value={editedSessao.titulo}
            onChange={(e) => setEditedSessao({...editedSessao, titulo: e.target.value})}
            className="text-sm"
          />
          <Input
            placeholder="Data"
            value={editedSessao.data}
            onChange={(e) => setEditedSessao({...editedSessao, data: e.target.value})}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Experiência Ganha"
            value={editedSessao.experienciaGanha || ''}
            onChange={(e) => setEditedSessao({...editedSessao, experienciaGanha: parseInt(e.target.value) || 0})}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Dinheiro Ganho/Perdido"
            value={editedSessao.dinheiroPerdidoGanho || ''}
            onChange={(e) => setEditedSessao({...editedSessao, dinheiroPerdidoGanho: parseInt(e.target.value) || 0})}
            className="text-sm"
          />
        </div>
        <textarea
          placeholder="Resumo da sessão..."
          value={editedSessao.resumo}
          onChange={(e) => setEditedSessao({...editedSessao, resumo: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 resize-none"
          rows={4}
        />
        <textarea
          placeholder="Observações adicionais..."
          value={editedSessao.observacoes || ''}
          onChange={(e) => setEditedSessao({...editedSessao, observacoes: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="text-xs bg-green-600 hover:bg-green-700">
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="text-xs">
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Coluna da esquerda - Informações Pessoais */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Informações Básicas */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Ilha de Origem</label>
                  <Input
                    placeholder="Ex: Fuchsia Village"
                    value={character.ilhaOrigem || ''}
                    onChange={(e) => handleAttributeUpdate('ilhaOrigem', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">História</label>
                  <textarea
                    placeholder="Conte a história de origem do seu personagem..."
                    value={character.historia || ''}
                    onChange={(e) => handleAttributeUpdate('historia', e.target.value)}
                    className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sonho</label>
                  <textarea
                    placeholder="Qual é o grande sonho do seu personagem?"
                    value={character.sonho || ''}
                    onChange={(e) => handleAttributeUpdate('sonho', e.target.value)}
                    className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pessoa Mais Importante</label>
                  <Input
                    placeholder="Ex: Monkey D. Luffy"
                    value={character.pessoaImportante || ''}
                    onChange={(e) => handleAttributeUpdate('pessoaImportante', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Objetivos</label>
                  <textarea
                    placeholder="Objetivos de curto, médio e longo prazo..."
                    value={character.objetivos || ''}
                    onChange={(e) => handleAttributeUpdate('objetivos', e.target.value)}
                    className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Características
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Qualidades</label>
                  <textarea
                    placeholder="Qualidades do personagem..."
                    value={character.qualidades || ''}
                    onChange={(e) => handleAttributeUpdate('qualidades', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none text-sm"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Defeitos</label>
                  <textarea
                    placeholder="Defeitos do personagem..."
                    value={character.defeitos || ''}
                    onChange={(e) => handleAttributeUpdate('defeitos', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none text-sm"
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Habilidade Inútil</label>
                <Input
                  placeholder="Ex: Consegue imitar qualquer som de animal"
                  value={character.habilidadeInutil || ''}
                  onChange={(e) => handleAttributeUpdate('habilidadeInutil', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Reputação</label>
                  <Input
                    placeholder="Ex: Desconhecido, Famoso..."
                    value={character.reputacao || ''}
                    onChange={(e) => handleAttributeUpdate('reputacao', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Moral</label>
                  <Input
                    placeholder="Ex: Liberdade pela Força (L/F)"
                    value={character.moral || ''}
                    onChange={(e) => handleAttributeUpdate('moral', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita - Progresso e Controle de Sessão */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Progresso */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Recompensa (Bounty)</label>
                  <Input
                    placeholder="Ex: 300.000.000"
                    value={character.bounty || ''}
                    onChange={(e) => handleAttributeUpdate('bounty', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Berries (Dinheiro)</label>
                  <Input
                    placeholder="Ex: 7490"
                    value={character.dinheiro || ''}
                    onChange={(e) => handleAttributeUpdate('dinheiro', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Anotações Gerais</label>
                <textarea
                  placeholder="Anotações gerais sobre o personagem..."
                  value={character.anotacoesGerais || ''}
                  onChange={(e) => handleAttributeUpdate('anotacoesGerais', e.target.value)}
                  className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Controle de Sessões */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                Controle de Sessões / Diário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário para adicionar nova sessão */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Adicionar Sessão</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Título / Data da Sessão"
                      value={novaSessao.titulo}
                      onChange={(e) => setNovaSessao(prev => ({...prev, titulo: e.target.value}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                    <Input
                      placeholder="Data"
                      value={novaSessao.data}
                      onChange={(e) => setNovaSessao(prev => ({...prev, data: e.target.value}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                  </div>
                  <textarea
                    placeholder="Resumo / Ocorridos / Treino Ganho"
                    value={novaSessao.resumo}
                    onChange={(e) => setNovaSessao(prev => ({...prev, resumo: e.target.value}))}
                    className="w-full p-2 border border-orange-300 dark:border-orange-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Exp. Ganha"
                      value={novaSessao.experienciaGanha || ''}
                      onChange={(e) => setNovaSessao(prev => ({...prev, experienciaGanha: parseInt(e.target.value) || 0}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                    <Input
                      type="number"
                      placeholder="Berries Ganho/Perdido"
                      value={novaSessao.dinheiroPerdidoGanho || ''}
                      onChange={(e) => setNovaSessao(prev => ({...prev, dinheiroPerdidoGanho: parseInt(e.target.value) || 0}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                  </div>
                  <Button 
                    onClick={adicionarSessao}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                  >
                    Adicionar Sessão
                  </Button>
                </div>
              </div>

              {/* Lista de Sessões */}
              <div className="space-y-3">
                {character.listaSessoes && character.listaSessoes.length > 0 ? (
                  character.listaSessoes.map((sessao, index) => (
                    <div 
                      key={`sessao-${index}`}
                      className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm transition-all duration-200 border-orange-200 dark:border-orange-700"
                    >
                      {/* Header da Sessão */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-orange-700 dark:text-orange-300">
                            {sessao.titulo}
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {sessao.data} {sessao.experienciaGanha && sessao.experienciaGanha > 0 && `| +${sessao.experienciaGanha} exp`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedSessoes(prev => ({...prev, [index]: !prev[index]}))}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            {expandedSessoes[index] ? 'Recolher' : 'Expandir'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => iniciarEdicao(index)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerSessao(index)}
                            className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Formulário de edição ou detalhes expansíveis */}
                      {editingSessao === index ? (
                        <SessaoEditForm
                          sessao={sessao}
                          onSave={(sessaoEditada) => salvarEdicao(index, sessaoEditada)}
                          onCancel={cancelarEdicao}
                        />
                      ) : expandedSessoes[index] && (
                        <div className="px-3 pb-3 border-t border-orange-200 dark:border-orange-700">
                          <div className="pt-3 space-y-2 text-sm">
                            <div>
                              <strong>Resumo:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {sessao.resumo || 'Sem resumo'}
                              </div>
                            </div>
                            {sessao.observacoes && (
                              <div>
                                <strong>Observações:</strong> 
                                <div className="mt-1 whitespace-pre-wrap">
                                  {sessao.observacoes}
                                </div>
                              </div>
                            )}
                            {(sessao.dinheiroPerdidoGanho ?? 0) !== 0 && (
                              <div>
                                <strong>Berries:</strong> {(sessao.dinheiroPerdidoGanho ?? 0) > 0 ? '+' : ''}{sessao.dinheiroPerdidoGanho ?? 0}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                    Nenhuma sessão registrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;