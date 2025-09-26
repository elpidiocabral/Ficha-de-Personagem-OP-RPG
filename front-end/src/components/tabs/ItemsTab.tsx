import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Character, Item, Ataque } from '../../types';

interface ItemsTabProps {
  character: Character;
  handleAttributeUpdate: (field: keyof Character, value: any) => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({
  character,
  handleAttributeUpdate,
}) => {
  // Estados para controle de itens
  const [novoItem, setNovoItem] = useState<Omit<Item, 'id'>>({
    nome: '',
    categoria: 'Equipamento',
    durabilidade: '',
    usos: 1,
    descricao: '',
    peso: 0,
    valor: 0,
    equipado: false,
  });

  // Estados para controle de ataques
  const [novoAtaque, setNovoAtaque] = useState<Omit<Ataque, 'id'>>({
    nome: '',
    dano: '',
    categoria: 'Corpo a Corpo',
    tipo: 'Físico',
    atributo: 'Força',
    alcance: 'Corpo a Corpo',
    descricao: '',
    observacoes: '',
  });

  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingAtaque, setEditingAtaque] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [expandedAtaques, setExpandedAtaques] = useState<Record<number, boolean>>({});

  // Função para gerar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // ===== FUNÇÕES PARA ITENS =====
  
  const adicionarItem = () => {
    if (!novoItem.nome.trim()) {
      alert('Nome do item é obrigatório!');
      return;
    }

    const itemComId: Item = {
      ...novoItem,
      id: generateId()
    };

    const novaLista = [...(character.listaItens || []), itemComId];
    handleAttributeUpdate('listaItens', novaLista);
    
    // Limpar formulário
    setNovoItem({
      nome: '',
      categoria: 'Equipamento',
      durabilidade: '100',
      usos: 1,
      descricao: '',
      peso: 0,
      valor: 0,
      equipado: false,
    });
  };

  const removerItem = (index: number) => {
    const novaLista = character.listaItens?.filter((_, i) => i !== index) || [];
    handleAttributeUpdate('listaItens', novaLista);
  };

  const toggleEquipado = (index: number) => {
    const novaLista = character.listaItens?.map((item, i) => 
      i === index ? {...item, equipado: !item.equipado} : item
    ) || [];
    handleAttributeUpdate('listaItens', novaLista);
  };

  const salvarEdicaoItem = (index: number, itemEditado: Item) => {
    const novaLista = character.listaItens?.map((item, i) => 
      i === index ? itemEditado : item
    ) || [];
    handleAttributeUpdate('listaItens', novaLista);
    setEditingItem(null);
  };

  // ===== FUNÇÕES PARA ATAQUES =====
  
  const adicionarAtaque = () => {
    if (!novoAtaque.nome.trim()) {
      alert('Nome do ataque é obrigatório!');
      return;
    }

    const ataqueComId: Ataque = {
      ...novoAtaque,
      id: generateId()
    };

    const novaLista = [...(character.ataques || []), ataqueComId];
    handleAttributeUpdate('ataques', novaLista);
    
    // Limpar formulário
    setNovoAtaque({
      nome: '',
      dano: '',
      categoria: 'Corpo a Corpo',
      tipo: 'Físico',
      atributo: 'Força',
      alcance: 'Corpo a Corpo',
      descricao: '',
      observacoes: '',
    });
  };

  const removerAtaque = (index: number) => {
    const novaLista = character.ataques?.filter((_, i) => i !== index) || [];
    handleAttributeUpdate('ataques', novaLista);
  };

  const salvarEdicaoAtaque = (index: number, ataqueEditado: Ataque) => {
    const novaLista = character.ataques?.map((ataque, i) => 
      i === index ? ataqueEditado : ataque
    ) || [];
    handleAttributeUpdate('ataques', novaLista);
    setEditingAtaque(null);
  };

  // Componente de edição de item
  const ItemEditForm: React.FC<{
    item: Item;
    onSave: (item: Item) => void;
    onCancel: () => void;
  }> = ({ item, onSave, onCancel }) => {
    const [editedItem, setEditedItem] = useState<Item>(item);

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Nome do item"
            value={editedItem.nome}
            onChange={(e) => setEditedItem({...editedItem, nome: e.target.value})}
            className="text-sm"
          />
          <select
            value={editedItem.categoria}
            onChange={(e) => setEditedItem({...editedItem, categoria: e.target.value})}
            className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="Arma">Arma</option>
            <option value="Armadura">Armadura</option>
            <option value="Equipamento">Equipamento</option>
            <option value="Item">Item</option>
            <option value="Consumível">Consumível</option>
            <option value="Tesouro">Tesouro</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="Durabilidade"
              value={editedItem.durabilidade || ''}
              onChange={(e) => setEditedItem({...editedItem, durabilidade: e.target.value})}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Usos"
              value={editedItem.usos || ''}
              onChange={(e) => setEditedItem({...editedItem, usos: parseInt(e.target.value) || 0})}
              className="text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Peso (kg)"
            value={editedItem.peso || ''}
            onChange={(e) => setEditedItem({...editedItem, peso: parseFloat(e.target.value) || 0})}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Valor (Berries)"
            value={editedItem.valor || ''}
            onChange={(e) => setEditedItem({...editedItem, valor: parseInt(e.target.value) || 0})}
            className="text-sm"
          />
        </div>
        <textarea
          placeholder="Descrição do item..."
          value={editedItem.descricao}
          onChange={(e) => setEditedItem({...editedItem, descricao: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 resize-none"
          rows={3}
        />
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedItem.equipado}
              onChange={(e) => setEditedItem({...editedItem, equipado: e.target.checked})}
            />
            <span className="text-sm">Equipado</span>
          </label>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" onClick={() => onSave(editedItem)} className="text-xs bg-green-600 hover:bg-green-700">
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel} className="text-xs">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Componente de edição de ataque
  const AtaqueEditForm: React.FC<{
    ataque: Ataque;
    onSave: (ataque: Ataque) => void;
    onCancel: () => void;
  }> = ({ ataque, onSave, onCancel }) => {
    const [editedAtaque, setEditedAtaque] = useState<Ataque>(ataque);

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Nome do ataque"
            value={editedAtaque.nome}
            onChange={(e) => setEditedAtaque({...editedAtaque, nome: e.target.value})}
            className="text-sm"
          />
          <Input
            placeholder="Dano (ex: 1d6+2)"
            value={editedAtaque.dano}
            onChange={(e) => setEditedAtaque({...editedAtaque, dano: e.target.value})}
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={editedAtaque.categoria}
            onChange={(e) => setEditedAtaque({...editedAtaque, categoria: e.target.value})}
            className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="Corpo a Corpo">Corpo a Corpo</option>
            <option value="À Distância">À Distância</option>
            <option value="Área">Área</option>
          </select>
          <select
            value={editedAtaque.tipo}
            onChange={(e) => setEditedAtaque({...editedAtaque, tipo: e.target.value})}
            className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="Físico">Físico</option>
            <option value="Elemental">Elemental</option>
            <option value="Especial">Especial</option>
          </select>
          <select
            value={editedAtaque.atributo}
            onChange={(e) => setEditedAtaque({...editedAtaque, atributo: e.target.value})}
            className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="Força">Força</option>
            <option value="Destreza">Destreza</option>
            <option value="Vitalidade">Vitalidade</option>
            <option value="Aparência">Aparência</option>
            <option value="Conhecimento">Conhecimento</option>
            <option value="Raciocínio">Raciocínio</option>
            <option value="Vontade">Vontade</option>
            <option value="Destino">Destino</option>
            <option value="Velocidade">Velocidade</option>
            <option value="Resiliência">Resiliência</option>
          </select>
          <Input
            placeholder="Alcance"
            value={editedAtaque.alcance}
            onChange={(e) => setEditedAtaque({...editedAtaque, alcance: e.target.value})}
            className="text-sm"
          />
        </div>
        <textarea
          placeholder="Descrição do ataque..."
          value={editedAtaque.descricao}
          onChange={(e) => setEditedAtaque({...editedAtaque, descricao: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 resize-none"
          rows={3}
        />
        <textarea
          placeholder="Observações..."
          value={editedAtaque.observacoes}
          onChange={(e) => setEditedAtaque({...editedAtaque, observacoes: e.target.value})}
          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSave(editedAtaque)} className="text-xs bg-green-600 hover:bg-green-700">
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="text-xs">
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  // Calcular estatísticas
  const pesoTotal = character.listaItens?.reduce((total, item) => total + (item.peso || 0), 0) || 0;
  const valorTotal = character.listaItens?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
  const itensEquipados = character.listaItens?.filter(item => item.equipado).length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Coluna da esquerda - Itens & Equipamentos */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Estatísticas dos Itens */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                Resumo do Inventário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {character.listaItens?.length || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Itens Total</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {itensEquipados}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Equipados</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {pesoTotal.toFixed(1)}kg
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Peso Total</div>
                </div>
              </div>
              <div className="mt-4 text-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  ₿ {valorTotal.toLocaleString()}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Valor Total dos Itens</div>
              </div>
            </CardContent>
          </Card>

          {/* Adicionar Item */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                Adicionar Item/Equipamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do Item/Arma/Ferramenta"
                  value={novoItem.nome}
                  onChange={(e) => setNovoItem(prev => ({...prev, nome: e.target.value}))}
                />
                <select
                  value={novoItem.categoria}
                  onChange={(e) => setNovoItem(prev => ({...prev, categoria: e.target.value}))}
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="Arma">Arma</option>
                  <option value="Armadura">Armadura</option>
                  <option value="Equipamento">Equipamento</option>
                  <option value="Item">Item</option>
                  <option value="Consumível">Consumível</option>
                  <option value="Tesouro">Tesouro</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  type="text"
                  placeholder="Durabilidade"
                  value={novoItem.durabilidade || ''}
                  onChange={(e) => setNovoItem(prev => ({...prev, durabilidade: e.target.value}))}
                />
                <Input
                  type="number"
                  placeholder="Usos"
                  value={novoItem.usos || ''}
                  onChange={(e) => setNovoItem(prev => ({...prev, usos: parseInt(e.target.value) || 0}))}
                />
                <Input
                  type="number"
                  placeholder="Peso (kg)"
                  value={novoItem.peso || ''}
                  onChange={(e) => setNovoItem(prev => ({...prev, peso: parseFloat(e.target.value) || 0}))}
                />
                <Input
                  type="number"
                  placeholder="Valor (₿)"
                  value={novoItem.valor || ''}
                  onChange={(e) => setNovoItem(prev => ({...prev, valor: parseInt(e.target.value) || 0}))}
                />
              </div>

              <textarea
                placeholder="Descrição / Observações"
                value={novoItem.descricao}
                onChange={(e) => setNovoItem(prev => ({...prev, descricao: e.target.value}))}
                className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                rows={3}
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={novoItem.equipado}
                    onChange={(e) => setNovoItem(prev => ({...prev, equipado: e.target.checked}))}
                  />
                  <span>Equipado</span>
                </label>
                <Button 
                  onClick={adicionarItem}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
                >
                  Adicionar Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Itens */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                Inventário ({character.listaItens?.length || 0} itens)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {character.listaItens && character.listaItens.length > 0 ? (
                character.listaItens.map((item, index) => (
                  <div 
                    key={`item-${index}`}
                    className={`rounded-lg border shadow-sm transition-all duration-200 ${
                      item.equipado 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Header do Item */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-semibold ${
                            item.equipado 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {item.nome}
                          </h5>
                          {item.equipado && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              EQUIPADO
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.categoria} | {item.durabilidade || 0}/{item.usos || 1} | {item.peso || 0}kg | ₿{item.valor || 0}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleEquipado(index)}
                          className={`text-xs px-2 py-1 h-auto ${
                            item.equipado 
                              ? 'text-green-600 border-green-300 hover:bg-green-50' 
                              : 'text-blue-600 border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {item.equipado ? 'Desequipar' : 'Equipar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedItems(prev => ({...prev, [index]: !prev[index]}))}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {expandedItems[index] ? 'Recolher' : 'Expandir'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(index)}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removerItem(index)}
                          className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>

                    {/* Formulário de edição ou detalhes expansíveis */}
                    {editingItem === index ? (
                      <ItemEditForm
                        item={item}
                        onSave={(itemEditado) => salvarEdicaoItem(index, itemEditado)}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : expandedItems[index] && (
                      <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="pt-3 space-y-2 text-sm">
                          {item.descricao && (
                            <div>
                              <strong>Descrição:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {item.descricao}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <div><strong>Categoria:</strong> {item.categoria}</div>
                            <div><strong>Durabilidade:</strong> {item.durabilidade || 0}</div>
                            <div><strong>Usos:</strong> {item.usos || 1}</div>
                            <div><strong>Status:</strong> {item.equipado ? 'Equipado' : 'No inventário'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                  Nenhum item no inventário
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita - Ataques */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Adicionar Ataque */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Adicionar Ataque/Técnica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do Ataque/Técnica"
                  value={novoAtaque.nome}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, nome: e.target.value}))}
                />
                <Input
                  placeholder="Dano (ex: 1d6+2, 2d8)"
                  value={novoAtaque.dano}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, dano: e.target.value}))}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select
                  value={novoAtaque.categoria}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, categoria: e.target.value}))}
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="Corpo a Corpo">Corpo a Corpo</option>
                  <option value="À Distância">À Distância</option>
                  <option value="Área">Área</option>
                </select>
                <select
                  value={novoAtaque.tipo}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, tipo: e.target.value}))}
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="Físico">Físico</option>
                  <option value="Elemental">Elemental</option>
                  <option value="Especial">Especial</option>
                </select>
                <select
                  value={novoAtaque.atributo}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, atributo: e.target.value}))}
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="Força">Força</option>
                  <option value="Destreza">Destreza</option>
                  <option value="Vitalidade">Vitalidade</option>
                  <option value="Aparência">Aparência</option>
                  <option value="Conhecimento">Conhecimento</option>
                  <option value="Raciocínio">Raciocínio</option>
                  <option value="Vontade">Vontade</option>
                  <option value="Destino">Destino</option>
                  <option value="Velocidade">Velocidade</option>
                  <option value="Resiliência">Resiliência</option>
                </select>
                <Input
                  placeholder="Alcance"
                  value={novoAtaque.alcance}
                  onChange={(e) => setNovoAtaque(prev => ({...prev, alcance: e.target.value}))}
                />
              </div>

              <textarea
                placeholder="Descrição do ataque / Como funciona"
                value={novoAtaque.descricao}
                onChange={(e) => setNovoAtaque(prev => ({...prev, descricao: e.target.value}))}
                className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                rows={3}
              />

              <textarea
                placeholder="Observações / Efeitos especiais"
                value={novoAtaque.observacoes}
                onChange={(e) => setNovoAtaque(prev => ({...prev, observacoes: e.target.value}))}
                className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                rows={2}
              />

              <Button 
                onClick={adicionarAtaque}
                className="bg-red-600 hover:bg-red-700 text-white w-full"
              >
                Adicionar Ataque
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Ataques */}
          <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                Arsenal de Ataques ({character.ataques?.length || 0} ataques)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {character.ataques && character.ataques.length > 0 ? (
                character.ataques.map((ataque, index) => (
                  <div 
                    key={`ataque-${index}`}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700 shadow-sm transition-all duration-200"
                  >
                    {/* Header do Ataque */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-orange-700 dark:text-orange-300">
                          {ataque.nome}
                        </h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ataque.categoria} | {ataque.tipo} | {ataque.atributo} | Dano: {ataque.dano} | {ataque.alcance}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedAtaques(prev => ({...prev, [index]: !prev[index]}))}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {expandedAtaques[index] ? 'Recolher' : 'Expandir'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingAtaque(index)}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removerAtaque(index)}
                          className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>

                    {/* Formulário de edição ou detalhes expansíveis */}
                    {editingAtaque === index ? (
                      <AtaqueEditForm
                        ataque={ataque}
                        onSave={(ataqueEditado) => salvarEdicaoAtaque(index, ataqueEditado)}
                        onCancel={() => setEditingAtaque(null)}
                      />
                    ) : expandedAtaques[index] && (
                      <div className="px-3 pb-3 border-t border-orange-200 dark:border-orange-700">
                        <div className="pt-3 space-y-2 text-sm">
                          {ataque.descricao && (
                            <div>
                              <strong>Descrição:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {ataque.descricao}
                              </div>
                            </div>
                          )}
                          {ataque.observacoes && (
                            <div>
                              <strong>Observações:</strong> 
                              <div className="mt-1 whitespace-pre-wrap">
                                {ataque.observacoes}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <div><strong>Categoria:</strong> {ataque.categoria}</div>
                            <div><strong>Tipo:</strong> {ataque.tipo}</div>
                            <div><strong>Atributo:</strong> {ataque.atributo}</div>
                            <div><strong>Alcance:</strong> {ataque.alcance}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                  Nenhum ataque registrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemsTab;