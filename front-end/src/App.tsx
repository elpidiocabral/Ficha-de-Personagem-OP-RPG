import React, { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import Login from './components/Login';
import AuthSuccess from './pages/AuthSuccess';
import { Character } from './types';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import './index.css';

const AppContent: React.FC = () => {
  useAuthBootstrap();

  // Verificar se está na página de callback do Discord
  const isAuthSuccessPage = window.location.pathname === '/auth/success';

  const [currentView, setCurrentView] = useState<'login' | 'menu' | 'character' | 'auth-success'>(() => {
    if (isAuthSuccessPage) return 'auth-success';
    return localStorage.getItem('auth_token') ? 'menu' : 'login';
  });

  // Verificar se há token no hash da URL
  useEffect(() => {
    const processTokenFromHash = () => {
      const hash = window.location.hash;
      if (hash.includes('token=')) {
        const token = hash.split('token=')[1]?.split('&')[0];
        if (token && token !== 'undefined') {
          console.log('🔑 Token encontrado no hash, salvando...');
          localStorage.setItem('auth_token', token);
          
          // Limpar o hash da URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Disparar evento para atualizar a UI
          window.dispatchEvent(new Event('auth:changed'));
          
          // Atualizar o view para mostrar o menu
          setCurrentView('menu');
        }
      }
    };

    processTokenFromHash();
  }, []);

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
      {currentView === 'auth-success' && <AuthSuccess />}
      
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
