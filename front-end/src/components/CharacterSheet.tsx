import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Character } from '../types';
import { useCharacter } from '../contexts/CharacterContext';
import AttributesTab from './tabs/AttributesTab';
import SkillsTab from './tabs/SkillsTab';
import PersonalTab from './tabs/PersonalTab';
import ItemsTab from './tabs/ItemsTab';

interface CharacterSheetProps {
  character: Character;
  onBack: () => void;
}

type TabType = 'attributes' | 'skills' | 'personal' | 'items';

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('attributes');
  const { updateCharacter, theme, toggleTheme } = useCharacter();

  const handleCharacterUpdate = (updates: Partial<Character>) => {
    console.log('handleCharacterUpdate chamado com:', updates);
    if (character.id) {
      updateCharacter(character.id, updates);
    }
  };

  // Wrapper para compatibilidade com diferentes assinaturas
  const handleAttributeUpdate = (field: keyof Character, value: any) => {
    handleCharacterUpdate({ [field]: value });
  };

  const isDarkMode = theme === 'dark';

  const tabs = [
    { id: 'attributes' as const, label: 'Atributos' },
    { id: 'skills' as const, label: 'Habilidades & Fruta' },
    { id: 'personal' as const, label: 'Pessoal' },
    { id: 'items' as const, label: 'Itens & Equipamentos' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
          
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="theme-toggle"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Modo Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Modo Escuro
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 shadow-2xl border-b-4 border-blue-300 dark:border-blue-700">
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
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white dark:bg-gray-900"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-screen-2xl">`
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
  );
};

export default CharacterSheet;