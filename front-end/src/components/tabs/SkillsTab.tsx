import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Character, Habilidade } from '../../types';

interface SkillsTabProps {
  character: Character;
  handleAttributeUpdate: (field: keyof Character, value: any) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
  character,
  handleAttributeUpdate,
}) => {
  // Estados para formulários
  const [novaHabilidade, setNovaHabilidade] = useState<Omit<Habilidade, 'expanded'>>({
    nome: '',
    custo: '',
    descricao: '',
    custoCompra: '',
    alcance: '',
    comprada: false
  });

  const [novaHabilidadeFruta, setNovaHabilidadeFruta] = useState<Omit<Habilidade, 'expanded'>>({
    nome: '',
    custo: '',
    descricao: '',
    custoCompra: '',
    alcance: '',
    comprada: false
  });

  // Estados para controlar expansão das habilidades
  const [expandedHabilidades, setExpandedHabilidades] = useState<Record<number, boolean>>({});
  const [expandedFrutaHabilidades, setExpandedFrutaHabilidades] = useState<Record<number, boolean>>({});

  // Estados para controlar edição das habilidades
  const [editingHabilidade, setEditingHabilidade] = useState<number | null>(null);
  const [editingFrutaHabilidade, setEditingFrutaHabilidade] = useState<number | null>(null);

  // Auto-expandir habilidades com descrições na primeira visualização
  useEffect(() => {
    if (character.habilidades) {
      const newExpanded: Record<number, boolean> = {};
      character.habilidades.forEach((hab, index) => {
        // Auto-expandir se tem descrição e não é só "Sem descrição"
        if (hab.descricao && hab.descricao.trim() && hab.descricao !== 'Sem descrição') {
          newExpanded[index] = true;
        }
      });
      if (Object.keys(newExpanded).length > 0) {
        setExpandedHabilidades(prev => ({...prev, ...newExpanded}));
      }
    }

    if (character.frutaHabilidades) {
      const newExpanded: Record<number, boolean> = {};
      character.frutaHabilidades.forEach((hab, index) => {
        // Auto-expandir se tem descrição e não é só "Sem descrição"
        if (hab.descricao && hab.descricao.trim() && hab.descricao !== 'Sem descrição') {
          newExpanded[index] = true;
        }
      });
      if (Object.keys(newExpanded).length > 0) {
        setExpandedFrutaHabilidades(prev => ({...prev, ...newExpanded}));
      }
    }
  }, [character.habilidades?.length, character.frutaHabilidades?.length]);

  // Função para adicionar habilidade comum
  const adicionarHabilidade = () => {
    if (!novaHabilidade.nome.trim()) {
      alert('Nome da habilidade é obrigatório!');
      return;
    }

    const novaLista = [...(character.habilidades || []), { ...novaHabilidade }];
    handleAttributeUpdate('habilidades', novaLista);
    
    // Limpar formulário
    setNovaHabilidade({
      nome: '',
      custo: '',
      descricao: '',
      custoCompra: '',
      alcance: '',
      comprada: false
    });
  };

  // Função para remover habilidade comum
  const removerHabilidade = (index: number) => {
    const novaLista = character.habilidades?.filter((_, i) => i !== index) || [];
    handleAttributeUpdate('habilidades', novaLista);
  };

  // Função para iniciar edição de habilidade
  const iniciarEdicaoHabilidade = (index: number) => {
    setEditingHabilidade(index);
  };

  // Função para salvar edição de habilidade
  const salvarEdicaoHabilidade = (index: number, habilidadeEditada: Habilidade) => {
    const novaLista = character.habilidades?.map((hab, i) => 
      i === index ? habilidadeEditada : hab
    ) || [];
    handleAttributeUpdate('habilidades', novaLista);
    setEditingHabilidade(null);
  };

  // Função para cancelar edição de habilidade
  const cancelarEdicaoHabilidade = () => {
    setEditingHabilidade(null);
  };

  // Função para adicionar habilidade da fruta
  const adicionarHabilidadeFruta = () => {
    if (!novaHabilidadeFruta.nome.trim()) {
      alert('Nome da habilidade é obrigatório!');
      return;
    }

    const novaLista = [...(character.frutaHabilidades || []), { ...novaHabilidadeFruta }];
    handleAttributeUpdate('frutaHabilidades', novaLista);
    
    // Limpar formulário
    setNovaHabilidadeFruta({
      nome: '',
      custo: '',
      descricao: '',
      custoCompra: '',
      alcance: '',
      comprada: false
    });
  };

  // Função para remover habilidade da fruta
  const removerHabilidadeFruta = (index: number) => {
    const novaLista = character.frutaHabilidades?.filter((_, i) => i !== index) || [];
    handleAttributeUpdate('frutaHabilidades', novaLista);
  };

  // Função para iniciar edição de habilidade de fruta
  const iniciarEdicaoFrutaHabilidade = (index: number) => {
    setEditingFrutaHabilidade(index);
  };

  // Função para salvar edição de habilidade de fruta
  const salvarEdicaoFrutaHabilidade = (index: number, habilidadeEditada: Habilidade) => {
    const novaLista = character.frutaHabilidades?.map((hab, i) => 
      i === index ? habilidadeEditada : hab
    ) || [];
    handleAttributeUpdate('frutaHabilidades', novaLista);
    setEditingFrutaHabilidade(null);
  };

  // Função para cancelar edição de habilidade de fruta
  const cancelarEdicaoFrutaHabilidade = () => {
    setEditingFrutaHabilidade(null);
  };

  // Componente para edição de habilidade
  const HabilidadeEditForm: React.FC<{
    habilidade: Habilidade;
    onSave: (habilidade: Habilidade) => void;
    onCancel: () => void;
  }> = ({ habilidade, onSave, onCancel }) => {
    const [editedHabilidade, setEditedHabilidade] = useState<Habilidade>(habilidade);

    const handleSave = () => {
      onSave(editedHabilidade);
    };

    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Nome da habilidade"
            value={editedHabilidade.nome}
            onChange={(e) => setEditedHabilidade({...editedHabilidade, nome: e.target.value})}
            className="text-sm"
          />
          <Input
            placeholder="Custo"
            value={editedHabilidade.custo || ''}
            onChange={(e) => setEditedHabilidade({...editedHabilidade, custo: e.target.value})}
            className="text-sm"
          />
          <Input
            placeholder="Custo de Compra"
            value={editedHabilidade.custoCompra || ''}
            onChange={(e) => setEditedHabilidade({...editedHabilidade, custoCompra: e.target.value})}
            className="text-sm"
          />
          <Input
            placeholder="Alcance"
            value={editedHabilidade.alcance || ''}
            onChange={(e) => setEditedHabilidade({...editedHabilidade, alcance: e.target.value})}
            className="text-sm"
          />
        </div>
        <textarea
          placeholder="Descrição da habilidade"
          value={editedHabilidade.descricao || ''}
          onChange={(e) => setEditedHabilidade({...editedHabilidade, descricao: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600"
          rows={4}
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
        {/* Coluna da esquerda - Habilidades Comuns */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Pontos de Habilidades Disponíveis */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                Pontos de Habilidades Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Input
                  type="number"
                  value={character.habilidadePontos || 0}
                  onChange={(e) => handleAttributeUpdate('habilidadePontos', parseInt(e.target.value) || 0)}
                  className="text-center text-2xl font-bold w-24 mx-auto"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Habilidades / Técnicas */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Habilidades / Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário para adicionar nova habilidade */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">Adicionar Habilidade</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Nome da Habilidade"
                    value={novaHabilidade.nome}
                    onChange={(e) => setNovaHabilidade(prev => ({...prev, nome: e.target.value}))}
                    className="border-green-300 dark:border-green-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Custo de Compra (PH)"
                      value={novaHabilidade.custoCompra}
                      onChange={(e) => setNovaHabilidade(prev => ({...prev, custoCompra: e.target.value}))}
                      className="border-green-300 dark:border-green-600"
                    />
                    <Input
                      placeholder="Custo de Uso"
                      value={novaHabilidade.custo}
                      onChange={(e) => setNovaHabilidade(prev => ({...prev, custo: e.target.value}))}
                      className="border-green-300 dark:border-green-600"
                    />
                  </div>
                  <Input
                    placeholder="Alcance e Duração"
                    value={novaHabilidade.alcance}
                    onChange={(e) => setNovaHabilidade(prev => ({...prev, alcance: e.target.value}))}
                    className="border-green-300 dark:border-green-600"
                  />
                  <textarea
                    placeholder="Descrição e Efeito(s) da habilidade..."
                    value={novaHabilidade.descricao}
                    onChange={(e) => setNovaHabilidade(prev => ({...prev, descricao: e.target.value}))}
                    className="p-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={3}
                  />
                  <Button 
                    onClick={adicionarHabilidade}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Adicionar Habilidade
                  </Button>
                </div>
              </div>

              {/* Lista de Habilidades */}
              <div className="space-y-3">
                {character.habilidades && character.habilidades.length > 0 ? (
                  character.habilidades.map((habilidade, index) => (
                    <div 
                      key={`habilidade-${index}`}
                      className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm transition-all duration-200 ${
                        habilidade.comprada 
                          ? 'border-green-400 dark:border-green-600 shadow-green-100 dark:shadow-green-900/20' 
                          : 'border-green-200 dark:border-green-700'
                      }`}
                    >
                      {/* Header da Habilidade */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-green-700 dark:text-green-300">
                              {habilidade.nome}
                            </h5>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Custo: {habilidade.custo || 'N/A'} | Alcance: {habilidade.alcance || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={habilidade.comprada || false}
                              onChange={(e) => {
                                const novaLista = character.habilidades?.map((hab, i) => 
                                  i === index ? { ...hab, comprada: e.target.checked } : hab
                                ) || [];
                                handleAttributeUpdate('habilidades', novaLista);
                              }}
                              className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className={habilidade.comprada ? 'text-green-600' : 'text-gray-500'}>
                              {habilidade.comprada ? 'Comprada' : 'Disponível'}
                            </span>
                          </label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedHabilidades(prev => ({...prev, [index]: !prev[index]}))}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            {expandedHabilidades[index] ? 'Recolher' : 'Expandir'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => iniciarEdicaoHabilidade(index)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerHabilidade(index)}
                            className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Formulário de edição ou detalhes expansíveis */}
                      {editingHabilidade === index ? (
                        <HabilidadeEditForm
                          habilidade={habilidade}
                          onSave={(habilidadeEditada) => salvarEdicaoHabilidade(index, habilidadeEditada)}
                          onCancel={cancelarEdicaoHabilidade}
                        />
                      ) : expandedHabilidades[index] && (
                        <div className="px-3 pb-3 border-t border-green-200 dark:border-green-700">
                          <div className="pt-3 space-y-2 text-sm">
                            {habilidade.custoCompra && String(habilidade.custoCompra) !== '0' && (
                              <div>
                                <strong>Custo de Compra:</strong> {habilidade.custoCompra}
                              </div>
                            )}
                            <div>
                              <strong>Descrição:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {habilidade.desc || habilidade.descricao || 'Sem descrição'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                    Nenhuma habilidade cadastrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita - Akuma no Mi (Fruta do Diabo) */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Pontos de Habilidades da Fruta */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                Pontos de Habilidades p/ Fruta Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Input
                  type="number"
                  value={character.habilidadeFrutaPontos || 0}
                  onChange={(e) => handleAttributeUpdate('habilidadeFrutaPontos', parseInt(e.target.value) || 0)}
                  className="text-center text-2xl font-bold w-24 mx-auto"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações da Akuma no Mi */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Akuma no Mi (Fruta do Diabo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">Descrição da Fruta</h4>
                <div className="space-y-3">
                  <Input
                    placeholder="Nome da Fruta"
                    value={character.akumaNome || ''}
                    onChange={(e) => handleAttributeUpdate('akumaNome', e.target.value)}
                    className="border-red-300 dark:border-red-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={character.akumaTipo || ''} 
                      onValueChange={(value) => handleAttributeUpdate('akumaTipo', value)}
                    >
                      <SelectTrigger className="border-red-300 dark:border-red-600">
                        <SelectValue placeholder="Tipo da Fruta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paramecia">Paramecia</SelectItem>
                        <SelectItem value="Logia">Logia</SelectItem>
                        <SelectItem value="Zoan">Zoan</SelectItem>
                      </SelectContent>
                    </Select>
                    {character.akumaTipo === 'Zoan' ? (
                      <Select 
                        value={character.akumaSubtipo || ''} 
                        onValueChange={(value) => handleAttributeUpdate('akumaSubtipo', value)}
                      >
                        <SelectTrigger className="border-red-300 dark:border-red-600">
                          <SelectValue placeholder="Subtipo Zoan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Ancestral">Ancestral</SelectItem>
                          <SelectItem value="Mitica">Mítica</SelectItem>
                          <SelectItem value="Carnivora">Carnívora</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="Temática"
                        value={character.akumaTematica || ''}
                        onChange={(e) => handleAttributeUpdate('akumaTematica', e.target.value)}
                        className="border-red-300 dark:border-red-600"
                      />
                    )}
                  </div>
                  <textarea
                    placeholder="Desejo que a Criou"
                    value={character.akumaDesejo || ''}
                    onChange={(e) => handleAttributeUpdate('akumaDesejo', e.target.value)}
                    className="p-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none w-full"
                    rows={2}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Nível da Fruta</label>
                    <Input
                      type="number"
                      value={character.nivelFruta || 0}
                      onChange={(e) => handleAttributeUpdate('nivelFruta', parseInt(e.target.value) || 0)}
                      className="border-red-300 dark:border-red-600"
                      min="0"
                      max="5"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades da Fruta */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                Habilidades da Fruta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário para adicionar nova habilidade da fruta */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Adicionar Habilidade da Fruta</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Nome da Habilidade da Fruta"
                    value={novaHabilidadeFruta.nome}
                    onChange={(e) => setNovaHabilidadeFruta(prev => ({...prev, nome: e.target.value}))}
                    className="border-orange-300 dark:border-orange-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Custo de Compra (PH)"
                      value={novaHabilidadeFruta.custoCompra}
                      onChange={(e) => setNovaHabilidadeFruta(prev => ({...prev, custoCompra: e.target.value}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                    <Input
                      placeholder="Custo de Uso"
                      value={novaHabilidadeFruta.custo}
                      onChange={(e) => setNovaHabilidadeFruta(prev => ({...prev, custo: e.target.value}))}
                      className="border-orange-300 dark:border-orange-600"
                    />
                  </div>
                  <Input
                    placeholder="Alcance e Duração"
                    value={novaHabilidadeFruta.alcance}
                    onChange={(e) => setNovaHabilidadeFruta(prev => ({...prev, alcance: e.target.value}))}
                    className="border-orange-300 dark:border-orange-600"
                  />
                  <textarea
                    placeholder="Descrição e Efeito(s) da habilidade..."
                    value={novaHabilidadeFruta.descricao}
                    onChange={(e) => setNovaHabilidadeFruta(prev => ({...prev, descricao: e.target.value}))}
                    className="p-2 border border-orange-300 dark:border-orange-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={3}
                  />
                  <Button 
                    onClick={adicionarHabilidadeFruta}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Adicionar Habilidade da Fruta
                  </Button>
                </div>
              </div>

              {/* Lista de Habilidades da Fruta */}
              <div className="space-y-3">
                {character.frutaHabilidades && character.frutaHabilidades.length > 0 ? (
                  character.frutaHabilidades.map((habilidade, index) => (
                    <div 
                      key={`fruta-habilidade-${index}`}
                      className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm transition-all duration-200 ${
                        habilidade.comprada 
                          ? 'border-orange-400 dark:border-orange-600 shadow-orange-100 dark:shadow-orange-900/20' 
                          : 'border-orange-200 dark:border-orange-700'
                      }`}
                    >
                      {/* Header da Habilidade */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-orange-700 dark:text-orange-300">
                              {habilidade.nome}
                            </h5>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Custo: {habilidade.custo || 'N/A'} | Alcance: {habilidade.alcance || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={habilidade.comprada || false}
                              onChange={(e) => {
                                const novaLista = character.frutaHabilidades?.map((hab, i) => 
                                  i === index ? { ...hab, comprada: e.target.checked } : hab
                                ) || [];
                                handleAttributeUpdate('frutaHabilidades', novaLista);
                              }}
                              className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <span className={habilidade.comprada ? 'text-orange-600' : 'text-gray-500'}>
                              {habilidade.comprada ? 'Comprada' : 'Disponível'}
                            </span>
                          </label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedFrutaHabilidades(prev => ({...prev, [index]: !prev[index]}))}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            {expandedFrutaHabilidades[index] ? 'Recolher' : 'Expandir'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => iniciarEdicaoFrutaHabilidade(index)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerHabilidadeFruta(index)}
                            className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Formulário de edição ou detalhes expansíveis */}
                      {editingFrutaHabilidade === index ? (
                        <HabilidadeEditForm
                          habilidade={habilidade}
                          onSave={(habilidadeEditada) => salvarEdicaoFrutaHabilidade(index, habilidadeEditada)}
                          onCancel={cancelarEdicaoFrutaHabilidade}
                        />
                      ) : expandedFrutaHabilidades[index] && (
                        <div className="px-3 pb-3 border-t border-orange-200 dark:border-orange-700">
                          <div className="pt-3 space-y-2 text-sm">
                            {habilidade.custoCompra && String(habilidade.custoCompra) !== '0' && (
                              <div>
                                <strong>Custo de Compra:</strong> {habilidade.custoCompra}
                              </div>
                            )}
                            <div>
                              <strong>Descrição:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {habilidade.desc || habilidade.descricao || 'Sem descrição'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                    Nenhuma habilidade da fruta cadastrada
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

export default SkillsTab;