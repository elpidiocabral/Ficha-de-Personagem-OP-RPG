import React, { useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import { Character } from './types';
import './index.css';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'character'>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const { createCharacter, createDefaultCharacter } = useCharacter();

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('character');
  };

  const handleCreateNew = () => {
    // Criar um novo personagem vazio e abrir a ficha
    const defaultCharacterData = createDefaultCharacter();
    const newCharacter = createCharacter(defaultCharacterData);
    setSelectedCharacter(newCharacter);
    setCurrentView('character');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCharacter(null);
  };

  return (
    <div className="App">
      {currentView === 'menu' && (
        <CharacterMenu
          onSelectCharacter={handleSelectCharacter}
          onCreateNew={handleCreateNew}
        />
      )}
      
      {currentView === 'character' && selectedCharacter && (
        <CharacterSheet
          character={selectedCharacter}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
};

export default App;