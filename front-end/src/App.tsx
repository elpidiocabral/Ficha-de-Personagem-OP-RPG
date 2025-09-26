import React, { useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import { Character } from './types';
import './index.css';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'character'>('menu');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const { createCharacter, createDefaultCharacter, characters } = useCharacter();

  // Encontrar o personagem atual baseado no ID
  const selectedCharacter = selectedCharacterId 
    ? characters.find(char => char.id === selectedCharacterId) || null
    : null;

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacterId(character.id || null);
    setCurrentView('character');
  };

  const handleCreateNew = () => {
    // Criar um novo personagem vazio e abrir a ficha
    const defaultCharacterData = createDefaultCharacter();
    const newCharacter = createCharacter(defaultCharacterData);
    setSelectedCharacterId(newCharacter.id || null);
    setCurrentView('character');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCharacterId(null);
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