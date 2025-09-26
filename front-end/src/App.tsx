import React, { useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import Login from './components/Login';
import { Character } from './types';
import './index.css';

const AppContent: React.FC = () => {
  // Verificar se já fez login (persistir durante a sessão)
  const [currentView, setCurrentView] = useState<'login' | 'menu' | 'character'>(() => {
    const hasLoggedIn = sessionStorage.getItem('onePieceRPG-loggedIn');
    return hasLoggedIn ? 'menu' : 'login';
  });
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const { createCharacter, createDefaultCharacter, characters } = useCharacter();

  // Encontrar o personagem atual baseado no ID
  const selectedCharacter = selectedCharacterId 
    ? characters.find(char => char.id === selectedCharacterId) || null
    : null;

  const handleLogin = () => {
    // Marcar como logado durante a sessão
    sessionStorage.setItem('onePieceRPG-loggedIn', 'true');
    setCurrentView('menu');
  };

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

  const handleLogout = () => {
    // Remover marcação de login
    sessionStorage.removeItem('onePieceRPG-loggedIn');
    setCurrentView('login');
    setSelectedCharacterId(null);
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentView === 'menu' && (
        <CharacterMenu
          onSelectCharacter={handleSelectCharacter}
          onCreateNew={handleCreateNew}
          onLogout={handleLogout}
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