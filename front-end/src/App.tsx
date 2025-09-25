import React, { useState } from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import { Character } from './types';
import './index.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'character' | 'create'>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('character');
  };

  const handleCreateNew = () => {
    setCurrentView('create');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCharacter(null);
  };

  return (
    <CharacterProvider>
      <div className="App">
        {currentView === 'menu' && (
          <CharacterMenu
            onSelectCharacter={handleSelectCharacter}
            onCreateNew={handleCreateNew}
          />
        )}
        
        {currentView === 'create' && (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Criação de Personagem</h2>
              <p className="text-muted-foreground mb-4">Em desenvolvimento...</p>
              <button
                onClick={handleBackToMenu}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'character' && selectedCharacter && (
          <CharacterSheet
            character={selectedCharacter}
            onBack={handleBackToMenu}
          />
        )}
      </div>
    </CharacterProvider>
  );
};

export default App;