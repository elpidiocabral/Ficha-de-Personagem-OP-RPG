import React, { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import Login from './components/Login';
import { Character } from './types';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import './index.css';

const AppContent: React.FC = () => {
  useAuthBootstrap();

  const [currentView, setCurrentView] = useState<'login' | 'menu' | 'character'>(() =>
    localStorage.getItem('auth_token') ? 'menu' : 'login'
  );

  // garante redirecionamento após login
  useAuthBootstrap(() => setCurrentView('menu'));
  useEffect(() => {
    if (localStorage.getItem('auth_token')) setCurrentView('menu');
  }, []);

  // salva o token de login
  useEffect(() => {
    const onAuth = () => setCurrentView('menu');
    window.addEventListener('auth:changed', onAuth);
    return () => window.removeEventListener('auth:changed', onAuth);
  }, []);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const { createCharacter, createDefaultCharacter, characters } = useCharacter();

  const selectedCharacter = selectedCharacterId
    ? characters.find((char) => char.id === selectedCharacterId) || null
    : null;

  const handleLogin = () => setCurrentView('menu');

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacterId(character.id || null);
    setCurrentView('character');
  };

  const handleCreateNew = () => {
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
    // limpa autenticação real
    localStorage.removeItem('auth_token');
    setCurrentView('login');
    setSelectedCharacterId(null);
  };

  return (
    <div className="App">
      {currentView === 'login' && <Login onLogin={handleLogin} />}

      {currentView === 'menu' && (
        <CharacterMenu
          onSelectCharacter={handleSelectCharacter}
          onCreateNew={handleCreateNew}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'character' && selectedCharacter && (
        <CharacterSheet character={selectedCharacter} onBack={handleBackToMenu} onLogout={handleLogout} />
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
