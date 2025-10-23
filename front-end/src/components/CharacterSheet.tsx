import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Character } from '../types';
import { useCharacter } from '../contexts/CharacterContext';
import AttributesTab from './tabs/AttributesTab';
import SkillsTab from './tabs/SkillsTab';
import PersonalTab from './tabs/PersonalTab';
import ItemsTab from './tabs/ItemsTab';
import UserDropdown from './UserDropdown';
import Settings from './Settings';

interface CharacterSheetProps {
  character: Character;
  onBack: () => void;
  onLogout: () => void; // Adicionar prop para logout
}

type TabType = 'attributes' | 'skills' | 'personal' | 'items';

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('attributes');
  const [isHakiModalOpen, setIsHakiModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { updateCharacter } = useCharacter();

  const handleCharacterUpdate = (updates: Partial<Character>) => {

    if (character.id) {
      updateCharacter(character.id, updates);
    }
  };

  // Função para gastar Haki
  const gastarHaki = (valor: number) => {
    const hakiAtual = character.hakiAtual || 0;
    const novoHaki = Math.max(0, hakiAtual - valor);
    handleCharacterUpdate({ hakiAtual: novoHaki });
  };

  // Função para recuperar Haki por turno
  const recuperarHakiPorTurno = () => {
    const hakiAtual = character.hakiAtual || 0;
    const hakiMax = Number(character.determinacao) || 0;
    const vontadeTotal = (Number(character.vontadeBase) || 0) + (Number(character.vontadeBonus) || 0);
    const novoHaki = Math.min(hakiMax, hakiAtual + vontadeTotal);
    handleCharacterUpdate({ hakiAtual: novoHaki });
  };

  // Wrapper para compatibilidade com diferentes assinaturas
  const handleAttributeUpdate = (field: keyof Character, value: any) => {
    handleCharacterUpdate({ [field]: value });
  };

  const tabs = [
    { id: 'attributes' as const, label: 'Atributos' },
    { id: 'skills' as const, label: 'Habilidades & Fruta' },
    { id: 'personal' as const, label: 'Pessoal' },
    { id: 'items' as const, label: 'Itens & Equipamentos' },
  ];

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
    <>
      {/* Botão flutuante de Haki - só aparece na aba de atributos */}
      {activeTab === 'attributes' && (
        <>
          <button
            onClick={() => setIsHakiModalOpen(!isHakiModalOpen)}
            className="fixed top-40 right-8 z-50 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
            title="Gerenciar Haki"
          >
            <span className="text-lg font-bold">覇</span>
          </button>

          {/* Modal de Haki */}
          {isHakiModalOpen && (
            <div className="fixed top-40 right-24 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <span className="text-xl">覇</span>
                  Haki
                </h2>
                <button
                  onClick={() => setIsHakiModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Barra de Haki */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-purple-600 dark:text-purple-400">Haki</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="number"
                      value={character.hakiAtual || 0}
                      onChange={(e) => handleCharacterUpdate({ hakiAtual: Math.max(0, Math.min(parseInt(e.target.value) || 0, Number(character.determinacao) || 0)) })}
                      min="0"
                      max={Number(character.determinacao) || 0}
                      className="w-14 h-7 text-center text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300"
                    />
                    <span className="text-purple-600 dark:text-purple-400">/</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{character.determinacao || 0}</span>
                  </div>
                </div>

                <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(5, Math.min(((character.hakiAtual || 0) / (Number(character.determinacao) || 1)) * 100, 100))}%`,
                    }}
                  />
                </div>

                {/* Controles de Haki */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Gastar Haki</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Qtd"
                        className="flex-1 h-7 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700"
                        id="gastarHakiInput"
                        min="1"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('gastarHakiInput') as HTMLInputElement;
                          const valor = parseInt(input.value) || 0;
                          if (valor > 0) {
                            gastarHaki(valor);
                            input.value = '';
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                      >
                        Gastar
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={recuperarHakiPorTurno}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Recuperar por Turno (+{((Number(character.vontadeBase) || 0) + (Number(character.vontadeBonus) || 0))})
                  </button>
                </div>

                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <div><strong>Máx:</strong> {character.determinacao || 0} (Determinação)</div>
                  <div><strong>Rec/turno:</strong> {((Number(character.vontadeBase) || 0) + (Number(character.vontadeBonus) || 0))} (Vontade)</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Menu
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Ficha One Piece RPG - A Vontade Dos Mares</h1>
            </div>
          </div>
          
          <UserDropdown 
            onLogout={onLogout}
            onSettings={() => setShowSettings(true)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="shadow-2xl border-b-4 border-blue-300 dark:border-blue-700">
        <div className="w-full px-1">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-16 py-4 text-xl font-bold transition-all duration-300 relative shadow-lg border-r-2 last:border-r-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl transform -translate-y-1 border-blue-500 scale-102 z-10'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:scale-101 border-gray-300 dark:border-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-2 py-4 max-w-screen-2xl">
        <div className="bg-white/20 dark:bg-black/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20">
          {activeTab === 'attributes' && (
            <AttributesTab 
              character={character} 
              onUpdate={handleCharacterUpdate} 
            />
          )}
        
          {activeTab === 'skills' && (
            <SkillsTab 
              character={character} 
              handleAttributeUpdate={handleAttributeUpdate}
            />
          )}
          
          {activeTab === 'personal' && (
            <PersonalTab 
              character={character} 
              handleAttributeUpdate={handleAttributeUpdate}
            />
          )}
          
          {activeTab === 'items' && (
            <ItemsTab 
              character={character} 
              handleAttributeUpdate={handleAttributeUpdate}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CharacterSheet;