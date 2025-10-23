import React, { useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Character } from '../types';
import { Anchor, Trash2, Play, Copy, Download, FolderOpen } from 'lucide-react';
import UserDropdown from './UserDropdown';
import Settings from './Settings';

interface CharacterMenuProps {
  onSelectCharacter: (character: Character) => void;
  onCreateNew: () => void;
  onLogout: () => void; // Tornado obrigatório
}

const CharacterMenu: React.FC<CharacterMenuProps> = ({ onSelectCharacter, onCreateNew, onLogout }) => {
  const {
    characters,
    duplicateCharacter,
    deleteCharacter,
    exportCharacter,
    importCharacter,
    clearAllCharacters
  } = useCharacter();
  
  const [showImportExport, setShowImportExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importCharacter(file);
      event.target.value = '';
    }
  };

  const handleDuplicate = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    duplicateCharacter(id);
  };

  const handleExport = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    exportCharacter(id);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este personagem?')) {
      deleteCharacter(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza que deseja excluir TODOS os personagens? Esta ação não pode ser desfeita.')) {
      clearAllCharacters();
    }
  };

  // Se estiver na página de configurações, mostrar apenas ela
  if (showSettings) {
    return (
      <Settings 
        onBack={() => setShowSettings(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="menu-inicial">
      <div className="container mx-auto px-4 py-8">
        {/* Header com UserDropdown no canto direito */}
        <div className="relative mb-8">
          {/* UserDropdown no canto superior direito */}
          <div className="absolute top-0 right-0 z-20">
            <UserDropdown 
              onLogout={onLogout}
              onSettings={() => setShowSettings(true)}
            />
          </div>

          {/* Título centralizado */}
          <div className="text-center text-white relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 enhanced-text drop-shadow-lg">
              One Piece RPG - A Vontade Dos Mares
            </h1>
            <p className="text-xl mb-6 enhanced-text-light drop-shadow">
              Selecione um personagem ou crie um novo pirata!
            </p>
          </div>
        </div>

        {/* Action Buttons centralizados */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 relative z-10">
          <Button
            onClick={onCreateNew}
            size="lg"
            className="btn-one-piece bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
          >
            <Anchor className="w-6 h-6 mr-2" />
            Criar Novo Personagem
          </Button>
          
          <Button
            onClick={() => setShowImportExport(true)}
            variant="secondary"
            size="lg"
            className="btn-one-piece bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
          >
            <FolderOpen className="w-6 h-6 mr-2" />
            Import/Export
          </Button>
          
          {/* Botão para abrir a Ficha Legado (abre em nova aba) */}
          <Button
            onClick={() => window.open('/legado/index.html', '_blank', 'noopener,noreferrer')}
            size="lg"
            className="btn-one-piece bg-white text-gray-800 px-8 py-4 text-lg font-semibold shadow-sm"
          >
            <FolderOpen className="w-6 h-6 mr-2 text-gray-800" />
            Ficha Legado
          </Button>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="character-card-hover glass-card cursor-pointer"
              onClick={() => onSelectCharacter(character)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {character.avatarBase64 ? (
                    <img
                      src={character.avatarBase64}
                      alt={character.nome || 'Personagem'}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-600 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto bg-blue-500 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                      <Anchor className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold enhanced-text mb-2">
                  {character.nome || 'Sem nome'}
                </h3>
                
                <div className="space-y-1 enhanced-text-light">
                  <p><span className="font-medium">Classe:</span> {character.classe || 'Não definida'}</p>
                  <p><span className="font-medium">Nível:</span> {character.nivelClasse || 1}</p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCharacter(character);
                    }}
                    className="w-full btn-one-piece bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Jogar
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => character.id && handleDuplicate(character.id, e)}
                      variant="outline"
                      size="sm"
                      className="flex-1 interactive-element"
                      disabled={!character.id}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicar
                    </Button>
                    
                    <Button
                      onClick={(e) => character.id && handleExport(character.id, e)}
                      variant="outline"
                      size="sm"
                      className="flex-1 interactive-element"
                      disabled={!character.id}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                    
                    <Button
                      onClick={(e) => character.id && handleDelete(character.id, e)}
                      variant="outline"
                      size="sm"
                      className="flex-1 interactive-element text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                      disabled={!character.id}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {characters.length === 0 && (
          <Card className="glass-card max-w-md mx-auto text-center relative z-10">
            <CardContent className="p-8">
              <Anchor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold enhanced-text mb-2">Nenhum Personagem</h3>
              <p className="enhanced-text-light mb-4">
                Crie seu primeiro pirata para começar sua aventura!
              </p>
              <Button onClick={onCreateNew} className="btn-one-piece">
                <Anchor className="w-4 h-4 mr-2" />
                Criar Primeiro Personagem
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Import/Export Panel */}
        {showImportExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="import-export-panel max-w-md mx-auto m-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="enhanced-text">Import/Export de Personagens</CardTitle>
                  <Button
                    onClick={() => setShowImportExport(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium enhanced-text-light mb-2">
                    Importar Personagem:
                  </label>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="interactive-element"
                  />
                </div>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  className="w-full interactive-element"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Todos os Personagens
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterMenu;